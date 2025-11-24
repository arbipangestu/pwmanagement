import { Pool, QueryResult } from 'pg';

let pool: Pool;

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not defined in environment variables.');
  // Fail fast in production-like environments or use a dummy that throws on use
  pool = new Pool({
    connectionString: 'postgres://invalid:invalid@localhost:5432/invalid'
  });
} else {
  console.log('Initializing DB Pool with provided DATABASE_URL...');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Neon.tech
    },
    // Add timeouts to fail faster if DB is unreachable
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  });

  // Test connection on startup (optional but helpful for debugging logs)
  pool.connect().then(client => {
    console.log('Database connection established successfully.');
    client.release();
  }).catch(err => {
    console.error('Failed to establish initial database connection:', err);
  });
}

export const db = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: (text: string, params?: any[]): Promise<QueryResult> => pool.query(text, params),
};

export default pool;
