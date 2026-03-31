using System.Collections.Generic;

namespace sql_optimizer.Services.SchemaAdvisorService.DTO;

public class ScanSchemaOutput
{
    public List<RecommendationDto> Recommendations { get; set; } = new();
    public string Error { get; set; }
}

public class RecommendationDto
{
    public string Id { get; set; }
    public string Title { get; set; }
    public string Impact { get; set; }
    public string Description { get; set; }
    public string EstimatedDowntime { get; set; }
    public SchemaTableDefDto CurrentTable { get; set; }
    public List<SchemaTableDefDto> NewTables { get; set; } = new();
    public List<MetricDto> Metrics { get; set; } = new();
}

public class SchemaTableDefDto
{
    public string Label { get; set; }
    public string Variant { get; set; }
    public List<SchemaColumnDto> Columns { get; set; } = new();
}

public class SchemaColumnDto
{
    public string Name { get; set; }
    public string Type { get; set; }
    public string Highlight { get; set; }
}

public class MetricDto
{
    public string Label { get; set; }
    public string Before { get; set; }
    public string After { get; set; }
}
