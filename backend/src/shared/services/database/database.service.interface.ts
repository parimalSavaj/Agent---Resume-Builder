import { PoolClient, QueryResultRow } from 'pg';

export interface IDatabaseService {
  selectOne<T extends QueryResultRow>(sql: string, params?: unknown[]): Promise<T | null>;
  selectMany<T extends QueryResultRow>(sql: string, params?: unknown[]): Promise<T[]>;
  insert(sql: string, params?: unknown[]): Promise<void>;
  update(sql: string, params?: unknown[]): Promise<void>;
  delete(sql: string, params?: unknown[]): Promise<void>;
  getClient(): Promise<PoolClient>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
