/**
 * Content import on Vercel, run before `next build` (see scripts/prebuild.mjs). Three independent steps, each
 * done only when needed, so it is safe on every build and never overwrites admin edits:
 *   1. Database: if the hosted database (Turso) has no content, load deploy-snapshot/content.sqlite.
 *   2. Images:   if the Vercel Blob store is empty, upload deploy-snapshot/uploads/.
 *   3. Admin:    if there are no user accounts, create an admin with a random password, printed once in the build log.
 */
import crypto from 'crypto'
import { existsSync, readdirSync, readFileSync } from 'fs'
import path from 'path'
import { createClient } from '@libsql/client'
import { list, put } from '@vercel/blob'
import { getPayload } from 'payload'
import { copyDatabase, listTables } from '../../scripts/lib/copy-db.mjs'
import config from '../payload.config'

const log = (m: string) => console.log(`[hosted-import] ${m}`)
const snapshot = path.join(process.cwd(), 'deploy-snapshot')
const url = process.env.TURSO_DATABASE_URL

if (!url || !existsSync(path.join(snapshot, 'content.sqlite'))) {
  log('No hosted database or no snapshot: nothing to import.')
  process.exit(0)
}

// 1. Database
const remote = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN })
const tables = await listTables(remote)
const count = async (table: string) =>
  tables.includes(table) ? Number((await remote.execute(`select count(*) as n from "${table}"`)).rows[0].n) : 0
if ((await count('companies')) > 0) {
  log('Database: already has content, skipped.')
} else {
  // Empty, or left half-done by an earlier failed import (tables but no rows): (re)import from scratch.
  log(`Database: ${tables.length ? 'incomplete' : 'empty'}, importing the content snapshot…`)
  await copyDatabase({
    from: createClient({ url: `file:${path.join(snapshot, 'content.sqlite')}` }),
    to: remote,
    replace: true,
    log: (m: string) => log(`Database: ${m}`),
  })
}

// 2. Images (media files live at the store root, where Payload's Blob adapter reads them)
const token = process.env.BLOB_READ_WRITE_TOKEN
const uploads = path.join(snapshot, 'uploads')
if (!token) {
  log('Images: no BLOB_READ_WRITE_TOKEN, skipped.')
} else if ((await list({ token, limit: 1 })).blobs.length > 0) {
  log('Images: the Blob store already has files, skipped.')
} else if (existsSync(uploads)) {
  const files = readdirSync(uploads).filter((f) => !f.startsWith('.'))
  const types: Record<string, string> = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' }
  try {
    for (const name of files) {
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
  log(`Images: uploaded ${files.length} files.`)
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
