import { Pool } from 'pg';

const host = process.env.DATABASE_HOST || 'postgres';
const port = parseInt(process.env.DATABASE_PORT || '5432', 10);
const user = process.env.DATABASE_USER || 'itmo_user';
const password = process.env.DATABASE_PASSWORD || 'itmo_pass';
const database = process.env.DATABASE_NAME || 'itmo_db';

const retryDelay = 1000;

async function waitForDb() {
  const pool = new Pool({ host, port, user, password, database, max: 1, idleTimeoutMillis: 1000 });

  while (true) {
    try {
      console.log(`Waiting for Postgres at ${host}:${port}...`);
      const client = await pool.connect();
      try {
        await client.query('SELECT 1');
        console.log('Postgres is ready.');
        client.release();
        await pool.end();
        process.exit(0);
      } catch (err) {
        client.release();
        throw err;
      }
    } catch (err) {
      console.log('Postgres not ready yet:', err.message ? err.message : err);
      await new Promise((r) => setTimeout(r, retryDelay));
    }
  }
}

waitForDb();
