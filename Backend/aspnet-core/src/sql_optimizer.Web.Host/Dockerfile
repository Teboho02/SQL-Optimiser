FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src
COPY ["NuGet.Config", "NuGet.Config"]
COPY ["src/sql_optimizer.Web.Host/sql_optimizer.Web.Host.csproj", "src/sql_optimizer.Web.Host/"]
COPY ["src/sql_optimizer.Web.Core/sql_optimizer.Web.Core.csproj", "src/sql_optimizer.Web.Core/"]
COPY ["src/sql_optimizer.Application/sql_optimizer.Application.csproj", "src/sql_optimizer.Application/"]
COPY ["src/sql_optimizer.Core/sql_optimizer.Core.csproj", "src/sql_optimizer.Core/"]
COPY ["src/sql_optimizer.EntityFrameworkCore/sql_optimizer.EntityFrameworkCore.csproj", "src/sql_optimizer.EntityFrameworkCore/"]
WORKDIR "/src/src/sql_optimizer.Web.Host"
RUN dotnet restore

WORKDIR /src
COPY ["src/sql_optimizer.Web.Host", "src/sql_optimizer.Web.Host"]
COPY ["src/sql_optimizer.Web.Core", "src/sql_optimizer.Web.Core"]
COPY ["src/sql_optimizer.Application", "src/sql_optimizer.Application"]
COPY ["src/sql_optimizer.Core", "src/sql_optimizer.Core"]
COPY ["src/sql_optimizer.EntityFrameworkCore", "src/sql_optimizer.EntityFrameworkCore"]
WORKDIR "/src/src/sql_optimizer.Web.Host"
RUN dotnet publish -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0
EXPOSE 80
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "sql_optimizer.Web.Host.dll"]
