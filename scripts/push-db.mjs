#!/usr/bin/env node
/**
 * Copy the local SQLite database (bharatx.db) to the hosted database (Turso): schema, then every row.
 *
 *   TURSO_DATABASE_URL=libsql://… TURSO_AUTH_TOKEN=… npm run push:db
 *   … npm run push:db -- --replace     # wipe the hosted database first
 *
 * Reads and writes through @libsql/client (no sqlite3 CLI), so values are copied exactly, with parameters.
 */
import { existsSync } from 'node:fs'
import { createClient } from '@libsql/client'

const source = process.env.LOCAL_DB ?? 'bharatx.db'
const url = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN
const replace = process.argv.includes('--replace')

if (!url) {
  console.error('Set TURSO_DATABASE_URL (and TURSO_AUTH_TOKEN). Tip: `vercel env pull .env.vercel`.')
  process.exit(1)
}
if (!existsSync(source)) {
  console.error(`Local database not found: ${source}`)
  process.exit(1)
}

const local = createClient({ url: `file:${source}` })
const remote = createClient({ url, authToken })
const userTables = "type='table' and name not like 'sqlite_%' and name not like '_litestream%'"

const existing = (await remote.execute(`select name from sqlite_master where ${userTables}`)).rows.map((r) => r.name)
if (existing.length && !replace) {
  console.error(`The hosted database already has ${existing.length} tables. Re-run with --replace to overwrite it.`)
  process.exit(1)
}
if (existing.length) {
  console.log(`Dropping ${existing.length} existing tables…`)
  await remote.executeMultiple(['PRAGMA foreign_keys=OFF;', ...existing.map((t) => `DROP TABLE IF EXISTS "${t}";`)].join('\n'))
}

// 1. Schema: tables first, then indexes, triggers and views.
const schema = (
  await local.execute(
    "select type, name, sql from sqlite_master where sql is not null and name not like 'sqlite_%' order by case type when 'table' then 0 else 1 end",
  )
).rows
const tables = schema.filter((s) => s.type === 'table').map((s) => s.name)
await remote.executeMultiple(['PRAGMA foreign_keys=OFF;', ...schema.map((s) => `${s.sql};`)].join('\n'))
console.log(`Created ${tables.length} tables and ${schema.length - tables.length} indexes/triggers.`)

// 2. Rows, in parameterised batches.
let total = 0
for (const table of tables) {
  const { rows, columns } = await local.execute(`select * from "${table}"`)
  if (!rows.length) continue
  const sql = `insert into "${table}" (${columns.map((c) => `"${c}"`).join(', ')}) values (${columns.map(() => '?').join(', ')})`
  for (let i = 0; i < rows.length; i += 200) {
    const chunk = rows.slice(i, i + 200).map((r) => ({ sql, args: columns.map((c) => r[c]) }))
    await remote.batch(chunk, 'write')
  }
  total += rows.length
}

const count = async (t) => (await remote.execute(`select count(*) as n from "${t}"`)).rows[0].n
console.log(
  `Copied ${total} rows. companies: ${await count('companies')}, partnerships: ${await count('partnerships')}, people: ${await count('people')}, media: ${await count('media')}, users: ${await count('users')}`,
)
