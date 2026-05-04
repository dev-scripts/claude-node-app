/**
 * .claude/hooks/post-tool.js
 * PostToolUse hook — runs after every tool call.
 */

import { execSync } from 'node:child_process';

export default function postToolUse({ tool, input, output }) {
  // Log file writes to agent-memory for traceability
  if (tool === 'write_file' || tool === 'create_file') {
    const timestamp = new Date().toISOString();
    console.log(`[hook:postToolUse] 📝 File written: ${input?.path} at ${timestamp}`);
  }

  // Flag if tests fail after a bash run
  if (tool === 'bash' && output?.includes('FAIL')) {
    console.warn('[hook:postToolUse] ⚠️  Test failures detected in last bash run');
  }

  // Auto-open a PR when a `git push` succeeds on a non-master branch
  if (
    tool === 'bash' &&
    /^\s*git\s+push\b/.test(input?.command ?? '') &&
    !/error|rejected|fatal/i.test(output ?? '')
  ) {
    try {
      const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
      if (branch !== 'master' && branch !== 'main') {
        console.log(`[hook:postToolUse] 🚀 Push detected on ${branch} — invoking pr-opener subagent`);
        // Invoke the subagent defined in .claude/agents/pr-opener.md
        execSync('claude agent run pr-opener', { stdio: 'inherit' });
      }
    } catch (err) {
      console.warn('[hook:postToolUse] pr-opener invocation failed:', err.message);
    }
  }
}
