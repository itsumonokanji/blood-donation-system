import { neon } from "@neondatabase/serverless";

// TypeScript больше не будет задавать вопросов
const globalAny: any = process.env;
export const sql = neon(globalAny.DATABASE_URL);