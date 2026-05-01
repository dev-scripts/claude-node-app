/**
 * plugins/logger.js
 * Bundled Distribution Plugin — auto-detected and loaded at startup.
 * Provides structured logging across the app.
 */

export function createLogger(level = 'info') {
  const levels = { debug: 0, info: 1, warn: 2, error: 3 };
  const current = levels[level] ?? 1;

  const format = (tag, msg) =>
    `[${new Date().toISOString()}] ${tag} ${msg}`;

  return {
    debug: (msg) => current <= 0 && console.log(format('🔍 DEBUG', msg)),
    info:  (msg) => current <= 1 && console.log(format('ℹ️  INFO ', msg)),
    warn:  (msg) => current <= 2 && console.warn(format('⚠️  WARN ', msg)),
    error: (msg) => current <= 3 && console.error(format('❌ ERROR', msg)),
  };
}
