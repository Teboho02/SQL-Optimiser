using System;
using System.Data.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace sql_optimizer.EntityFrameworkCore;

public static class sql_optimizerDbContextConfigurer
{
    public static void Configure(DbContextOptionsBuilder<sql_optimizerDbContext> builder, string connectionString)
    {
        builder.UseNpgsql(connectionString, npgsqlOptions =>
        {
            // Retry up to 3 times on transient failures (e.g. stale pooled connections timing out)
            npgsqlOptions.EnableRetryOnFailure(3, TimeSpan.FromSeconds(5), null);
        });
        builder.ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning));
    }

    public static void Configure(DbContextOptionsBuilder<sql_optimizerDbContext> builder, DbConnection connection)
    {
        builder.UseNpgsql(connection);
        builder.ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning));
    }
}
