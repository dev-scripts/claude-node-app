# Node.js MVC API

REST API built with Express, SQLite (Node 22 built-in), JWT auth, and Zod validation.

## Stack
- **Runtime**: Node.js 22
- **Framework**: Express
- **Database**: SQLite (via `node:sqlite` built-in)
- **Auth**: JWT (stateless)
- **Validation**: Zod
- **Testing**: Jest + Supertest

## Project Structure

```
src/
├── config/
│   ├── env.js          # Zod-validated env vars
│   ├── database.js     # SQLite connection singleton
│   └── migrate.js      # Schema migrations
├── controllers/        # (C) Handle req/res
│   ├── auth.controller.js
│   └── user.controller.js
├── middlewares/        # Auth, validation, error handling
│   ├── auth.middleware.js
│   ├── validate.middleware.js
│   └── error.middleware.js
├── models/             # (M) Database queries
│   └── user.model.js
├── routes/
│   └── v1/             # API versioning
│       ├── auth.routes.js
│       ├── user.routes.js
│       └── index.js
├── services/           # Business logic
│   ├── auth.service.js
│   └── user.service.js
├── utils/
│   └── response.js
├── validators/
│   └── user.validator.js
├── app.js              # Express app factory
└── server.js           # Entry point
```

## Getting Started

```bash
cp .env.example .env     # set JWT_SECRET
npm install
npm run db:migrate       # optional — auto-runs on start
npm run dev
```

## API Endpoints

| Method | Path                     | Auth     | Description         |
|--------|--------------------------|----------|---------------------|
| POST   | /api/v1/auth/register    | public   | Register            |
| POST   | /api/v1/auth/login       | public   | Login               |
| GET    | /api/v1/auth/me          | user     | Get own profile     |
| PUT    | /api/v1/auth/password    | user     | Change password     |
| GET    | /api/v1/users            | admin    | List all users      |
| GET    | /api/v1/users/:id        | user     | Get user by ID      |
| PUT    | /api/v1/users/:id        | user     | Update user         |
| DELETE | /api/v1/users/:id        | admin    | Delete user         |
| GET    | /health                  | public   | Health check        |

## Adding a New Feature

1. Add table to `src/config/migrate.js`
2. Create `src/models/feature.model.js`
3. Create `src/validators/feature.validator.js`
4. Create `src/services/feature.service.js`
5. Create `src/controllers/feature.controller.js`
6. Create `src/routes/v1/feature.routes.js`
7. Register in `src/routes/v1/index.js`

## Docker

```bash
docker compose up --build
```

## Tests

```bash
npm test
```
