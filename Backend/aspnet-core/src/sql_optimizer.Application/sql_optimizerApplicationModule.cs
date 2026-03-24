using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using sql_optimizer.Authorization;

namespace sql_optimizer;

[DependsOn(
    typeof(sql_optimizerCoreModule),
    typeof(AbpAutoMapperModule))]
public class sql_optimizerApplicationModule : AbpModule
{
    public override void PreInitialize()
    {
        Configuration.Authorization.Providers.Add<sql_optimizerAuthorizationProvider>();
    }

    public override void Initialize()
    {
        var thisAssembly = typeof(sql_optimizerApplicationModule).GetAssembly();

        IocManager.RegisterAssemblyByConvention(thisAssembly);

        Configuration.Modules.AbpAutoMapper().Configurators.Add(
            // Scan the assembly for classes which inherit from AutoMapper.Profile
            cfg => cfg.AddMaps(thisAssembly)
        );
    }
}
