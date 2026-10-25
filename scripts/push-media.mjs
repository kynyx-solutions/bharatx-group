#!/usr/bin/env node
/**
 * Upload local uploads to Vercel Blob, at the paths Payload's Blob adapter reads from:
 *   media/<file>            → <file>
 *   private/documents/<f>   → private/documents/<f>
 *   private/cvs/<f>         → private/cvs/<f>
 *
 *   BLOB_READ_WRITE_TOKEN=… npm run push:media
 *   … npm run push:media -- --dry-run
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { put } from '@vercel/blob'

const token = process.env.BLOB_READ_WRITE_TOKEN
const dryRun = process.argv.includes('--dry-run')
if (!token && !dryRun) {
  console.error('Set BLOB_READ_WRITE_TOKEN. Tip: `vercel env pull .env.vercel` then load it.')
  process.exit(1)
}

const types = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.avif': 'image/avif', '.gif': 'image/gif' }
const sources = [
  ['media', ''],
  ['private/documents', 'private/documents/'],
  ['private/cvs', 'private/cvs/'],
]

let uploaded = 0
for (const [dir, prefix] of sources) {
  if (!existsSync(dir)) continue
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name)
    if (!statSync(file).isFile() || name.startsWith('.')) continue
    const pathname = prefix + name
    if (dryRun) {
      console.log('would upload', pathname)
    } else {
      await put(pathname, readFileSync(file), {
        access: 'public',
        token,
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: types[path.extname(name).toLowerCase()],
      })
      process.stdout.write('.')
    }
    uploaded++
  }
}
console.log(`\n${dryRun ? 'Would upload' : 'Uploaded'} ${uploaded} files.`)
