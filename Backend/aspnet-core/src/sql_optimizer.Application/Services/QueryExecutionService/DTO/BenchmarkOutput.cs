namespace sql_optimizer.Services.QueryExecutionService.DTO;

public class BenchmarkOutput
{
    /// <summary>Average execution time of the original query across all runs (ms).</summary>
    public long OriginalAvgMs { get; set; }

    /// <summary>Average execution time of the suggested query across all runs (ms).</summary>
    public long SuggestedAvgMs { get; set; }

    /// <summary>
    /// Positive = suggested is faster (e.g. 73.5 means 73.5 % faster).
    /// Negative = suggested is slower.
    /// </summary>
    public double ImprovementPercent { get; set; }

    /// <summary>Error message if the benchmark failed, otherwise null.</summary>
    public string Error { get; set; }
}
