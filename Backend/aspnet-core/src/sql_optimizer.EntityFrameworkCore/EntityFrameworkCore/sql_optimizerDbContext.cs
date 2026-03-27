using Abp.Zero.EntityFrameworkCore;
using sql_optimizer.Authorization.Roles;
using sql_optimizer.Authorization.Users;
using sql_optimizer.Core.Domains.Database;
using sql_optimizer.MultiTenancy;
using Microsoft.EntityFrameworkCore;

namespace sql_optimizer.EntityFrameworkCore;

public class sql_optimizerDbContext : AbpZeroDbContext<Tenant, Role, User, sql_optimizerDbContext>
{
    /* Define a DbSet for each entity of the application */

    public DbSet<DatabaseConnection> DatabaseConnections { get; set; }

    public sql_optimizerDbContext(DbContextOptions<sql_optimizerDbContext> options)
        : base(options)
    {
    }
}
