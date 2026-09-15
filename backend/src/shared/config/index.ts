import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  nodeEnv: z.string().default('development'),
  port: z.coerce.number().default(4000),

  databaseUrl: z.string().min(1, 'DATABASE_URL is required'),

  jwtAccessSecret: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  jwtRefreshSecret: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  jwtAccessExpiresIn: z.string().default('15m'),
  jwtRefreshExpiresIn: z.string().default('7d'),

  clientOrigin: z.string().default('http://localhost:5173'),
});

const parsed = configSchema.safeParse({
  nodeEnv: process.env['NODE_ENV'],
  port: process.env['PORT'],
  databaseUrl: process.env['DATABASE_URL'],
  jwtAccessSecret: process.env['JWT_ACCESS_SECRET'],
  jwtRefreshSecret: process.env['JWT_REFRESH_SECRET'],
  jwtAccessExpiresIn: process.env['JWT_ACCESS_EXPIRES_IN'],
  jwtRefreshExpiresIn: process.env['JWT_REFRESH_EXPIRES_IN'],
  clientOrigin: process.env['CLIENT_ORIGIN'],
});

if (!parsed.success) {
  console.error('Invalid configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = {
  ...parsed.data,
  isProduction: parsed.data.nodeEnv === 'production',
};
