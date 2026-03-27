using System.Collections.Generic;

namespace sql_optimizer.Services.QueryExecutionService.DTO;

public class AnalyseQueryOutput
{
    /// <summary>Lines from EXPLAIN ANALYZE on the original query.</summary>
    public List<string> ExecutionPlan { get; set; } = [];

    /// <summary>AI-suggested optimised version of the query.</summary>
    public string SuggestedQuery { get; set; }

    /// <summary>AI explanation of the issues found and the changes made.</summary>
    public string Explanation { get; set; }

    /// <summary>Error message if analysis failed, otherwise null.</summary>
    public string Error { get; set; }
}
