using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace sql_optimizer.Migrations
{
    /// <inheritdoc />
    public partial class AddDumpStatusToConnection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DatabaseName",
                table: "DatabaseConnections",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DumpErrorMessage",
                table: "DatabaseConnections",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DumpFilePath",
                table: "DatabaseConnections",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DumpStatus",
                table: "DatabaseConnections",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastDumpTime",
                table: "DatabaseConnections",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DatabaseName",
                table: "DatabaseConnections");

            migrationBuilder.DropColumn(
                name: "DumpErrorMessage",
                table: "DatabaseConnections");

            migrationBuilder.DropColumn(
                name: "DumpFilePath",
                table: "DatabaseConnections");

            migrationBuilder.DropColumn(
                name: "DumpStatus",
                table: "DatabaseConnections");

            migrationBuilder.DropColumn(
                name: "LastDumpTime",
                table: "DatabaseConnections");
        }
    }
}
