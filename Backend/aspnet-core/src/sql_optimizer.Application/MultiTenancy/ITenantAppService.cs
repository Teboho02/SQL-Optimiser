using Abp.Application.Services;
using sql_optimizer.MultiTenancy.Dto;

namespace sql_optimizer.MultiTenancy;

public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
{
}

