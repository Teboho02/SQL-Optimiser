using Abp.Modules;
using Abp.Reflection.Extensions;
using sql_optimizer.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace sql_optimizer.Web.Host.Startup
{
    [DependsOn(
       typeof(sql_optimizerWebCoreModule))]
    public class sql_optimizerWebHostModule : AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public sql_optimizerWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(sql_optimizerWebHostModule).GetAssembly());
        }
    }
}
