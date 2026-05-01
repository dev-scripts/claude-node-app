# Node MVC API — Project Brain

## Architecture
- **Pattern:** MVC (Model → Service → Controller → Route)
- **Runtime:** Node.js 22 (ESM)
- **Database:** MySQL via `mysql2/promise` connection pool
- **Auth:** JWT stateless (access + refresh tokens)
- **Validation:** Zod schemas in `src/validators/`
- **Entry:** `src/server.js`

## Tech Stack
| Layer       | Package          |
|-------------|------------------|
| HTTP        | Express 4        |
| Database    | mysql2/promise   |
| Auth        | jsonwebtoken + bcryptjs |
| Validation  | Zod              |
| Env         | dotenv + Zod     |
| Security    | helmet + cors    |
| Logging     | morgan           |
| Testing     | Jest + Supertest |

## Conventions
- All async/await — no callbacks
- Every route goes through: validate middleware → controller → service → model
- Services hold ALL business logic — controllers only handle req/res
- Models only do raw DB queries — no business logic
- Errors use `Object.assign(new Error(msg), { status: 4xx })`
- API versioned under `/api/v1/`

## Workflow Rules
- Run `npm run dev` to start with nodemon
- Run `npm test` to run Jest tests
- Run `npm run db:migrate` to run migrations manually
- Migrations auto-run on server start
- Never commit `.env` — use `.env.example` as reference

## Adding a New Feature
1. Add table in `src/config/migrate.js`
2. Create `src/models/feature.model.js`
3. Create `src/validators/feature.validator.js`
4. Create `src/services/feature.service.js`
5. Create `src/controllers/feature.controller.js`
6. Create `src/routes/v1/feature.routes.js`
7. Register in `src/routes/v1/index.js`
