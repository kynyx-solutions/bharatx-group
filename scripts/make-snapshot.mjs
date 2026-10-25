#!/usr/bin/env node
/**
 * Make the deploy snapshot: the public website content, without private data.
 *   deploy-snapshot/content.sqlite   copy of bharatx.db with user accounts, enquiries, applications,
 *                                    CVs, private documents and admin preferences emptied, then VACUUMed
 *   deploy-snapshot/uploads/         copy of media/ (public images only)
 *   deploy-snapshot/version.txt      when the snapshot was made
 *
 * The import on Vercel (src/seed/hosted-import.ts) loads it into Turso and Vercel Blob, and refreshes the content
 * whenever a newer snapshot is deployed.
 *   npm run snapshot
 */
import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { createClient } from '@libsql/client'
import { PRIVATE_TABLES } from './lib/copy-db.mjs'

const out = 'deploy-snapshot'
const db = `${out}/content.sqlite`
const privateTables = PRIVATE_TABLES

rmSync(out, { recursive: true, force: true })
mkdirSync(`${out}/uploads`, { recursive: true })
copyFileSync('bharatx.db', db)

const client = createClient({ url: `file:${db}` })
const present = new Set((await client.execute("select name from sqlite_master where type='table'")).rows.map((r) => r.name))
await client.executeMultiple(
  ['PRAGMA foreign_keys=OFF;', ...privateTables.filter((t) => present.has(t)).map((t) => `DELETE FROM "${t}";`)].join('\n'),
)
// Rewrite the file so deleted rows (e.g. password hashes) don't linger in free pages.
await client.execute('VACUUM')
client.close()

if (existsSync('media')) cpSync('media', `${out}/uploads`, { recursive: true })
// The version tells the import on Vercel that the content changed (see src/seed/hosted-import.ts).
writeFileSync(`${out}/version.txt`, new Date().toISOString())
console.log(`Snapshot ready: ${db} (private tables emptied: ${privateTables.filter((t) => present.has(t)).length}), ${readdirSync(`${out}/uploads`).length} uploads.`)
