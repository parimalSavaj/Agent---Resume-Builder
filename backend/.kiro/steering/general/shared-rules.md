---
description: Summary of the shared layer (services, core, config, middlewares) — cross-cutting concerns
inclusion: auto
---

# Shared Layer Rules

## Overview

`src/shared/` contains cross-cutting concerns used across the entire app. Nothing feature-specific lives here.

## Structure

```
src/shared/
├── @types/          # .d.ts augmentations for third-party libraries
├── config/          # App configuration (env vars parsed with Zod)
├── constants/       # Shared constants (route prefixes, status codes)
├── core/            # HTTP primitives (ApiError, ApiResponse, ErrorHandler) + job error primitives (NonRetryableError)
├── middlewares/     # Global middlewares (auth, validate, role)
└── services/        # Shared services — one folder per service
    ├── logger/      # interface + implementation
    ├── database/    # interface + types + implementation
    ├── queue/       # interface + types + implementation (job dispatching/processing)
    ├── jwt/         # interface + types + implementation
    └── ...          # hash/, id/, swagger/, etc.
```

## Key Principles

- Services use singleton pattern — `private constructor` + `static getInstance()`.
- Services instantiated in `server.ts` (for HTTP process) and `job-runner.ts` (for worker process), passed into their respective bootstraps via interfaces.
- `core/` has ApiError subclasses (NotFoundError, ConflictError, etc.) — use cases throw these.
- `core/` also has `job-errors.ts` with `NonRetryableError` — workers throw this when a job should not be retried.
- Enums do NOT live here — all enums live in `src/domain/enums/`.

## Detailed Rules

Loaded via `fileMatch` when editing files in these folders:
- `.kiro/steering/shared/services-rules.md`
- `.kiro/steering/shared/queue-service-rules.md`
- `.kiro/steering/shared/core-rules.md`
- `.kiro/steering/shared/config-rules.md`
- `.kiro/steering/shared/middlewares-rules.md`
- `.kiro/steering/shared/types-rules.md`
- `.kiro/steering/shared/swagger-rules.md`
