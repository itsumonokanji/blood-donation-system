import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL || "";
export const sql = neon(url);