---
name: review
description: "Auto-invoked when task context mentions 'review', 'audit', 'check code quality', or 'find bugs'. Reviews src/ files and reports issues."
slash_command: /review
---

# Review Skill

## Purpose
Scans the MVC project source files and produces a quality report covering:
- Missing error handling in controllers/services
- Unvalidated inputs (routes missing validate middleware)
- Business logic accidentally placed in controllers (should be in services)
- Missing await on async model calls
- Hardcoded secrets or credentials

## Steps
1. List all files in `src/`
2. Check each controller — every method must have try/catch
3. Check each route — every POST/PUT must have `validate()` middleware
4. Check each service — no direct `req`/`res` references allowed
5. Check each model — only raw SQL, no business rules
6. Report findings grouped by severity

## Output Format
```
📋 Code Review Report
─────────────────────────────────
✅ auth.controller.js   — OK
⚠️  user.controller.js  — missing try/catch on getAll (line 8)
❌ user.routes.js       — PUT /:id missing validate() middleware
─────────────────────────────────
Issues: 2  |  Critical: 1  |  Warnings: 1
```
