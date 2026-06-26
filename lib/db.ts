import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;

export const hasDb = Boolean(url);

/** Neon serverless SQL client. Null when DATABASE_URL is unset (graceful degrade). */
export const sql = url ? neon(url) : null;
