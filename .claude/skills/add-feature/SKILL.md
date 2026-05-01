---
name: add-feature
description: "Auto-invoked when user asks to 'add a new feature', 'create a new module', or 'scaffold X'. Generates the full MVC stack for a new resource."
slash_command: /add-feature
---

# Add Feature Skill

## Purpose
Scaffolds the complete MVC stack for a new resource following project conventions.

## Input
Feature name (e.g. "product", "order", "category")

## Steps
1. Create migration in `src/config/migrate.js`
2. Create `src/models/{feature}.model.js` with CRUD methods
3. Create `src/validators/{feature}.validator.js` with Zod schemas
4. Create `src/services/{feature}.service.js` with business logic
5. Create `src/controllers/{feature}.controller.js` with try/catch on every method
6. Create `src/routes/v1/{feature}.routes.js` with auth + validate middleware
7. Register the route in `src/routes/v1/index.js`

## Conventions to follow
- Model methods are all async
- Service throws `Object.assign(new Error(msg), { status: 4xx })` for errors
- Controller methods: `(req, res, next)` with `try/catch → next(err)`
- Routes use `authenticate` and `validate()` middleware from existing files

## Output
Confirmation message listing all files created and the registered route path.
