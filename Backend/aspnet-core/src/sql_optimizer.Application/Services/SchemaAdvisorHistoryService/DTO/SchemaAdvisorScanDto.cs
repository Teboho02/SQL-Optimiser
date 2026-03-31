using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using sql_optimizer.Core.Domains.SchemaAdvisor;

namespace sql_optimizer.Services.SchemaAdvisorHistoryService.DTO;

[AutoMap(typeof(SchemaAdvisorScan))]
public class SchemaAdvisorScanDto : EntityDto<Guid>
{
    public Guid DatabaseConnectionId { get; set; }

    public int RecommendationCount { get; set; }

    /// <summary>
    /// Full JSON of the recommendations array so the client can restore the session.
    /// </summary>
    public string RecommendationsJson { get; set; }

    public string ErrorMessage { get; set; }

    public DateTime CreationTime { get; set; }
}
