/**
 * .claude/hooks/session-start.js
 * SessionStart hook — runs once when Claude Code session begins.
 */

export default function sessionStart() {
  console.log('🤖 Claude Code session started for node-mvc-api');
  console.log('📖 Reading CLAUDE.md for project context...');
  console.log('💡 Available slash commands: /review, /add-feature');
  console.log('🗄️  Database: MySQL — ensure .env is configured');
}
