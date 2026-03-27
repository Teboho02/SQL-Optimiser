namespace sql_optimizer.Services.DatabaseConnectionService.DTO;

/// <summary>
/// Result of a database connection test.
/// </summary>
public class TestConnectionOutput
{
    /// <summary>Whether the connection was established successfully.</summary>
    public bool Success { get; set; }

    /// <summary>Human-readable message describing the outcome or error.</summary>
    public string Message { get; set; }
}
