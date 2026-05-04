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

## Delegation
Run the actual file scanning inside the `code-reviewer` subagent
(`.claude/agents/code-reviewer.md`) so the work happens in an isolated,
read-only context on Haiku. The subagent returns a JSON array of findings;
this skill is responsible for formatting them per the Output Format below.

## Steps
1. Invoke the `code-reviewer` subagent with `src/` as the scan target.
2. Subagent lists files in `src/` and runs the checks below:
   - Every controller method has `try/catch`
   - Every POST/PUT route has `validate()` middleware
   - Services do not reference `req`/`res` directly
   - Models contain only raw SQL, no business rules
3. Subagent returns a JSON array of findings (see its Output Schema).
4. This skill formats the findings per the Output Format and groups by severity.

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
