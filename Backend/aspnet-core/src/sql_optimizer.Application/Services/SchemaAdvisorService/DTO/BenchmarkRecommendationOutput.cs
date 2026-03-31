using System.Collections.Generic;

namespace sql_optimizer.Services.SchemaAdvisorService.DTO;

public class BenchmarkRecommendationOutput
{
    public List<QueryPairResult> Results { get; set; } = new();

    /// <summary>
    /// Overall improvement weighted by ReadRatio.
    /// Positive = net gain, negative = net regression.
    /// Null when write results are absent (all read-only benchmark).
    /// </summary>
    public double? WeightedImprovementPercent { get; set; }

    public string Error { get; set; }
}

public class QueryPairResult
{
    public string Description { get; set; }
    public string OriginalQuery { get; set; }
    public string AdaptedQuery { get; set; }

    /// <summary>"read" or "write"</summary>
    public string QueryType { get; set; }

    public double OriginalAvgMs { get; set; }
    public double AdaptedAvgMs { get; set; }

    /// <summary>Positive = adapted is faster. Negative = adapted is slower.</summary>
    public double ImprovementPercent { get; set; }

    public string Error { get; set; }
}
