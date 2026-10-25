import type { CollectionConfig } from 'payload'
import { loggedIn } from '../lib/access'

/** FR-7: CVs are stored privately, never in a public folder. Created only by the apply form. */
export const CvFiles: CollectionConfig = {
  slug: 'cv-files',
  labels: { singular: 'CV', plural: 'CVs' },
  admin: { group: 'Inbox', hidden: true },
  access: {
    read: loggedIn,
    create: () => false,
    update: () => false,
    delete: loggedIn,
  },
  fields: [],
  upload: {
    staticDir: 'private/cvs',
    mimeTypes: ['application/pdf'],
  },
}
