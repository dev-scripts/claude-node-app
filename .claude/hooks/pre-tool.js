/**
 * .claude/hooks/pre-tool.js
 * PreToolUse hook — runs before every tool call.
 * Deterministic: cannot hallucinate since it's plain code.
 */

export default function preToolUse({ tool, input }) {
  // Block any accidental DROP TABLE commands
  if (tool === 'bash' && input?.command?.toUpperCase().includes('DROP TABLE')) {
    return {
      block: true,
      reason: 'DROP TABLE detected — blocked by pre-tool hook. Use migrations instead.',
    };
  }

  // Warn before deleting files in src/
  if (tool === 'bash' && input?.command?.includes('rm') && input?.command?.includes('src/')) {
    console.warn('[hook:preToolUse] ⚠️  Deleting files in src/ — proceed carefully');
  }

  return { block: false };
}
