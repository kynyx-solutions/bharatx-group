import type { CollectionConfig } from 'payload'
import { loggedIn } from '../lib/access'

/** Private evidence files: certificates, reports and ledgers that back a claim. */
export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: { group: 'Admin', description: 'Private. Only signed-in staff can open these files.' },
  access: {
    read: loggedIn,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [{ name: 'title', type: 'text', required: true }],
  upload: {
    staticDir: 'private/documents',
    mimeTypes: ['application/pdf', 'image/*'],
  },
}
