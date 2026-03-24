using sql_optimizer.Configuration;
using sql_optimizer.Web;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace sql_optimizer.EntityFrameworkCore;

/* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
public class sql_optimizerDbContextFactory : IDesignTimeDbContextFactory<sql_optimizerDbContext>
{
    public sql_optimizerDbContext CreateDbContext(string[] args)
    {
        var builder = new DbContextOptionsBuilder<sql_optimizerDbContext>();

        /*
         You can provide an environmentName parameter to the AppConfigurations.Get method. 
         In this case, AppConfigurations will try to read appsettings.{environmentName}.json.
         Use Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") method or from string[] args to get environment if necessary.
         https://docs.microsoft.com/en-us/ef/core/cli/dbcontext-creation?tabs=dotnet-core-cli#args
         */
        var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder());

        sql_optimizerDbContextConfigurer.Configure(builder, configuration.GetConnectionString(sql_optimizerConsts.ConnectionStringName));

        return new sql_optimizerDbContext(builder.Options);
    }
}
