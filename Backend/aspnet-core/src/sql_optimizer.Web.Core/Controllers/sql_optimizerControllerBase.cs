using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace sql_optimizer.Controllers
{
    public abstract class sql_optimizerControllerBase : AbpController
    {
        protected sql_optimizerControllerBase()
        {
            LocalizationSourceName = sql_optimizerConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
