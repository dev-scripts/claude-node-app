import { createApp } from './app.js';
import { env } from './config/env.js';
import { runMigrations } from './config/migrate.js';
import { closePool } from './config/database.js';

const app = createApp();

async function start() {
  await runMigrations();

  const server = app.listen(env.PORT, () => {
    console.log(`🚀  Server running on http://localhost:${env.PORT}`);
    console.log(`📦  Environment: ${env.NODE_ENV}`);
    console.log(`🗄️   Database: MySQL @ ${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`);
    console.log(`📋  API base: http://localhost:${env.PORT}/api/v1`);
  });

  process.on('SIGTERM', async () => {
    server.close(async () => {
      await closePool();
      console.log('Server closed');
      process.exit(0);
    });
  });
}

start().catch(err => {
  console.error('❌  Failed to start server:', err.message);
  process.exit(1);
});
