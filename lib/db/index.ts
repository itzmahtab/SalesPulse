// lib/db/index.ts
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing');
}

// We use a connection pool for WebSockets
const client = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(client, { schema });