using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using sql_optimizer.MultiTenancy;

namespace sql_optimizer.Sessions.Dto;

[AutoMapFrom(typeof(Tenant))]
public class TenantLoginInfoDto : EntityDto
{
    public string TenancyName { get; set; }

    public string Name { get; set; }
}
