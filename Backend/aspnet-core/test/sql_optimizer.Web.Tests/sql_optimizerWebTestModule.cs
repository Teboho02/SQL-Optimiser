using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using sql_optimizer.EntityFrameworkCore;
using sql_optimizer.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace sql_optimizer.Web.Tests;

[DependsOn(
    typeof(sql_optimizerWebMvcModule),
    typeof(AbpAspNetCoreTestBaseModule)
)]
public class sql_optimizerWebTestModule : AbpModule
{
    public sql_optimizerWebTestModule(sql_optimizerEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
    }

    public override void PreInitialize()
    {
        Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(sql_optimizerWebTestModule).GetAssembly());
    }

    public override void PostInitialize()
    {
        IocManager.Resolve<ApplicationPartManager>()
            .AddApplicationPartsIfNotAddedBefore(typeof(sql_optimizerWebMvcModule).Assembly);
    }
}