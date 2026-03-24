using Abp.Application.Services;
using sql_optimizer.Authorization.Accounts.Dto;
using System.Threading.Tasks;

namespace sql_optimizer.Authorization.Accounts;

public interface IAccountAppService : IApplicationService
{
    Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

    Task<RegisterOutput> Register(RegisterInput input);
}
