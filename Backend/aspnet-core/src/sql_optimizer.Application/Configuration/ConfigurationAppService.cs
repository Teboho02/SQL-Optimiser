using Abp.Authorization;
using Abp.Runtime.Session;
using sql_optimizer.Configuration.Dto;
using System.Threading.Tasks;

namespace sql_optimizer.Configuration;

[AbpAuthorize]
public class ConfigurationAppService : sql_optimizerAppServiceBase, IConfigurationAppService
{
    public async Task ChangeUiTheme(ChangeUiThemeInput input)
    {
        await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
    }
}
