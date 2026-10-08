import { Pool } from "pg";

const globalForDb = globalThis as unknown as { pgPool?: Pool };

// Reuse one pool across hot reloads in development.
export const db = globalForDb.pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

if (process.env.NODE_ENV !== "production") globalForDb.pgPool = db;
