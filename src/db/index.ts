import { Pool } from 'pg';
import { config } from '../config/env';

// Database connection
// This pool is specifically configured to work with NeonDB / PostgreSQL
const pool = new Pool({
  connectionString: config.database_url,
  ssl: config.env === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;
