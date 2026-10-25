import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { resendAdapter } from '@payloadcms/email-resend'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Applications } from './collections/Applications'
import { Companies } from './collections/Companies'
import { CvFiles } from './collections/CvFiles'
import { Documents } from './collections/Documents'
import { Enquiries } from './collections/Enquiries'
import { Jobs } from './collections/Jobs'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { Partnerships } from './collections/Partnerships'
import { People } from './collections/People'
import { Users } from './collections/Users'
import { Foundation } from './globals/Foundation'
import { GroupFacts } from './globals/GroupFacts'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Without a Resend key, Payload logs emails to the console instead of sending them.
const email = process.env.RESEND_API_KEY
  ? resendAdapter({
      apiKey: process.env.RESEND_API_KEY,
      defaultFromAddress: process.env.EMAIL_FROM?.match(/<(.+)>/)?.[1] ?? 'no-reply@bharatxgroup.org',
      defaultFromName: 'BharatX Group',
    })
  : undefined

export default buildConfig({
  // Unset = the admin and API use relative URLs and work on any host (localhost, a preview tunnel).
  // Set PAYLOAD_SERVER_URL in production (e.g. https://bharatxgroup.org).
  serverURL: process.env.PAYLOAD_SERVER_URL || undefined,
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' — BharatX Group admin' },
    // Built-in avatar: no request to Gravatar (blocked by our Content Security Policy anyway).
    avatar: 'default',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Companies, Partnerships, People, News, Jobs, Media, Enquiries, Applications, CvFiles, Documents, Users],
  globals: [SiteSettings, GroupFacts, Foundation],
  editor: lexicalEditor(),
  email,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Local: a SQLite file. Hosted (Vercel): Turso, the same SQLite engine over the network.
  db: sqliteAdapter({
    client: {
      url: process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || '',
      authToken: process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  sharp,
  plugins: [
    // Hosted: uploads live in Vercel Blob (the server's disk is not kept). Without the token, files stay on local disk.
    // alwaysInsertFields keeps the database schema identical with and without Blob, so the local database can be copied up.
    // Files are still served through Payload's /api/<collection>/file/ routes, so access rules apply.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      token: process.env.BLOB_READ_WRITE_TOKEN,
      alwaysInsertFields: true,
      collections: {
        media: true,
        documents: { prefix: 'private/documents' },
        'cv-files': { prefix: 'private/cvs' },
      },
    }),
  ],
})
