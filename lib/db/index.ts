import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Neon SQL connection
const sql = neon(process.env.DATABASE_URL!);

// Initialize Drizzle with the connection and schema
export const db = drizzle({ client: sql, schema });
