/**
 * One-time import on Vercel, run before `next build` (see scripts/prebuild.mjs).
 * If the hosted database (Turso) is empty, it loads deploy-snapshot/ into it, uploads the images to Vercel Blob,
 * and creates an admin account with a random password, printed once in the build log.
 * If the database already has content, it does nothing, so later builds never overwrite admin edits.
 */
import crypto from 'crypto'
import { existsSync, readdirSync, readFileSync } from 'fs'
import path from 'path'
import { createClient } from '@libsql/client'
import { put } from '@vercel/blob'
import { getPayload } from 'payload'
import { copyDatabase, listTables } from '../../scripts/lib/copy-db.mjs'
import config from '../payload.config'

const snapshot = path.join(process.cwd(), 'deploy-snapshot')
const url = process.env.TURSO_DATABASE_URL

if (!url || !existsSync(path.join(snapshot, 'content.sqlite'))) {
  console.log('[hosted-import] No hosted database or no snapshot: nothing to import.')
  process.exit(0)
}

const remote = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN })
const tables = await listTables(remote)
const companies = tables.includes('companies')
  ? Number((await remote.execute('select count(*) as n from "companies"')).rows[0].n)
  : 0
if (companies > 0) {
  console.log('[hosted-import] The hosted database already has content: skipping the import.')
  process.exit(0)
}

// Empty, or left half-done by an earlier failed import (tables but no rows): (re)import from scratch.
console.log(`[hosted-import] ${tables.length ? 'Incomplete' : 'Empty'} hosted database: importing the content snapshot…`)
await copyDatabase({
  from: createClient({ url: `file:${path.join(snapshot, 'content.sqlite')}` }),
  to: remote,
  replace: true,
  log: (m: string) => console.log(`[hosted-import] ${m}`),
})

// Images: same paths Payload's Blob adapter reads from (media files live at the store root).
const token = process.env.BLOB_READ_WRITE_TOKEN
const uploads = path.join(snapshot, 'uploads')
if (token && existsSync(uploads)) {
  const files = readdirSync(uploads).filter((f) => !f.startsWith('.'))
  for (const name of files) {
    const ext = path.extname(name).toLowerCase()
    const contentType = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' }[ext]
    await put(name, readFileSync(path.join(uploads, name)), { access: 'public', token, addRandomSuffix: false, allowOverwrite: true, contentType })
  }
  console.log(`[hosted-import] Uploaded ${files.length} images to Vercel Blob.`)
} else {
  console.log('[hosted-import] No BLOB_READ_WRITE_TOKEN: images not uploaded.')
}

// The snapshot has no user accounts: create the first admin through Payload (so the password is hashed properly).
const payload = await getPayload({ config })
const email = process.env.SEED_ADMIN_EMAIL || 'admin@bharatxgroup.org'
const password = crypto.randomBytes(12).toString('base64url')
await payload.create({
  collection: 'users',
  overrideAccess: true,
  data: { email, password, name: 'Site admin', role: 'admin' },
})
console.log('[hosted-import] ================================================================')
console.log(`[hosted-import] Admin login: ${email}  /  ${password}`)
console.log('[hosted-import] Sign in at /admin and change this password straight away.')
console.log('[hosted-import] ================================================================')
process.exit(0)
