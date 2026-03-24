using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace sql_optimizer.EntityFrameworkCore;

public static class sql_optimizerDbContextConfigurer
{
    public static void Configure(DbContextOptionsBuilder<sql_optimizerDbContext> builder, string connectionString)
    {
        builder.UseSqlServer(connectionString);
    }

    public static void Configure(DbContextOptionsBuilder<sql_optimizerDbContext> builder, DbConnection connection)
    {
        builder.UseSqlServer(connection);
    }
}
