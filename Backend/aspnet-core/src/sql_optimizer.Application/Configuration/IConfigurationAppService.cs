using sql_optimizer.Configuration.Dto;
using System.Threading.Tasks;

namespace sql_optimizer.Configuration;

public interface IConfigurationAppService
{
    Task ChangeUiTheme(ChangeUiThemeInput input);
}
