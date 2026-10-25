import type { CollectionConfig } from 'payload'
import { loggedIn, onlyApproversPublish, publishedOrLoggedIn } from '../lib/access'
import { slugField } from '../lib/fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../lib/revalidate'

export const People: CollectionConfig = {
  slug: 'people',
  labels: { singular: 'Person', plural: 'Leadership' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'team', '_status'],
    group: 'Content',
  },
  defaultSort: 'order',
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
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    {
      name: 'shortBio',
      type: 'textarea',
      required: true,
      admin: { description: 'Two lines, shown on cards.' },
    },
    { name: 'bio', type: 'textarea', admin: { description: 'Full bio for the Leadership page.' } },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Square head-and-shoulders, at least 800 × 800 px.' },
    },
    { name: 'linkedin', type: 'text' },
    {
      name: 'otherRoles',
      type: 'array',
      fields: [{ name: 'role', type: 'text', required: true }],
    },
    slugField(),
    {
      name: 'team',
      type: 'select',
      required: true,
      defaultValue: 'group',
      options: [
        { label: 'Group leadership', value: 'group' },
        { label: 'Company leadership', value: 'company' },
        { label: 'Foundation', value: 'foundation' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'company', type: 'relationship', relationTo: 'companies', admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', defaultValue: 100, admin: { position: 'sidebar' } },
  ],
}
