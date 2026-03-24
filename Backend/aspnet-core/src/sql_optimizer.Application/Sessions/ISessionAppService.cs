using Abp.Application.Services;
using sql_optimizer.Sessions.Dto;
using System.Threading.Tasks;

namespace sql_optimizer.Sessions;

public interface ISessionAppService : IApplicationService
{
    Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
}
