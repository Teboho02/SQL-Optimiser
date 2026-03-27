namespace sql_optimizer.Core.Domains.Database;

/// <summary>Represents the lifecycle state of a database restore operation.</summary>
public enum RestoreStatus
{
    /// <summary>No restore has been requested yet.</summary>
    None,

    /// <summary>Restore has been queued but not yet started.</summary>
    Pending,

    /// <summary>Restore is currently in progress.</summary>
    InProgress,

    /// <summary>Restore completed successfully.</summary>
    Completed,

    /// <summary>Restore failed. See RestoreErrorMessage for details.</summary>
    Failed
}
