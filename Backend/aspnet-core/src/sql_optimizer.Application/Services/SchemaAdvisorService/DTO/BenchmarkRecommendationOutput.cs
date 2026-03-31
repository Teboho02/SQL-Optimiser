using System.Collections.Generic;

namespace sql_optimizer.Services.SchemaAdvisorService.DTO;

public class BenchmarkRecommendationOutput
{
    public List<QueryPairResult> Results { get; set; } = new();
    public string Error { get; set; }
}

public class QueryPairResult
{
    /// <summary>What this query pair tests (e.g. "Fetch user orders with details").</summary>
    public string Description { get; set; }

    /// <summary>Query that runs against the current (unmodified) schema.</summary>
    public string OriginalQuery { get; set; }

    /// <summary>Equivalent query adapted for the proposed new schema.</summary>
    public string AdaptedQuery { get; set; }

    /// <summary>Average execution time (ms) of the original query across all runs.</summary>
    public double OriginalAvgMs { get; set; }

    /// <summary>Average execution time (ms) of the adapted query across all runs.</summary>
    public double AdaptedAvgMs { get; set; }

    /// <summary>Performance improvement as a percentage (positive = faster).</summary>
    public double ImprovementPercent { get; set; }

    /// <summary>Set when either query fails to execute.</summary>
    public string Error { get; set; }
}
