namespace sql_optimizer.Core.Domains.Database;

/// <summary>Represents the lifecycle state of a database dump operation.</summary>
public enum DumpStatus
{
    /// <summary>No dump has been requested yet.</summary>
    None,

    /// <summary>Dump has been queued but not yet started.</summary>
    Pending,

    /// <summary>Dump is currently in progress.</summary>
    InProgress,

    /// <summary>Dump completed successfully.</summary>
    Completed,

    /// <summary>Dump failed. See DumpErrorMessage for details.</summary>
    Failed
}
