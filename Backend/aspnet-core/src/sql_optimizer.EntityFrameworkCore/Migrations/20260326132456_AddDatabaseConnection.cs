using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace sql_optimizer.Migrations
{
    /// <inheritdoc />
    public partial class AddDatabaseConnection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DatabaseConnections",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    DbHost = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    DbPort = table.Column<int>(type: "integer", nullable: false),
                    DbUser = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DbPassword = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    DatabaseType = table.Column<int>(type: "integer", nullable: false),
                    LastSyncTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatabaseConnections", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DatabaseConnections");
        }
    }
}
