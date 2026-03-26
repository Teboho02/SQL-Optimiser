---
name: add-backend-feature
description: Scaffold a complete ABP/DDD backend feature — entity, DbContext registration, migration command, DTO, service interface, and service implementation — following the project's layered architecture.
---

## When to use this skill

Use this skill whenever the user wants to add a **new backend entity and its CRUD service** following the project's ABP + DDD pattern. This covers the full vertical slice from the domain layer through to the exposed REST API.

---

## Step-by-step process

Work through these six steps in order. Do not skip any step.

---

### Step 1 — Domain Entity (`SqlOptimiser.Core`)

**File:** `aspnet-core/src/SqlOptimiser.Core/Domains/{Module Name}/{EntityName}.cs`

Rules:
- Extend `FullAuditedEntity<Guid>` — provides audit fields and soft delete automatically.
- Use data annotations for validation (`[Required]`, `[MaxLength]`, `[Phone]`, etc.).
- No EF Core, HTTP, or Application layer references.

```csharp
// Domains/{Module Name}/{EntityName}.cs
public class {EntityName} : FullAuditedEntity<Guid>
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; }

    // Add domain-specific properties here
}
```

---

### Step 2 — Register in DbContext (`SqlOptimiser.EntityFrameworkCore`)

**File:** `aspnet-core/src/SqlOptimiser.EntityFrameworkCore/EntityFrameworkCore/SqlOptimiserDbContext.cs`

Add one line inside the class:

```csharp
public DbSet<{EntityName}> {EntityNamePlural} { get; set; }
```

Only add `OnModelCreating` configuration if data annotations are insufficient (e.g., UTC conversion, composite keys, custom table names).

---

### Step 3 — Create Migration

Do **not** generate the migration file yourself. Instead, output this command for the user to run:

```bash
cd aspnet-core
dotnet ef migrations add Add{EntityName} --project src/SqlOptimiser.EntityFrameworkCore
```

---

### Step 4 — DTO (`SqlOptimiser.Application`)

**File:** `aspnet-core/src/SqlOptimiser.Application/Services/{EntityName}Service/DTO/{EntityName}Dto.cs`

Rules:
- Decorate with `[AutoMap(typeof({EntityName}))]`.
- Extend `EntityDto<Guid>`.
- Do **not** expose EF navigation properties directly — flatten or nest explicitly.

```csharp
// Services/{EntityName}Service/DTO/{EntityName}Dto.cs
[AutoMap(typeof({EntityName}))]
public class {EntityName}Dto : EntityDto<Guid>
{
    public string Name { get; set; }

    // Mirror all properties that consumers need
}
```

---

### Step 5 — Service Interface (`SqlOptimiser.Application`)

**File:** `aspnet-core/src/SqlOptimiser.Application/Services/{EntityName}Service/I{EntityName}AppService.cs`

```csharp
// Services/{EntityName}Service/I{EntityName}AppService.cs
public interface I{EntityName}AppService
    : IAsyncCrudAppService<{EntityName}Dto, Guid>
{
    // Add custom method signatures here if needed beyond standard CRUD
}
```

---

### Step 6 — Service Implementation (`SqlOptimiser.Application`)

**File:** `aspnet-core/src/SqlOptimiser.Application/Services/{EntityName}Service/{EntityName}AppService.cs`

Rules:
- Extend `AsyncCrudAppService` for standard CRUD, or `ApplicationService` for custom logic.
- Always apply `[AbpAuthorize]` — omit only if the endpoint is intentionally public.
- ABP auto-exposes this as a REST API; no controller is needed.

```csharp
// Services/{EntityName}Service/{EntityName}AppService.cs
[AbpAuthorize]
public class {EntityName}AppService
    : AsyncCrudAppService<{EntityName}, {EntityName}Dto, Guid>,
      I{EntityName}AppService
{
    public {EntityName}AppService(IRepository<{EntityName}, Guid> repository)
        : base(repository) { }

    // Override CreateAsync, UpdateAsync, GetAllAsync etc. only when custom logic is needed
}
```

---

## Checklist before finishing

- [ ] Entity extends `FullAuditedEntity<Guid>`
- [ ] `DbSet<T>` added to `DbContext`
- [ ] Migration command provided to the user
- [ ] DTO has `[AutoMap(typeof(TEntity))]` and extends `EntityDto<Guid>`
- [ ] Service interface defined with `I{Entity}AppService` naming
- [ ] Service implementation has `[AbpAuthorize]`
- [ ] No business logic in `Web.Core` or `Web.Host`
- [ ] No EF Core or HTTP references in `Core`
- [ ] DTO does not expose navigation properties directly
