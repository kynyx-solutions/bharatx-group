#!/usr/bin/env node
/**
 * Copy the local SQLite database (bharatx.db) to the hosted database (Turso): schema, then every row.
 *
 *   TURSO_DATABASE_URL=libsql://… TURSO_AUTH_TOKEN=… npm run push:db
 *   … npm run push:db -- --replace     # wipe the hosted database first
 */
import { existsSync } from 'node:fs'
import { createClient } from '@libsql/client'
import { copyDatabase } from './lib/copy-db.mjs'

const source = process.env.LOCAL_DB ?? 'bharatx.db'
const url = process.env.TURSO_DATABASE_URL
if (!url || url.includes('SENSITIVE')) {
  console.error('Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN (real values, not Vercel’s [SENSITIVE] placeholder).')
  process.exit(1)
}
if (!existsSync(source)) {
  console.error(`Local database not found: ${source}`)
  process.exit(1)
}

const to = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN })
try {
  await copyDatabase({ from: createClient({ url: `file:${source}` }), to, replace: process.argv.includes('--replace') })
} catch (err) {
  console.error(err.message)
  process.exit(1)
}
const count = async (t) => (await to.execute(`select count(*) as n from "${t}"`)).rows[0].n
console.log(`companies: ${await count('companies')}, partnerships: ${await count('partnerships')}, people: ${await count('people')}, media: ${await count('media')}`)
