using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using sql_optimizer.Core.Domains.QueryHistory;

namespace sql_optimizer.Services.QueryHistoryService.DTO;

[AutoMap(typeof(QueryHistory))]
public class QueryHistoryDto : EntityDto<Guid>
{
    public Guid DatabaseConnectionId { get; set; }
    public string QueryText { get; set; }
    public string SuggestedQuery { get; set; }
    public string ResultSummary { get; set; }
    public string ErrorMessage { get; set; }
    public TimeSpan ExecutionTime { get; set; }
    public DateTime CreationTime { get; set; }
}
