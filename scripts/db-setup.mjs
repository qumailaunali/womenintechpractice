import { readFileSync } from "node:fs";
import bcrypt from "bcryptjs";
import pg from "pg";

process.loadEnvFile(".env.local");
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
await client.connect();
await client.query(readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
await client.query(
  "insert into app_users (email, name, password_hash) values ($1, $2, $3) on conflict (email) do nothing",
  ["demo@studypilot.ai", "Demo Student", await bcrypt.hash("demo1234", 10)],
);
await client.end();
console.log("Database schema ready (demo user: demo@studypilot.ai / demo1234).");
