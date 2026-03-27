using System;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using Abp.BackgroundJobs;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using sql_optimizer.Core.Domains.Database;

namespace sql_optimizer.Services.DatabaseConnectionService.Jobs;

/// <summary>
/// Background job that restores a previously created dump file into a local
/// PostgreSQL instance on the server. On success the connection's
/// <see cref="DatabaseConnection.LocalConnectionString"/> is updated so that
/// all subsequent operations can target the local copy.
/// </summary>
[UnitOfWork]
public class DatabaseRestoreJob
    : AsyncBackgroundJob<DatabaseRestoreArgs>, ITransientDependency
{
    private readonly IRepository<DatabaseConnection, Guid> _repository;

    public DatabaseRestoreJob(IRepository<DatabaseConnection, Guid> repository)
    {
        _repository = repository;
    }

    public override async Task ExecuteAsync(DatabaseRestoreArgs args)
    {
        Logger.Info($"[DatabaseRestoreJob] Starting restore for connection {args.ConnectionId}");

        var connection = await _repository.GetAsync(args.ConnectionId);

        if (string.IsNullOrWhiteSpace(connection.DumpFilePath) || !File.Exists(connection.DumpFilePath))
        {
            Logger.Warn($"[DatabaseRestoreJob] Dump file not found for connection {args.ConnectionId}. Skipping restore.");
            connection.RestoreStatus = RestoreStatus.Failed;
            connection.RestoreErrorMessage = "Dump file does not exist. Run a dump first.";
            await _repository.UpdateAsync(connection);
            return;
        }

        connection.RestoreStatus = RestoreStatus.InProgress;
        await _repository.UpdateAsync(connection);
        await CurrentUnitOfWork.SaveChangesAsync();

        var localHost = Environment.GetEnvironmentVariable("LOCAL_POSTGRES_HOST") ?? "localdb";
        var localPort = Environment.GetEnvironmentVariable("LOCAL_POSTGRES_PORT") ?? "5432";
        var localUser = Environment.GetEnvironmentVariable("LOCAL_POSTGRES_USER") ?? "postgres";
        var localPassword = Environment.GetEnvironmentVariable("LOCAL_POSTGRES_PASSWORD") ?? "postgres";
        var localDbName = $"db_{args.ConnectionId:N}";

        string errorMessage = null;
        var succeeded = false;

        try
        {
            var (createExitCode, createStderr) = await RunPsqlAsync(
                localHost, localPort, localUser, localPassword,
                "postgres",
                $"CREATE DATABASE \"{localDbName}\";");

            // Exit code 1 with "already exists" is acceptable
            if (createExitCode != 0 && !createStderr.Contains("already exists"))
            {
                errorMessage = $"Failed to create local database. psql exited {createExitCode}. {createStderr}".Trim();
                Logger.Warn($"[DatabaseRestoreJob] {errorMessage}");
            }
            else
            {
                var (restoreExitCode, restoreStderr) = await RunPsqlFileAsync(
                    localHost, localPort, localUser, localPassword,
                    localDbName,
                    connection.DumpFilePath);

                if (restoreExitCode != 0)
                {
                    errorMessage = $"psql restore exited with code {restoreExitCode}. {restoreStderr}".Trim();
                    Logger.Warn($"[DatabaseRestoreJob] {errorMessage}");
                }
                else
                {
                    succeeded = true;
                }
            }
        }
        catch (Exception ex)
        {
            errorMessage = ex.Message;
            Logger.Error($"[DatabaseRestoreJob] Unexpected error for connection {args.ConnectionId}: {ex.Message}", ex);
        }

        connection.RestoreStatus = succeeded ? RestoreStatus.Completed : RestoreStatus.Failed;
        connection.LastRestoreTime = DateTime.UtcNow;
        connection.RestoreErrorMessage = succeeded ? null : errorMessage;
        connection.LocalConnectionString = succeeded
            ? $"Host={localHost};Port={localPort};Database={localDbName};Username={localUser};Password={localPassword};"
            : null;

        await _repository.UpdateAsync(connection);

        if (succeeded)
            Logger.Info($"[DatabaseRestoreJob] Restore completed for connection {args.ConnectionId}. Local DB: {localDbName}");
        else
            Logger.Warn($"[DatabaseRestoreJob] Restore failed for connection {args.ConnectionId}. Error: {errorMessage}");
    }

    private static async Task<(int exitCode, string stderr)> RunPsqlAsync(
        string host, string port, string user, string password,
        string database, string sql)
    {
        var psi = BuildPsqlPsi(host, port, user, password, database);
        psi.ArgumentList.Add("-c");
        psi.ArgumentList.Add(sql);
        return await RunProcessAsync(psi, password);
    }

    private static async Task<(int exitCode, string stderr)> RunPsqlFileAsync(
        string host, string port, string user, string password,
        string database, string filePath)
    {
        var psi = BuildPsqlPsi(host, port, user, password, database);
        psi.ArgumentList.Add("-f");
        psi.ArgumentList.Add(filePath);
        return await RunProcessAsync(psi, password);
    }

    private static ProcessStartInfo BuildPsqlPsi(
        string host, string port, string user, string password, string database)
    {
        var psi = new ProcessStartInfo
        {
            FileName = "psql",
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true,
        };

        psi.ArgumentList.Add($"--host={host}");
        psi.ArgumentList.Add($"--port={port}");
        psi.ArgumentList.Add($"--username={user}");
        psi.ArgumentList.Add($"--dbname={database}");
        psi.ArgumentList.Add("--no-password");

        // Pass password via environment variable to avoid it appearing in process list
        psi.EnvironmentVariables["PGPASSWORD"] = password;

        return psi;
    }

    private static async Task<(int exitCode, string stderr)> RunProcessAsync(ProcessStartInfo psi, string _)
    {
        using var process = Process.Start(psi)
            ?? throw new InvalidOperationException("Failed to start psql process.");

        var stderr = await process.StandardError.ReadToEndAsync();
        await process.WaitForExitAsync();
        return (process.ExitCode, stderr);
    }
}
