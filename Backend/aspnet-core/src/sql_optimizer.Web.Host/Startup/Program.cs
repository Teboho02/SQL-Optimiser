using System;
using System.IO;
using Abp.AspNetCore.Dependency;
using Abp.Dependency;
using DotNetEnv;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace sql_optimizer.Web.Host.Startup
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        internal static IHostBuilder CreateHostBuilder(string[] args) =>
            Microsoft.Extensions.Hosting.Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((context, config) =>
                {
                    var envFile = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", ".env");
                    if (File.Exists(envFile))
                        DotNetEnv.Env.Load(envFile);

                    var host = Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost";
                    var db = Environment.GetEnvironmentVariable("DB_NAME") ?? "sql_optimizerDb";
                    var user = Environment.GetEnvironmentVariable("DB_USER");
                    var password = Environment.GetEnvironmentVariable("DB_PASSWORD");

                    var connectionString = $"Server={host};Database={db};User={user};Password={password};";

                    config.AddInMemoryCollection(new[]
                    {
                        new System.Collections.Generic.KeyValuePair<string, string>(
                            "ConnectionStrings:Default", connectionString)
                    });
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                })
                .UseCastleWindsor(IocManager.Instance.IocContainer);
    }
}
