using System;
using System.Collections.Generic;

namespace sql_optimizer.Services.SchemaAdvisorService.DTO;

public class BenchmarkRecommendationInput
{
    public Guid ConnectionId { get; set; }

    /// <summary>DDL returned by GetBenchmarkPlan (applied inside a transaction then rolled back).</summary>
    public string BenchmarkDdl { get; set; }

    /// <summary>User-confirmed or user-edited query pairs (may include custom additions).</summary>
    public List<BenchmarkQueryPair> QueryPairs { get; set; } = new();

    /// <summary>
    /// Fraction of traffic that is reads (0.0–1.0). Write ratio = 1 − ReadRatio.
    /// Used to compute the weighted overall improvement score.
    /// </summary>
    public double ReadRatio { get; set; } = 0.8;

    /// <summary>Number of executions per query per schema variant. Clamped to 1–5.</summary>
    public int Runs { get; set; } = 5;
}
