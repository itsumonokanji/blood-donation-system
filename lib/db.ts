import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not defined in environment variables!");
}

export const sql = neon(process.env.DATABASE_URL as string);