using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Data.Common;

namespace sql_optimizer.EntityFrameworkCore;

public static class sql_optimizerDbContextConfigurer
{
    public static void Configure(DbContextOptionsBuilder<sql_optimizerDbContext> builder, string connectionString)
    {
        builder.UseNpgsql(connectionString);
        builder.ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning));
    }

    public static void Configure(DbContextOptionsBuilder<sql_optimizerDbContext> builder, DbConnection connection)
    {
        builder.UseNpgsql(connection);
        builder.ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning));
    }
}
