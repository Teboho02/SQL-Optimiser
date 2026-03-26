# Backend Standards

## Architecture Overview

The backend is a **Domain-Driven Design (DDD)** application built on the **ASP.NET Boilerplate (ABP)** framework targeting **.NET 9**, using **PostgreSQL** as the database. It follows a layered, modular monolith architecture.

### Solution Structure

```
aspnet-core/
├── src/
│   ├── SqlOptimiser.Core/                  # Domain Layer
│   ├── SqlOptimiser.Application/           # Application Service Layer
│   ├── SqlOptimiser.EntityFrameworkCore/   # Data Access / Infrastructure Layer
│   ├── SqlOptimiser.Web.Core/              # Web Infrastructure Layer
│   └── SqlOptimiser.Web.Host/              # Presentation / API Host Layer
├── test/
│   ├── SqlOptimiser.Tests/                 # Unit & Integration Tests
│   └── SqlOptimiser.Web.Tests/             # Web / API Tests
└── SqlOptimiser.sln
```

### Layer Dependency Direction

```
Web.Host
  └── Web.Core
        └── Application
              ├── Core  (Domain)
              └── EntityFrameworkCore
                    └── Core  (Domain)
```

No layer may reference a layer above it.

---

## Layer Rules

### Core (Domain Layer)

- All entities **must** extend `FullAuditedEntity<Guid>` — this provides `CreationTime`, `CreatorUserId`, `LastModificationTime`, `LastModifierUserId`, `IsDeleted`, and `DeletionTime` automatically.
- Use **data annotations** for property-level validation (`[Required]`, `[MaxLength]`, `[Phone]`, etc.).
- Domain services encapsulate logic that does not belong to a single entity.
- **No** EF Core, HTTP, or application-layer references are allowed in this layer.
- Place entities in `Domains/{Module Name}/{EntityName}.cs`.

**Entity example:**
```csharp
public class QueryRecord : FullAuditedEntity<Guid>
{
    [Required]
    [MaxLength(2000)]
    public string SqlText { get; set; }

    public long UserId { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; }
}
```

### Application Layer

- Every service class **must** have a corresponding interface.
- Services extend `AsyncCrudAppService<TEntity, TDto, TPrimaryKey>` for standard CRUD, or `ApplicationService` for custom logic.
- Apply `[AbpAuthorize]` on the class or individual methods to enforce authentication/authorisation.
- DTOs must be decorated with `[AutoMap(typeof(TEntity))]` so AutoMapper maps without manual configuration.
- DTOs must **not** expose EF navigation properties directly — flatten or nest explicitly.
- Place services in `Services/{Entity}Service/` with a `DTO/` subfolder.

**Naming conventions:**

| Artifact | Convention | Example |
|---|---|---|
| Service interface | `I{Entity}AppService` | `IQueryRecordAppService` |
| Service class | `{Entity}AppService` | `QueryRecordAppService` |
| DTO folder | `DTO/` inside the service folder | `QueryRecordService/DTO/` |
| DTO class | `{Entity}Dto` | `QueryRecordDto` |

**Service example:**
```csharp
[AbpAuthorize]
public class QueryRecordAppService
    : AsyncCrudAppService<QueryRecord, QueryRecordDto, Guid>,
      IQueryRecordAppService
{
    public QueryRecordAppService(IRepository<QueryRecord, Guid> repository)
        : base(repository) { }
}
```

**DTO example:**
```csharp
[AutoMap(typeof(QueryRecord))]
public class QueryRecordDto : EntityDto<Guid>
{
    public string SqlText { get; set; }
    public long UserId { get; set; }
}
```

### EntityFrameworkCore (Data Access Layer)

- Every domain entity **must** have a corresponding `DbSet<T>` in the `DbContext`.
- Override `OnModelCreating` only for configuration that cannot be expressed with data annotations (e.g., UTC datetime conversion, composite keys).
- Use `IRepository<TEntity, TPrimaryKey>` injected via constructor — do not use `DbContext` directly in the Application layer.
- Generate migrations with `dotnet ef migrations add <MigrationName>` from within this project.
- Seed data (default roles, settings, languages) lives in `Seed/Host/` and runs once on startup.

