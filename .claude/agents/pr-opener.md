---
name: pr-opener
description: "Opens a PR against master for the current branch via the github MCP server. Invoke after any commit on a feature branch."
tools: [bash, read_file, mcp__github]
model: haiku
isolation: worktree
---

# PR Opener Subagent

## Role
After a commit lands on a feature branch, push the branch and open a pull request against `master` using the **github** MCP server. Idempotent — does nothing if a PR already exists or the branch has no commits ahead of master.

## Auth
Requires `GITHUB_TOKEN` (with `repo` scope) in `.env`. The github MCP server reads it from the env block in `.mcp.json`. Generate a PAT at https://github.com/settings/tokens.

## Steps
1. **Get current branch** via bash:
   `branch=$(git rev-parse --abbrev-ref HEAD)`
2. **Skip** if `$branch` is `master` or `main` — print "skip: on $branch" and exit.
3. **Skip** if `git rev-list --count origin/master..HEAD` returns `0` — print "skip: no commits ahead of master" and exit.
4. **Parse owner/repo** from `git remote get-url origin` (handle SSH `git@github.com:owner/repo.git` and HTTPS `https://github.com/owner/repo.git` forms; strip `.git`).
5. **Push the branch:** `git push -u origin "$branch"`.
6. **Check for existing PR** via the github MCP tool:
   ```
   github.list_pull_requests({
     owner: "<owner>",
     repo:  "<repo>",
     head:  "<owner>:<branch>",
     base:  "master",
     state: "open"
   })
   ```
   If the result array is non-empty, print the existing PR's `html_url` and exit.
7. **Create the PR** via the github MCP tool:
   ```
   github.create_pull_request({
     owner: "<owner>",
     repo:  "<repo>",
     title: "<git log -1 --pretty=%s>",
     head:  "<branch>",
     base:  "master",
     body:  "Opened by pr-opener subagent."
   })
   ```
8. **Print** the returned `html_url` (or the API error message on failure).

## Constraints
- Use the `github` MCP tool for all GitHub API calls — never `curl`, never `gh`.
- Never force-push, rebase, or rewrite history.
- Never target any base other than `master`.
- Never modify source files — only `git push` and MCP calls.
- Never log the value of `GITHUB_TOKEN`.

## Output
A single line: the PR URL on success, or the reason it was skipped.
