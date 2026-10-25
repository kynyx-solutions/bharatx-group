import type { CollectionConfig } from 'payload'
import { loggedIn, onlyApproversPublish, publishedOrLoggedIn } from '../lib/access'
import { slugField } from '../lib/fields'
import { jobTypes } from '../lib/options'
import { revalidateAfterChange, revalidateAfterDelete } from '../lib/revalidate'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  labels: { singular: 'Job', plural: 'Jobs' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'company', 'location', 'closingDate', '_status'],
    group: 'Content',
  },
  defaultSort: 'closingDate',
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
    { name: 'summary', type: 'textarea', required: true },
    { name: 'description', type: 'richText', required: true },
    {
      type: 'row',
      fields: [
        { name: 'location', type: 'text', required: true },
        { name: 'type', type: 'select', required: true, defaultValue: 'full-time', options: [...jobTypes] },
      ],
    },
    slugField('title'),
    { name: 'company', type: 'relationship', relationTo: 'companies', admin: { position: 'sidebar' } },
    {
      name: 'closingDate',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'The listing hides itself after this date.',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
      },
    },
  ],
}
