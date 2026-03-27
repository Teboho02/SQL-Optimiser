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
/// stores the resulting SQL file on the server.
/// </summary>
public class DatabaseDumpJob
    : AsyncBackgroundJob<DatabaseDumpArgs>, ITransientDependency
{
    private readonly IRepository<DatabaseConnection, Guid> _repository;
    private readonly IUnitOfWorkManager _unitOfWorkManager;

    public DatabaseDumpJob(
        IRepository<DatabaseConnection, Guid> repository,
        IUnitOfWorkManager unitOfWorkManager)
    {
        _repository = repository;
        _unitOfWorkManager = unitOfWorkManager;
    }

    public override async Task ExecuteAsync(DatabaseDumpArgs args)
    {
        Logger.Info($"[DatabaseDumpJob] Starting dump for connection {args.ConnectionId}");

        DatabaseConnection connection;

        using (var uow = _unitOfWorkManager.Begin())
        {
            connection = await _repository.GetAsync(args.ConnectionId);
            connection.DumpStatus = DumpStatus.InProgress;
            await _repository.UpdateAsync(connection);
            await uow.CompleteAsync();
        }

        string dumpFilePath = null;
        string errorMessage = null;
        var succeeded = false;

        try
        {
            dumpFilePath = GetDumpFilePath(args.ConnectionId);
            Directory.CreateDirectory(Path.GetDirectoryName(dumpFilePath)!);

            succeeded = await RunPgDumpAsync(connection, dumpFilePath);
        }
        catch (Exception ex)
        {
            Logger.Error($"[DatabaseDumpJob] Unexpected error for connection {args.ConnectionId}: {ex.Message}", ex);
            errorMessage = ex.Message;
        }

        using (var uow = _unitOfWorkManager.Begin())
        {
            var entity = await _repository.GetAsync(args.ConnectionId);
            entity.DumpStatus = succeeded ? DumpStatus.Completed : DumpStatus.Failed;
            entity.LastDumpTime = DateTime.UtcNow;
            entity.DumpFilePath = succeeded ? dumpFilePath : null;
            entity.DumpErrorMessage = succeeded ? null : errorMessage;
            await _repository.UpdateAsync(entity);
            await uow.CompleteAsync();
        }

        if (succeeded)
            Logger.Info($"[DatabaseDumpJob] Dump completed for connection {args.ConnectionId}. File: {dumpFilePath}");
        else
            Logger.Warn($"[DatabaseDumpJob] Dump failed for connection {args.ConnectionId}. Error: {errorMessage}");
    }

    private async Task<bool> RunPgDumpAsync(DatabaseConnection connection, string outputPath)
    {
        var database = string.IsNullOrWhiteSpace(connection.DatabaseName) ? "postgres" : connection.DatabaseName;
        var connString = $"postgresql://{connection.DbUser}:{Uri.EscapeDataString(connection.DbPassword)}@{connection.DbHost}:{connection.DbPort}/{database}";

        Logger.Debug($"[DatabaseDumpJob] Running pg_dump for host={connection.DbHost}, db={database}");

        var psi = new ProcessStartInfo
        {
            FileName = "pg_dump",
            Arguments = $"--no-password --format=plain --file={outputPath} {connString}",
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true
        };

        using var process = Process.Start(psi);
        if (process == null)
        {
            Logger.Error("[DatabaseDumpJob] Failed to start pg_dump process.");
            return false;
        }

        var stderr = await process.StandardError.ReadToEndAsync();
        await process.WaitForExitAsync();

        if (process.ExitCode != 0)
        {
            Logger.Warn($"[DatabaseDumpJob] pg_dump exited with code {process.ExitCode}. stderr: {stderr}");
            return false;
        }

        return true;
    }

    private static string GetDumpFilePath(Guid connectionId)
    {
        var baseDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "App_Data", "Dumps");
        return Path.Combine(baseDir, connectionId.ToString(), "dump.sql");
    }
}
