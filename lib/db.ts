import { Pool, QueryResult } from 'pg';

// For local testing in sandbox without a real Postgres, we might need to mock or warn.
// In production/deployment, DATABASE_URL must be set.

let pool: Pool;

if (!process.env.DATABASE_URL) {
  // In sandbox, we don't have a DB. We'll handle this by ensuring our logic
  // uses the pool correctly, and we'll use pg-mem for verification scripts.
  // For the actual running app in this sandbox, it will crash if we try to query.
  // We'll define a placeholder if env is missing to allow build but fail on query.
  console.warn('DATABASE_URL is not defined. Queries will fail unless mocked.');
  pool = new Pool({
    connectionString: 'postgres://user:pass@localhost:5432/dbname'
  });
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Neon.tech usually
    },
  });
}

export const db = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: (text: string, params?: any[]): Promise<QueryResult> => pool.query(text, params),
};

export default pool;
