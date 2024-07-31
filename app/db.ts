import { Client } from '@neondatabase/serverless';
import { genSaltSync, hashSync } from 'bcrypt-ts';

const client = new Client({
  connectionString: process.env.POSTGRES_DATABASE_URL,
});

client.connect();

async function ensureTableExists() {
  try {
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'User'
      );`);

    if (!result.rows[0].exists) {
      await client.query(`
        CREATE TABLE "User" (
          id SERIAL PRIMARY KEY,
          email VARCHAR(64),
          password VARCHAR(64)
        );`);
    }
  } catch (error) {
    console.error('Error ensuring table exists:', error);
    throw error;
  }
}

export async function getUser(email: string) {
  await ensureTableExists();
  try {
    const result = await client.query('SELECT * FROM "User" WHERE email = $1', [email]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  await ensureTableExists();
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  try {
    const result = await client.query(
      'INSERT INTO "User" (email, password) VALUES ($1, $2) RETURNING *',
      [email, hash]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}
