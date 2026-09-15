---
description: Summary of the modules layer (application, presentation, factory) — feature modules with layered architecture
inclusion: auto
---

# Modules Layer Rules

## Overview

`src/modules/` contains all application features. Every API endpoint lives inside a module. Two types: system (flat, no business logic) and feature (layered).

## Feature Module Structure

```
src/modules/<name>/
├── <name>.factory.ts          # Composition root — wires deps, returns controller
├── application/
│   ├── dtos/
│   │   └── <action>.dto.ts   # Request + Response DTO classes (one file per API)
│   └── <action>.use-case.ts  # Business logic (one file per API, single execute())
└── presentation/
    ├── <name>.routes.ts       # Registers endpoints, applies validation
    ├── <name>.controller.ts   # Handles req/res, delegates to use cases
    └── <name>.validation.ts   # Zod schemas
```

## Anti-Patterns — Never Do This

### ❌ Wrong: Flat module structure

```
src/modules/auth/
├── auth.controller.ts      ← wrong: must live in presentation/
├── auth.repository.ts      ← wrong: repositories NEVER go inside modules/
├── auth.routes.ts          ← wrong: must live in presentation/
├── auth.schema.ts          ← wrong: must be auth.validation.ts inside presentation/
├── auth.service.ts         ← wrong: business logic must be split into use cases in application/
├── auth.types.ts           ← wrong: types at flat level — belongs in shared/services/ or infrastructure/
└── jwt.ts                  ← wrong: JWT is a shared service — belongs in shared/services/jwt/
```

**Every file shown above is wrong.** There are no flat `.ts` files at the module root except `<name>.factory.ts`.

### ✅ Correct: Layered module structure

```
src/modules/auth/
├── auth.factory.ts                        ← only flat file allowed at module root
├── application/
│   ├── dtos/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── login.use-case.ts
│   └── register.use-case.ts
└── presentation/
    ├── auth.controller.ts
    ├── auth.routes.ts
    └── auth.validation.ts
```

Files that were incorrectly placed in the flat structure belong here instead:

| Wrong placement | Correct placement |
|---|---|
| `modules/auth/auth.repository.ts` | `infrastructure/repositories/users/users.repository.ts` |
| `modules/auth/jwt.ts` | `shared/services/jwt/jwt.service.ts` |
| `modules/auth/auth.types.ts` | `shared/services/jwt/jwt.types.ts` or `infrastructure/repositories/users/users.types.ts` |
| `modules/auth/auth.schema.ts` | `modules/auth/presentation/auth.validation.ts` |
| `modules/auth/auth.service.ts` | Split into `modules/auth/application/login.use-case.ts`, `register.use-case.ts`, etc. |
| `modules/auth/auth.controller.ts` | `modules/auth/presentation/auth.controller.ts` |
| `modules/auth/auth.routes.ts` | `modules/auth/presentation/auth.routes.ts` |

---

## Key Principles

- One API = one DTO file + one use case file — always 1:1.
- DTOs are **classes with constructors** (not interfaces).
- Use cases receive **interfaces only** — never concrete classes.
- Use cases can dispatch background jobs via `IQueueService` — importing only the job's types file (payload type + name constant), never the worker class.
- Factory is the **only file** that imports concrete infrastructure classes.
- Controller methods are arrow functions, wrap results in `ApiResponse`, errors go to `next(error)`.
- Layer calling: Routes → Factory → Controller → Use Case → Repository.
- For async work: Use Case → `IQueueService.dispatch()` → (processed later by worker in `src/jobs/`).

## Detailed Rules

Loaded via `fileMatch` when editing files in these folders:
- `.kiro/steering/modules/application-rules.md`
- `.kiro/steering/modules/presentation-rules.md`
- `.kiro/steering/modules/factory-rules.md`
