import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '../lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content', defaultColumns: ['filename', 'alt', 'placeholder'] },
  access: {
    read: anyone,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [
    { name: 'alt', type: 'text', required: true, admin: { description: 'Describe the image for screen readers.' } },
    { name: 'credit', type: 'text', admin: { description: 'Photographer or owner of the image.' } },
    {
      name: 'placeholder',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'AI or stock image used during the build. Replace before launch.' },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumb', width: 480 },
      { name: 'card', width: 960 },
      { name: 'hero', width: 1920 },
    ],
    adminThumbnail: 'thumb',
    formatOptions: { format: 'webp', options: { quality: 80 } },
  },
}
