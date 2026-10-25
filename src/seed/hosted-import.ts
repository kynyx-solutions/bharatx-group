/**
 * Content import on Vercel, run before `next build` (see scripts/prebuild.mjs). Three independent steps, each
 * done only when needed, so it is safe on every build:
 *   1. Database: if the hosted database (Turso) is empty, load deploy-snapshot/content.sqlite. If it has content
 *      from an older snapshot, refresh the content tables; user accounts, enquiries, applications, CVs and
 *      documents are never touched. Set FREEZE_HOSTED_CONTENT=1 on Vercel once content is edited there instead.
 *   2. Images:   upload any file in deploy-snapshot/uploads/ that the Vercel Blob store doesn't have yet.
 *   3. Admin:    if there are no user accounts, create an admin with a random password, printed once in the build log.
 */
import crypto from 'crypto'
import { existsSync, readdirSync, readFileSync } from 'fs'
import path from 'path'
import { createClient } from '@libsql/client'
import { list, put } from '@vercel/blob'
import { getPayload } from 'payload'
import { copyDatabase, listTables, syncContent } from '../../scripts/lib/copy-db.mjs'
import config from '../payload.config'

const log = (m: string) => console.log(`[hosted-import] ${m}`)
const snapshot = path.join(process.cwd(), 'deploy-snapshot')
const url = process.env.TURSO_DATABASE_URL

if (!url || !existsSync(path.join(snapshot, 'content.sqlite'))) {
  log('No hosted database or no snapshot: nothing to import.')
  process.exit(0)
}

// 1. Database
const snapshotDb = createClient({ url: `file:${path.join(snapshot, 'content.sqlite')}` })
const versionFile = path.join(snapshot, 'version.txt')
const snapshotVersion = existsSync(versionFile) ? readFileSync(versionFile, 'utf8').trim() : 'unversioned'
const remote = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN })
const tables = await listTables(remote)
const count = async (table: string) =>
  tables.includes(table) ? Number((await remote.execute(`select count(*) as n from "${table}"`)).rows[0].n) : 0
const recordVersion = async () => {
  await remote.execute('create table if not exists hosted_import_meta (key text primary key, value text)')
  await remote.execute({
    sql: "insert into hosted_import_meta (key, value) values ('snapshot_version', ?) on conflict(key) do update set value = excluded.value",
    args: [snapshotVersion],
  })
}

if ((await count('companies')) === 0) {
  // Empty, or left half-done by an earlier failed import (tables but no rows): (re)import from scratch.
  log(`Database: ${tables.length ? 'incomplete' : 'empty'}, importing the content snapshot…`)
  await copyDatabase({ from: snapshotDb, to: remote, replace: true, log: (m: string) => log(`Database: ${m}`) })
  await recordVersion()
} else if (process.env.FREEZE_HOSTED_CONTENT === '1') {
  log('Database: FREEZE_HOSTED_CONTENT=1, content left as it is.')
} else {
  const current = tables.includes('hosted_import_meta')
    ? ((await remote.execute("select value from hosted_import_meta where key = 'snapshot_version'")).rows[0]?.value as string | undefined)
    : undefined
  if (current === snapshotVersion) {
    log(`Database: already at snapshot ${snapshotVersion}, skipped.`)
  } else {
    log(`Database: newer snapshot (${snapshotVersion}, was ${current ?? 'first import'}), refreshing content…`)
    await syncContent({ from: snapshotDb, to: remote, log: (m: string) => log(`Database: ${m}`) })
    await recordVersion()
  }
}

// 2. Images (media files live at the store root, where Payload's Blob adapter reads them): upload what's missing.
const token = process.env.BLOB_READ_WRITE_TOKEN
const uploads = path.join(snapshot, 'uploads')
if (!token) {
  log('Images: no BLOB_READ_WRITE_TOKEN, skipped.')
} else if (existsSync(uploads)) {
  const stored = new Set<string>()
  let cursor: string | undefined
  do {
    const page = await list({ token, cursor, limit: 1000 })
    page.blobs.forEach((b) => stored.add(b.pathname))
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)
  const missing = readdirSync(uploads).filter((f) => !f.startsWith('.') && !stored.has(f))
  const types: Record<string, string> = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' }
  try {
    for (const name of missing) {
      await put(name, readFileSync(path.join(uploads, name)), {
        access: 'public',
        token,
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: types[path.extname(name).toLowerCase()],
      })
    }
  } catch (err) {
    if (String(err).includes('private store')) {
      throw new Error(
        'The Vercel Blob store was created as Private. Payload needs a Public store: create a new Blob store with Access = Public and connect it to this project.',
      )
    }
    throw err
  }
  log(missing.length ? `Images: uploaded ${missing.length} new files.` : 'Images: all files already in Blob, skipped.')
}

// 3. Admin account (the snapshot has no user accounts). Created through Payload, so the password is hashed properly.
const payload = await getPayload({ config })
const users = await payload.count({ collection: 'users', overrideAccess: true })
if (users.totalDocs > 0) {
  log('Admin: user accounts already exist, skipped.')
} else {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@bharatxgroup.org'
  const password = crypto.randomBytes(12).toString('base64url')
  await payload.create({ collection: 'users', overrideAccess: true, data: { email, password, name: 'Site admin', role: 'admin' } })
  log('================================================================')
  log(`Admin login: ${email}  /  ${password}`)
  log('Sign in at /admin and change this password straight away.')
  log('================================================================')
}
process.exit(0)
