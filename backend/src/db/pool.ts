import { Pool, QueryResultRow } from "pg";
import { env } from "../config/env";

// Single shared connection pool. Same code path for dev/prod;
// only the DATABASE_URL value changes between environments.
export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.isProduction ? { rejectUnauthorized: false } : undefined,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle Postgres client", err);
});

export async function query<T extends QueryResultRow = any>(text: string, params?: any[]) {
  const result = await pool.query<T>(text, params);
  return result;
}
