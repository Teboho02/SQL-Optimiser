using Abp.EntityFrameworkCore.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Zero.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using sql_optimizer.EntityFrameworkCore.Seed;

namespace sql_optimizer.EntityFrameworkCore;

[DependsOn(
    typeof(sql_optimizerCoreModule),
    typeof(AbpZeroCoreEntityFrameworkCoreModule))]
public class sql_optimizerEntityFrameworkModule : AbpModule
{
    /* Used it tests to skip dbcontext registration, in order to use in-memory database of EF Core */
    public bool SkipDbContextRegistration { get; set; }

    public bool SkipDbSeed { get; set; }

    public override void PreInitialize()
    {
        if (!SkipDbContextRegistration)
        {
            Configuration.Modules.AbpEfCore().AddDbContext<sql_optimizerDbContext>(options =>
            {
                if (options.ExistingConnection != null)
                {
                    sql_optimizerDbContextConfigurer.Configure(options.DbContextOptions, options.ExistingConnection);
                }
                else
                {
                    sql_optimizerDbContextConfigurer.Configure(options.DbContextOptions, options.ConnectionString);
                }
            });
        }
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(sql_optimizerEntityFrameworkModule).GetAssembly());
    }

    public override void PostInitialize()
    {
        // Run EF Core migrations on a fresh, standalone context — before ABP's
        // seeding UoW begins, so there is no transaction scope conflict.
        if (!SkipDbSeed)
        {
            using (var context = IocManager.Resolve<sql_optimizerDbContext>())
            {
                context.Database.Migrate();
            }

            SeedHelper.SeedHostDb(IocManager);
        }
    }
}
