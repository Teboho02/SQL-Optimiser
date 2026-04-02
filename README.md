# SQL Optimiser

---

## What is SQL Optimiser?

SQL Optimiser is a full-stack database management and query optimisation platform. It allows developers and database administrators to connect to PostgreSQL databases, execute and analyse queries, receive AI-powered schema recommendations, and manage migrations — all from a single dashboard.

The platform leverages OpenAI to provide intelligent schema advice, covering indexing strategy, data type optimisation, normalisation, join improvements, and more.

---

## Problem Statement

Database administrators and developers often struggle with:
- Identifying **slow or inefficient queries**
- Understanding **schema weaknesses** without deep DBA expertise
- Managing **database connections** across environments
- Tracking **migration history** and rolling back safely
- Getting **actionable, context-aware recommendations** quickly

Most tools provide raw query execution but **lack intelligent optimisation guidance**.

### Our Solution

SQL Optimiser solves this by:
- Providing a **query editor** with execution plan analysis
- Running an **AI-powered schema advisor** that scans for improvement opportunities
- Enabling **migration generation and application** directly from recommendations
- Offering a **migration history** view with rollback support
- Displaying a **dashboard** with connection stats and performance insights

---

## Why Choose SQL Optimiser?

- **AI-Driven Advice**: Schema recommendations powered by OpenAI across 8 optimisation categories
- **End-to-End Workflow**: From query execution to schema change to migration — all in one place
- **Safe Migrations**: Generate, preview, apply, and roll back migrations with full history tracking
- **Multi-Connection Support**: Manage multiple database connections with schema-only or full dump modes
- **Developer-Friendly**: Clean dashboard UI built on Next.js and Ant Design

---

# Architecture Overview

## High-Level Architecture

SQL Optimiser follows a **full-stack modular architecture**:

### Backend (ASP.NET Core + ABP Framework)
- Domain-driven structure with ABP layered architecture
- Application services for all business logic
- PostgreSQL database (Neon or local via Docker)
- OpenAI integration for schema analysis
- Background jobs for database dump and restore operations

### Frontend (Next.js / React)
- Component-based UI with Ant Design
- Dashboard-driven experience
- API-driven data fetching via typed service layer
- JWT-based authentication with cookie storage

---

## Core Components

### 1. Dashboard
The main entry point after login. Displays:
- Total connections, queries executed, and schemas scanned
- Average query improvement percentage (hidden when not available)
- Quick access to all platform features

### 2. Database Connections
Manage PostgreSQL database connections:
- Add, test, and save connections
- Toggle between full and schema-only copy modes
- Trigger manual dump and restore operations
- View all saved connections with status badges

### 3. Query Analysis
Execute and analyse SQL queries:
- Full-featured SQL editor
- Query execution with results display
- Execution plan analysis and benchmarking
- Query history per connection

### 4. Schema Advisor
AI-powered schema optimisation:
- Scans the full database schema
- Produces 3–6 recommendations across 8 categories:
  - Normalisation / Denormalisation
  - Data type optimisation
  - Index strategy
  - Query result optimisation
  - Functions on indexed columns
  - Join optimisation / materialised views
  - Stored procedures
  - Other (multi-value columns, NULL-heavy, missing constraints)
- Generate and apply migrations directly from recommendations

### 5. Migration History
Track and manage applied schema changes:
- View all applied migrations with SQL preview
- Roll back migrations when needed
- Full audit trail per connection

---

# Setup Instructions

## Prerequisites

- Node.js (v18+)
- npm
- .NET SDK (9.0)
- PostgreSQL (local or Neon)
- Docker & Docker Compose (optional)
- Visual Studio or VS Code
- OpenAI API key

---

## Backend Setup

1. Open `Backend/aspnet-core` in Visual Studio
2. Set `sql_optimizer.Web.Host` as the startup project
3. Configure connection string and secrets in:

```json
appsettings.json
```

   Required keys: `ConnectionStrings:Default`, `OPENAI_KEY`

4. Run migrations:

```bash
dotnet ef database update --project sql_optimizer.EntityFrameworkCore --startup-project sql_optimizer.Web.Host
```

5. Start the backend:

```
Run via IIS Express or dotnet run
```

---

## Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:44311
```

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

---

## Docker (Full Stack)

Copy and configure the environment file:

```bash
cp .env.example .env
```

Required variables:

```
LOCAL_POSTGRES_USER=<db_user>
LOCAL_POSTGRES_PASSWORD=<db_password>
DB_CONNECTION_STRING=<postgres_connection_string>
JWT_SECURITY_KEY=<jwt_secret>
OPENAI_KEY=<openai_api_key>
```

Start all services:

```bash
docker compose -f docker-compose.local.yml up -d
```

---

# Assumptions

- The platform targets PostgreSQL databases exclusively.
- A user must be authenticated to access any dashboard feature; all routes are protected.
- Database connections are stored per user and scoped to their account.
- Schema advisor results are generated on demand and stored in scan history for later review.
- Migrations generated by the schema advisor are applied directly to the connected database.
- The OpenAI API is available and a valid key is configured; schema advisor functionality depends on it.
- Docker Compose is the recommended local development setup for running the full stack together.
- The frontend proxies all API requests through Next.js in production; `NEXT_PUBLIC_API_URL` is only needed for local development.

---

# Trade-offs

## 1. Monorepo Full-Stack Structure
- Chose a combined backend/frontend repository.
- Pros:
  - Shared visibility across API, UI, and tests
  - Easier cross-layer feature delivery
- Cons:
  - Larger pull requests and higher coordination overhead

---

## 2. ABP Framework for Backend
- Chose ABP over a plain ASP.NET Core setup.
- Pros:
  - Built-in auth, auditing, multi-tenancy scaffolding, and DDD conventions
  - Reduced boilerplate for CRUD services
- Cons:
  - Opinionated structure; `NpgsqlRetryingExecutionStrategy` incompatible with ABP unit-of-work transactions

---

## 3. AI-Powered Schema Advisor via OpenAI
- Chose LLM-based recommendations over static rule checks.
- Pros:
  - Context-aware, natural language explanations
  - Covers a broad range of optimisation categories
- Cons:
  - Dependent on OpenAI availability and API costs
  - Output is non-deterministic; requires user validation before applying

---

## 4. Schema-Only vs Full Dump Connection Modes
- Chose to support both schema-only and full dump copy modes per connection.
- Pros:
  - Flexibility for production (schema-only) vs development (full data) use cases
- Cons:
  - Increased complexity in dump/restore job logic and UI toggle handling

---

# AI Usage Disclosure

AI tools were used during the development of SQL Optimiser to support productivity, design decisions, and implementation.

## How AI was used

- Assisting with **code generation, scaffolding and structure**
- Generating and refining **documentation (README, specs, explanations)**
- Supporting **UI/UX structuring and component breakdowns**
- Debugging and improving implementation efficiency
- Powering the **Schema Advisor** feature via the OpenAI API at runtime

## Developer Responsibility

All AI-generated outputs were:
- reviewed
- validated
- modified where necessary
- integrated into the system with full understanding

## Purpose of AI Usage

AI was used as a **development assistant** to:
- speed up development
- improve code quality
- enhance clarity of explanations

---

# Design

## [Wireframes](https://www.figma.com/design/J0RQDF96WhqvRMvOKPmGAk/Untitled?node-id=0-1&p=f&t=GGY92gIAOiDAybvU-0)

## [Domain Model](https://drive.google.com/file/d/10Y_oLIGnPNMjF1zuYLsAgjpafgSxer0R/view?usp=sharing)
