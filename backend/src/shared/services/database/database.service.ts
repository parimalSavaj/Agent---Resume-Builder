import { Pool, PoolClient, QueryResultRow, types } from 'pg';
import { IDatabaseService } from './database.service.interface';
import { config } from '../../config';

// Postgres DATE columns have no time-of-day or timezone component, but node-postgres's
// default parser (OID 1082) converts them into a JS Date at local midnight. Calling
// .toISOString() on that Date later shifts it to UTC, which can roll the date backward
// or forward by a day depending on the server's timezone offset. Returning the raw
// "YYYY-MM-DD" string instead avoids that conversion entirely - callers that need a
// Date can parse it explicitly, but most just pass the string straight through.
types.setTypeParser(1082, (value: string) => value);

export class DatabaseService implements IDatabaseService {
  private static instance: DatabaseService;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      connectionString: config.databaseUrl,
      ssl: config.isProduction ? { rejectUnauthorized: false } : undefined,
      // Lambda can have many concurrent execution environments, each holding their
      // own pool. Keep the per-instance connection count low to avoid exhausting
      // the database's max_connections limit.
      max: config.isProduction ? 2 : 10,
      // How long (ms) a connection can sit idle before being closed.
      // Set to 0 in production so connections are never evicted mid-freeze;
      // the database server will close them if they go stale and pg will
      // reconnect automatically on next use.
      idleTimeoutMillis: config.isProduction ? 0 : 10000,
      // Do not allow the pool to keep the Node.js event loop alive when
      // all connections are idle — important for Lambda to exit cleanly.
      allowExitOnIdle: true,
      // How long (ms) to wait for a new connection before throwing an error.
      connectionTimeoutMillis: 5000,
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle Postgres client', err);
    });
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async selectOne<T extends QueryResultRow>(sql: string, params?: unknown[]): Promise<T | null> {
    const result = await this.pool.query<T>(sql, params);
    return result.rows[0] ?? null;
  }

  async selectMany<T extends QueryResultRow>(sql: string, params?: unknown[]): Promise<T[]> {
    const result = await this.pool.query<T>(sql, params);
    return result.rows;
  }

  async insert(sql: string, params?: unknown[]): Promise<void> {
    await this.pool.query(sql, params);
  }

  async update(sql: string, params?: unknown[]): Promise<void> {
    await this.pool.query(sql, params);
  }

  async delete(sql: string, params?: unknown[]): Promise<void> {
    await this.pool.query(sql, params);
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async connect(): Promise<void> {
    // Pool connects lazily - verify connectivity with a test query
    const client = await this.pool.connect();
    client.release();
  }

  async disconnect(): Promise<void> {
    await this.pool.end();
  }
}
