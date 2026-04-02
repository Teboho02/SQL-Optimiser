using System;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using sql_optimizer.Core.Domains.Migration;

namespace sql_optimizer.Services.MigrationHistoryService.DTO;

[AutoMap(typeof(MigrationHistory))]
public class MigrationHistoryDto : EntityDto<Guid>
{
    public Guid ConnectionId { get; set; }
    public string ConnectionName { get; set; }
    public string RecommendationTitle { get; set; }
    public string MigrationSql { get; set; }
    public string RollbackSql { get; set; }
    public MigrationStatus Status { get; set; }
    public DateTime? RolledBackAt { get; set; }
    public DateTime CreationTime { get; set; }
}
