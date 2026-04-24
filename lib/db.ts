import { neon } from "@neondatabase/serverless";

const dbUrl: string = process.env.DATABASE_URL || "postgres://empty";
export const sql = neon(dbUrl);