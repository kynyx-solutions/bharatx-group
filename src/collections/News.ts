import type { CollectionConfig } from 'payload'
import { loggedIn, onlyApproversPublish, publishedOrLoggedIn } from '../lib/access'
import { slugField } from '../lib/fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../lib/revalidate'

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News item', plural: 'News' },
  admin: {
    useAsTitle: 'title',
    description: 'The Newsroom appears in the site menu once 3 items are published.',
    defaultColumns: ['title', 'date', 'company', '_status'],
    group: 'Content',
  },
  defaultSort: '-date',
  versions: { drafts: true },
  access: {
    read: publishedOrLoggedIn,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  hooks: {
    beforeChange: [onlyApproversPublish],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'summary', type: 'textarea', required: true, admin: { description: 'One or two sentences.' } },
    { name: 'body', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'sourceUrl',
      label: 'Source link',
      type: 'text',
      admin: { description: 'Press coverage, filing or post that backs this item.' },
    },
    {
      name: 'sourceNote',
      type: 'text',
      required: true,
      admin: { description: 'Who confirmed it and how, e.g. "Order letter from NHAI, on file".' },
    },
    slugField('title'),
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
    },
    { name: 'company', type: 'relationship', relationTo: 'companies', admin: { position: 'sidebar' } },
  ],
}
