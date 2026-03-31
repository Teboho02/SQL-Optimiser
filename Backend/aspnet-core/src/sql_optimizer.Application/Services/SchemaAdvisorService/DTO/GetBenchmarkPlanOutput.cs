using System.Collections.Generic;

namespace sql_optimizer.Services.SchemaAdvisorService.DTO;

public class GetBenchmarkPlanOutput
{
    /// <summary>DDL to apply inside a transaction during benchmarking.</summary>
    public string BenchmarkDdl { get; set; }

    /// <summary>AI-suggested query pairs for the user to review and edit.</summary>
    public List<BenchmarkQueryPair> QueryPairs { get; set; } = new();

    /// <summary>Whether the recommendation involves index changes (drives read/write ratio prompt).</summary>
    public bool InvolvesIndexes { get; set; }

    public string Error { get; set; }
}
