/**
 * .claude/hooks/post-tool.js
 * PostToolUse hook — runs after every tool call.
 */

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
}
