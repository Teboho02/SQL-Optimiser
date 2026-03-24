using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using sql_optimizer.Configuration;
using sql_optimizer.EntityFrameworkCore;
using sql_optimizer.Migrator.DependencyInjection;
using Castle.MicroKernel.Registration;
using Microsoft.Extensions.Configuration;

namespace sql_optimizer.Migrator;

[DependsOn(typeof(sql_optimizerEntityFrameworkModule))]
public class sql_optimizerMigratorModule : AbpModule
{
    private readonly IConfigurationRoot _appConfiguration;

    public sql_optimizerMigratorModule(sql_optimizerEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

        _appConfiguration = AppConfigurations.Get(
            typeof(sql_optimizerMigratorModule).GetAssembly().GetDirectoryPathOrNull()
        );
    }

    public override void PreInitialize()
    {
        Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
            sql_optimizerConsts.ConnectionStringName
        );

        Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        Configuration.ReplaceService(
            typeof(IEventBus),
            () => IocManager.IocContainer.Register(
                Component.For<IEventBus>().Instance(NullEventBus.Instance)
            )
        );
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(sql_optimizerMigratorModule).GetAssembly());
        ServiceCollectionRegistrar.Register(IocManager);
    }
}
