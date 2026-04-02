namespace sql_optimizer.Core.Domains.Migration;

/// <summary>Lifecycle state of an applied schema migration.</summary>
public enum MigrationStatus
{
    /// <summary>Migration was applied successfully to the live database.</summary>
    Applied = 0,

    /// <summary>Migration was rolled back.</summary>
    RolledBack = 1,
}
