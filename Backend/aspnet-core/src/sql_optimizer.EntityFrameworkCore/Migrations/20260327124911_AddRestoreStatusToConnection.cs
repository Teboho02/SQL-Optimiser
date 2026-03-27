using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace sql_optimizer.Migrations
{
    /// <inheritdoc />
    public partial class AddRestoreStatusToConnection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastRestoreTime",
                table: "DatabaseConnections",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LocalConnectionString",
                table: "DatabaseConnections",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RestoreErrorMessage",
                table: "DatabaseConnections",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RestoreStatus",
                table: "DatabaseConnections",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastRestoreTime",
                table: "DatabaseConnections");

            migrationBuilder.DropColumn(
                name: "LocalConnectionString",
                table: "DatabaseConnections");

            migrationBuilder.DropColumn(
                name: "RestoreErrorMessage",
                table: "DatabaseConnections");

            migrationBuilder.DropColumn(
                name: "RestoreStatus",
                table: "DatabaseConnections");
        }
    }
}
