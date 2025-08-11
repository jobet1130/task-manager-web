import { Pool } from 'pg';
import { DatabaseError } from './exceptions';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false,
    } : false,
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
export async function transaction<T>(callback: (client: Pool) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client as unknown as Pool);
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