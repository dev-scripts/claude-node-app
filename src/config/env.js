import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV:               z.enum(['development', 'test', 'production']).default('development'),
  PORT:                   z.coerce.number().default(3000),

  // MySQL
  DB_HOST:                z.string().default('localhost'),
  DB_PORT:                z.coerce.number().default(3306),
  DB_USER:                z.string().default('root'),
  DB_PASSWORD:            z.string().default(''),
  DB_NAME:                z.string().default('node_mvc'),

  // JWT
  JWT_SECRET:             z.string().min(16, 'JWT_SECRET must be at least 16 chars'),
  JWT_EXPIRES_IN:         z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // Bcrypt
  BCRYPT_ROUNDS:          z.coerce.number().default(10),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌  Invalid environment variables:\n', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
