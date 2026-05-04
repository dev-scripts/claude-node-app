#!/usr/bin/env node
/**
 * .claude/hooks/post-tool.js
 * PostToolUse hook — Claude Code protocol (stdin JSON in, stdout JSON out).
 *
 * Fires after every tool call. When it sees a successful `git commit` on a
 * non-master branch, it nudges the orchestrator to invoke the pr-opener
 * subagent, which uses the github MCP server to push + open a PR.
 */

import { execSync } from 'node:child_process';

let payload = '';
process.stdin.on('data', chunk => { payload += chunk; });
process.stdin.on('end', () => {
  try {
    const event = JSON.parse(payload || '{}');

    // Only care about Bash tool calls
    if (event.tool_name !== 'Bash') return ok();

    const cmd      = event.tool_input?.command ?? '';
    const exitCode = event.tool_response?.exitCode ?? 1;
    const stderr   = event.tool_response?.stderr ?? '';

    // Match `git commit ...` (allow leading whitespace, ignore `--amend` here)
    if (!/^\s*git\s+commit\b/.test(cmd)) return ok();
    if (exitCode !== 0)                  return ok();
    if (/nothing to commit/i.test(stderr)) return ok();

    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: event.cwd || process.cwd(),
    }).toString().trim();

    if (branch === 'master' || branch === 'main') return ok();

    // Inject context that the orchestrator will see in its next turn
    return process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext:
          `A commit just landed on branch "${branch}". ` +
          `Per CLAUDE.md, invoke the pr-opener subagent ` +
          `(.claude/agents/pr-opener.md) now to push the branch and ` +
          `open a PR against master via the github MCP server.`,
      },
    }));
  } catch {
    return ok();
  }
});

function ok() { /* exit 0, no output → no behavior change */ }
