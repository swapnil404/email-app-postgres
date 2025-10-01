import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

export const pool = new Pool({
  connectionString: String(process.env.DATABASE_URL),
});

export const db = drizzle(pool);

export async function connectdb() {
  try {
    console.log("connecting...");
    await pool.connect();
    console.log("connected successfully!");
  } catch (error) {
    console.log(error);
  }
}