### Web.Core (Web Infrastructure Layer)

- All controllers must inherit from the project's `ControllerBase` (not `Controller` directly).
- JWT configuration (key, issuer, audience) is read from `appsettings.json` and injected via `TokenAuthConfiguration`.
- External providers implement `IExternalAuthProviderApi` for a consistent plug-in pattern.
- **No business logic** here — only plumbing.

### Web.Host (Host Layer)

- **No business logic** belongs here.
- Environment-specific config overrides go in `appsettings.{Environment}.json` — never commit real secrets.
- CORS origins are loaded dynamically from `App:CorsOrigins` — update that setting rather than hardcoding origins.

---

## Adding a New Feature — Required Steps

Follow these steps every time a new business entity or feature is introduced:

1. **Define the domain entity** in `Core/Domains/{Module Name}/{EntityName}.cs` extending `FullAuditedEntity<Guid>`.
2. **Register in DbContext** — add a `DbSet<T>` to the main `DbContext`.
3. **Create a migration** — `dotnet ef migrations add Add{EntityName} --project src/SqlOptimiser.EntityFrameworkCore`.
4. **Create the DTO** in `Application/Services/{Entity}Service/DTO/{Entity}Dto.cs` with `[AutoMap(typeof(TEntity))]`.
5. **Create the service interface** `I{Entity}AppService` in `Application/Services/{Entity}Service/`.
6. **Implement the service** `{Entity}AppService` extending `AsyncCrudAppService` or `ApplicationService`.

ABP automatically exposes the service as a REST API — no controller is needed for standard CRUD.

---

## Cross-Cutting Concerns

| Concern | How It Is Handled |
|---|---|
| **Authentication** | JWT Bearer tokens via `TokenAuthController` |
| **Authorisation** | `[AbpAuthorize]` attribute; role-based permissions |
| **Audit Logging** | `FullAuditedEntity<Guid>` on every entity |
| **Soft Delete** | Built into `FullAuditedEntity` via `IsDeleted` flag |
| **Validation** | Data annotations on entities; ABP validates DTOs automatically |
| **Logging** | Log4Net configured in `log4net.config` |
| **Exception Handling** | ABP global exception handler; returns consistent error envelopes |
| **Dependency Injection** | Castle Windsor (ABP default); registered per ABP module |
| **Object Mapping** | AutoMapper; configured automatically via `[AutoMap]` attribute |

---

## General Code Quality Rules

### Comments
- Add a short purpose comment to any class that is not immediately obvious.
- Add a short purpose comment to all public methods.
- Add comments before non-obvious logic or assumptions.
- Do not comment trivial code.

### Class and Method Size
- Keep classes focused on a single responsibility.
- Classes longer than **350 lines** are probably too large — split them.
- Keep methods short enough to understand without scrolling.
- Extract clearly named helper methods when logic grows.

### Readability
- Use guard clauses for preconditions.
- Avoid excessive nesting; refactor when nesting gets too deep.
- Use clear, consistent names for variables, methods, and classes.
- Replace magic numbers with constants or enums.
- Apply **DRY**: extract repeated logic into reusable methods.
- Apply **KISS**: simple code is preferred over clever code.

### Performance
- Avoid loops that trigger repeated database calls when one query can do the job.
- Avoid row-by-row updates when a bulk update is possible.
- Add indexing for frequently queried columns.

---

## Final Checklist

Before committing, confirm that:
- the new entity extends `FullAuditedEntity<Guid>`
- a `DbSet<T>` has been added and a migration created
- the DTO has `[AutoMap(typeof(TEntity))]`
- the service has a corresponding interface
- `[AbpAuthorize]` is applied where needed
- no business logic lives in `Web.Core` or `Web.Host`
- no EF Core or HTTP references exist in `Core`
- DTOs do not expose navigation properties directly
- code is clear, comments exist where needed
- no magic numbers, no dead code, formatting is clean
