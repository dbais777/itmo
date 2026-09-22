import pkg from 'pg';
const { Pool } = pkg;
const host = process.env.DATABASE_HOST || 'postgres';
const port = parseInt(process.env.DATABASE_PORT || '5432', 10);
const user = process.env.DATABASE_USER || 'itmo_user';
const password = process.env.DATABASE_PASSWORD || 'itmo_pass';
const database = process.env.DATABASE_NAME || 'itmo_db';
const pool = new Pool({ host, port, user, password, database });
const rows = [
  { id: '11111111-1111-1111-1111-111111111111', title: 'Intro to Docker', duration: 120 },
  { id: '22222222-2222-2222-2222-222222222222', title: 'Node.js Best Practices', duration: 360 },
  { id: '33333333-3333-3333-3333-333333333333', title: 'Postgres for Beginners', duration: 240 }
];

async function seed() {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS videos (
      id uuid PRIMARY KEY,
      title text NOT NULL,
      duration integer NOT NULL
    )`);

    for (const r of rows) {
      const res = await pool.query('INSERT INTO videos(id,title,duration) VALUES($1,$2,$3) ON CONFLICT (id) DO NOTHING RETURNING id', [r.id, r.title, r.duration]);
      if (res.rowCount === 1) {
        console.log('Inserted', r.id, r.title);
      } else {
        console.log('Skipped (exists)', r.id, r.title);
      }
    }
  } catch (err) {
    console.error('Seed error', err);
    process.exit(2);
  } finally {
    await pool.end();
  }
}

seed();
