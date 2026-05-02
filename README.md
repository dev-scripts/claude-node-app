# Node.js MVC API

A production-style REST API built with Express, MySQL, JWT auth, and Zod validation, organized around a strict **Model → Service → Controller → Route** pattern.

## Stack

| Layer       | Package                  |
|-------------|--------------------------|
| Runtime     | Node.js 22 (ESM)         |
| HTTP        | Express 4                |
| Database    | MySQL via `mysql2/promise` (connection pool) |
| Auth        | `jsonwebtoken` + `bcryptjs` |
| Validation  | Zod                      |
| Env         | dotenv + Zod             |
| Security    | helmet + cors            |
| Logging     | morgan                   |
| Testing     | Jest + Supertest         |

## Project Structure

```
src/
├── config/
│   ├── env.js              # Zod-validated env vars
│   ├── database.js         # MySQL connection pool + query helpers
│   └── migrate.js          # Schema migrations (auto-runs on start)
├── controllers/            # (C) Handle req/res only
│   ├── auth.controller.js
│   └── user.controller.js
├── middlewares/
│   ├── auth.middleware.js  # authenticate + authorize(role)
│   ├── validate.middleware.js
│   └── error.middleware.js
├── models/                 # (M) Raw DB queries — no business logic
│   └── user.model.js
├── routes/
│   └── v1/                 # API versioning
│       ├── auth.routes.js
│       ├── user.routes.js
│       └── index.js        # Mounts all v1 feature routers
├── services/               # All business logic lives here
│   ├── auth.service.js
│   └── user.service.js
├── utils/
│   └── response.js
├── validators/             # Zod schemas
│   └── user.validator.js
├── app.js                  # Express app factory
└── server.js               # Entry point
tests/                      # Jest + Supertest suites
```

## Conventions

- All async/await — no callbacks.
- Every route flows through: **validate middleware → controller → service → model**.
- **Services** hold all business logic. **Controllers** only handle req/res. **Models** only run DB queries.
- Errors are thrown with a status: `throw Object.assign(new Error('Not found'), { status: 404 })`. The error middleware turns these into JSON responses.
- All endpoints are versioned under `/api/v1/`.

## Getting Started

```bash
cp .env.example .env       # set JWT_SECRET, DB credentials
npm install
npm run db:migrate         # optional — auto-runs on server start
npm run dev                # starts with nodemon
```

### Environment Variables

See `.env.example` for the full list. At minimum:

```
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=node_mvc

JWT_SECRET=your-strong-secret-here-min-16-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

BCRYPT_ROUNDS=10
```

## Scripts

| Command              | What it does                              |
|----------------------|-------------------------------------------|
| `npm run dev`        | Start with nodemon (auto-reload)          |
| `npm start`          | Start in production mode                  |
| `npm test`           | Run Jest test suite                       |
| `npm run db:migrate` | Run migrations manually                   |

## API Endpoints

| Method | Path                     | Auth   | Description       |
|--------|--------------------------|--------|-------------------|
| POST   | /api/v1/auth/register    | public | Register          |
| POST   | /api/v1/auth/login       | public | Login             |
| GET    | /api/v1/auth/me          | user   | Get own profile   |
| PUT    | /api/v1/auth/password    | user   | Change password   |
| GET    | /api/v1/users            | admin  | List all users    |
| GET    | /api/v1/users/:id        | user   | Get user by ID    |
| PUT    | /api/v1/users/:id        | user   | Update user       |
| DELETE | /api/v1/users/:id        | admin  | Delete user       |
| GET    | /health                  | public | Health check      |

### Response Shape

```json
{ "success": true, "data": { ... } }
```

Errors:

```json
{ "success": false, "error": "Message", "status": 404 }
```

## Adding a New Feature / Module

Use this prompt with your AI assistant:

> Add a new `<feature>` module with fields `<list fields>`. Follow the conventions in `CLAUDE.md` and use the `add-feature` skill in `.claude/skills/`.

## Testing

```bash
npm test
```

Tests live under `tests/` and use Supertest against the Express app factory in `src/app.js`. Use a separate `DB_NAME` for the test environment.

## Docker

```bash
docker compose up --build
```

Brings up the API alongside a MySQL container as defined in `docker-compose.yml`.

## Troubleshooting

- **`ECONNREFUSED` on startup** — MySQL isn't reachable. Check `DB_HOST`/`DB_PORT` in `.env` or that the docker service is up.
- **`Invalid token` / 401 on protected routes** — `JWT_SECRET` mismatch between when the token was issued and now, or the token has expired (`JWT_EXPIRES_IN`).
- **Migrations did not run** — `runMigrations()` is invoked from `src/server.js` at boot. If you bypassed `server.js`, run `npm run db:migrate` manually.
- **Zod errors come back as 500** — make sure your route uses `validate(schema)` middleware; raw Zod throws are otherwise turned into generic errors.

## License

MIT
