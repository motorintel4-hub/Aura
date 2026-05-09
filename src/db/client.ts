import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Handle missing DATABASE_URL gracefully
const databaseUrl = process.env.DATABASE_URL;
let db: any = null;

if (!databaseUrl) {
  console.warn('⚠️  DATABASE_URL is not configured. Database queries will fail.');
  console.warn('To fix: Set DATABASE_URL in your environment variables.');
} else {
  try {
    const client = postgres(databaseUrl);
    db = drizzle(client, { schema });
  } catch (error) {
    console.error('Failed to initialize database client:', error);
  }
}

export { db };
export type Database = typeof db;
