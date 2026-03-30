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
/// Background job that runs pg_dump against the saved connection and
/// stores the resulting SQL file on the server. On success a restore job
/// is automatically enqueued.
/// </summary>
[UnitOfWork]
public class DatabaseDumpJob
    : AsyncBackgroundJob<DatabaseDumpArgs>, ITransientDependency
{
    private readonly IRepository<DatabaseConnection, Guid> _repository;
    private readonly IBackgroundJobManager _backgroundJobManager;

    public DatabaseDumpJob(
        IRepository<DatabaseConnection, Guid> repository,
        IBackgroundJobManager backgroundJobManager)
    {
        _repository = repository;
        _backgroundJobManager = backgroundJobManager;
    }

    public override async Task ExecuteAsync(DatabaseDumpArgs args)
    {
        Logger.Info($"[DatabaseDumpJob] Starting dump for connection {args.ConnectionId}");

        var connection = await _repository.GetAsync(args.ConnectionId);
        connection.DumpStatus = DumpStatus.InProgress;
        await _repository.UpdateAsync(connection);
        await CurrentUnitOfWork.SaveChangesAsync();

        var dumpFilePath = GetDumpFilePath(args.ConnectionId);
        var schemaOnly = args.SchemaOnly;
        string errorMessage = null;
        var succeeded = false;

        try
        {
            Directory.CreateDirectory(Path.GetDirectoryName(dumpFilePath)!);
            var (exitCode, stderr) = await RunPgDumpAsync(connection, dumpFilePath, schemaOnly);

            if (exitCode != 0)
            {
                errorMessage = $"pg_dump exited with code {exitCode}. {stderr}".Trim();
                Logger.Warn($"[DatabaseDumpJob] {errorMessage}");
            }
            else if (!File.Exists(dumpFilePath))
            {
                errorMessage = "pg_dump exited successfully but no dump file was created.";
                Logger.Warn($"[DatabaseDumpJob] {errorMessage}");
            }
            else
            {
                succeeded = true;
            }
        }
        catch (Exception ex)
        {
            errorMessage = ex.Message;
            Logger.Error($"[DatabaseDumpJob] Unexpected error for connection {args.ConnectionId}: {ex.Message}", ex);
        }

        connection.DumpStatus = succeeded ? DumpStatus.Completed : DumpStatus.Failed;
        connection.LastDumpTime = DateTime.UtcNow;
        connection.DumpFilePath = succeeded ? dumpFilePath : null;
        connection.DumpErrorMessage = succeeded ? null : errorMessage;
        await _repository.UpdateAsync(connection);

        if (succeeded)
        {
            Logger.Info($"[DatabaseDumpJob] Dump completed for connection {args.ConnectionId}. File: {dumpFilePath}");

            connection.RestoreStatus = RestoreStatus.Pending;
            await _repository.UpdateAsync(connection);

            await _backgroundJobManager.EnqueueAsync<DatabaseRestoreJob, DatabaseRestoreArgs>(
                new DatabaseRestoreArgs { ConnectionId = args.ConnectionId });

            Logger.Info($"[DatabaseDumpJob] Enqueued restore job for connection {args.ConnectionId}.");
        }
        else
        {
            Logger.Warn($"[DatabaseDumpJob] Dump failed for connection {args.ConnectionId}. Error: {errorMessage}");
        }
    }

    private static async Task<(int exitCode, string stderr)> RunPgDumpAsync(
        DatabaseConnection connection, string outputPath, bool schemaOnly)
    {
        var database = string.IsNullOrWhiteSpace(connection.DatabaseName) ? "postgres" : connection.DatabaseName;
        var connString = $"postgresql://{connection.DbUser}:{Uri.EscapeDataString(connection.DbPassword)}@{connection.DbHost}:{connection.DbPort}/{database}";

        var psi = new ProcessStartInfo
        {
            FileName = "pg_dump",
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };

        // Pass each argument separately to avoid shell-parsing issues with special characters
        psi.ArgumentList.Add("--no-password");
        psi.ArgumentList.Add("--format=plain");
        if (schemaOnly)
            psi.ArgumentList.Add("--schema-only");
        psi.ArgumentList.Add($"--file={outputPath}");
        psi.ArgumentList.Add(connString);

        using var process = Process.Start(psi)
            ?? throw new InvalidOperationException("Failed to start pg_dump process.");

        var stderr = await process.StandardError.ReadToEndAsync();
        await process.WaitForExitAsync();

        return (process.ExitCode, stderr);
    }

    private static string GetDumpFilePath(Guid connectionId)
    {
        var baseDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", "Dumps");
        return Path.Combine(baseDir, connectionId.ToString(), "dump.sql");
    }
}
