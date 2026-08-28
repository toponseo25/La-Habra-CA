import { PrismaClient } from '@prisma/client'

/**
 * Prisma client singleton for the RAS Heating & Air landing page.
 *
 * --- Database on local dev vs. Vercel ---
 *
 * LOCAL DEV: `DATABASE_URL` points at a SQLite file (db/custom.db). Everything
 * works — leads + analytics events persist to disk between dev server restarts.
 *
 * VERCEL (serverless): SQLite does NOT work because serverless functions have
 * an ephemeral, read-only filesystem. The build will succeed (Prisma client
 * generates from the schema), but runtime writes will throw. The landing
 * page itself (all the marketing sections) renders fine regardless — only the
 * /api/leads and /api/track endpoints need a real DB to persist.
 *
 * To make the CRM pipeline work on Vercel, swap the datasource in
 * prisma/schema.prisma to a hosted DB (recommended for this stack:
 * PlanetScale, Neon, Supabase, or Turso for SQLite-compatible) and set the
 * `DATABASE_URL` env var in Vercel. Then uncomment the `postinstall: prisma
 * generate` script in package.json so the client is generated during build.
 *
 * Until that swap happens, the endpoints fail gracefully (return a clear
 * error to the UI and log to the server) instead of crashing the function.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let client: PrismaClient | null = null;
let dbAvailable = false;

try {
  client =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV !== 'production' ? ['query', 'warn', 'error'] : ['error'],
    });
  dbAvailable = true;
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
} catch (e) {
  // Most likely: DATABASE_URL missing or Prisma client not generated yet.
  console.error('[db] Prisma client could not be initialized — running in DB-less mode.', e);
  client = null;
  dbAvailable = false;
}

export const db = client as PrismaClient;
/** True when a working DB connection is available; false on serverless without one. */
export const isDbAvailable = dbAvailable;
