using System.Threading.Tasks;
using Abp.Application.Services;
using sql_optimizer.Services.DashboardService.DTO;

namespace sql_optimizer.Services.DashboardService;

public interface IDashboardAppService : IApplicationService
{
    Task<DashboardStatsDto> GetDashboardStatsAsync();
}
