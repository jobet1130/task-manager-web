import { Pool } from 'pg';
import { DatabaseError } from './exceptions';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false,
    } : false,
    // Enhanced pool configuration
    max: parseInt(process.env.POSTGRES_MAX_CONNECTIONS || '20'),
    idleTimeoutMillis: parseInt(process.env.POSTGRES_IDLE_TIMEOUT || '30000'),
    connectionTimeoutMillis: parseInt(process.env.POSTGRES_CONNECTION_TIMEOUT || '5000'),
    allowExitOnIdle: false,
})

export default pool;

// Helper function to execute queries
export async function query(text: string, params?: (string | number | boolean | null)[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw new DatabaseError('Database query failed', error as Error);
  } finally {
    client.release();
  }
}

// Helper function for transactions
export async function transaction<T>(callback: (client: Pool['query']) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client.query.bind(client));
    await client.query('COMMIT');
    return result;
  } catch (error) {
    console.error('Transaction error:', error);
    await client.query('ROLLBACK');
    throw new DatabaseError('Transaction failed', error as Error);
  } finally {
    client.release();
  }
}

// Add after existing exports
export async function healthCheck(): Promise<boolean> {
  try {
    const result = await query('SELECT 1 as health');
    return result.rows[0]?.health === 1;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Pool event listeners for monitoring
pool.on('connect', (client) => {
  console.log('New client connected to database');
  console.log(client);

});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  console.log(client);
});