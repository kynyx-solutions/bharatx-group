#!/usr/bin/env node
/**
 * Make the deploy snapshot: the public website content, without private data.
 *   deploy-snapshot/content.sqlite   copy of bharatx.db with user accounts, enquiries, applications,
 *                                    CVs, private documents and admin preferences emptied, then VACUUMed
 *   deploy-snapshot/uploads/         copy of media/ (public images only)
 *
 * The one-time import on Vercel (src/seed/hosted-import.ts) loads this into an empty Turso database and Vercel Blob.
 *   npm run snapshot
 */
import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { createClient } from '@libsql/client'

const out = 'deploy-snapshot'
const db = `${out}/content.sqlite`
const privateTables = [
  'users_sessions',
  'users',
  'enquiries',
  'applications',
  'cv_files',
  'documents',
  'payload_preferences_rels',
  'payload_preferences',
  'payload_locked_documents_rels',
  'payload_locked_documents',
  'payload_kv',
]

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
console.log(`Snapshot ready: ${db} (private tables emptied: ${privateTables.filter((t) => present.has(t)).length}), ${readdirSync(`${out}/uploads`).length} uploads.`)
