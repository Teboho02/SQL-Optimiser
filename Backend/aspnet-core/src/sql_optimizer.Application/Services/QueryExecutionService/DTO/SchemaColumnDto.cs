namespace sql_optimizer.Services.QueryExecutionService.DTO;

public class SchemaColumnDto
{
    public string Name { get; set; }
    public string DataType { get; set; }
    public bool IsNullable { get; set; }
    public bool IsPrimaryKey { get; set; }
    public int? MaxLength { get; set; }
    /// <summary>Table this column references via FK, or null.</summary>
    public string ReferencesTable { get; set; }
    /// <summary>Column this column references via FK, or null.</summary>
    public string ReferencesColumn { get; set; }
}
