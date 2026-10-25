import type { CollectionConfig } from 'payload'
import { loggedIn, onlyApproversPublish, publishedOrLoggedIn } from '../lib/access'
import { evidenceFields, kpiArray, slugField } from '../lib/fields'
import { sectors } from '../lib/options'
import { revalidateAfterChange, revalidateAfterDelete } from '../lib/revalidate'

export const Companies: CollectionConfig = {
  slug: 'companies',
  labels: { singular: 'Company', plural: 'Companies' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sector', 'relationship', '_status'],
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
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            { name: 'name', type: 'text', required: true },
            {
              name: 'tagline',
              type: 'text',
              required: true,
              admin: { description: 'One line in plain words: what it makes and for whom.' },
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              admin: { description: 'One paragraph a Class 10 student can read.' },
            },
            {
              name: 'offerings',
              label: 'What it offers',
              type: 'array',
              fields: [{ name: 'item', type: 'text', required: true }],
            },
            {
              name: 'customers',
              label: 'Who it serves',
              type: 'textarea',
            },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: { description: 'Real photos: site, factory, product, team.' },
            },
          ],
        },
        {
          label: 'Numbers and proof',
          fields: [
            kpiArray(),
            {
              name: 'certifications',
              type: 'array',
              admin: { description: 'ISO, APEDA, FSSAI, IEC. Unverified rows stay hidden.' },
              fields: [{ name: 'name', type: 'text', required: true }, ...evidenceFields],
            },
          ],
        },
        {
          label: 'Legal and contact',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'legalName', type: 'text' },
                { name: 'cin', label: 'CIN', type: 'text' },
                { name: 'gst', label: 'GSTIN', type: 'text' },
              ],
            },
            { name: 'registeredOffice', type: 'textarea' },
            { name: 'operatingAddress', type: 'textarea' },
            {
              type: 'row',
              fields: [
                { name: 'salesEmail', type: 'email', admin: { description: 'Quote requests go here.' } },
                { name: 'salesPhone', type: 'text' },
                { name: 'whatsapp', label: 'WhatsApp number', type: 'text', admin: { description: 'Digits with country code, e.g. 919811263046' } },
              ],
            },
            { name: 'website', type: 'text' },
          ],
        },
      ],
    },
    slugField(),
    {
      name: 'sector',
      type: 'select',
      required: true,
      options: [...sectors],
      admin: { position: 'sidebar' },
    },
    {
      name: 'relationship',
      label: 'Relationship to the group',
      type: 'select',
      defaultValue: 'to-confirm',
      options: [
        { label: 'Subsidiary', value: 'subsidiary' },
        { label: 'Group brand', value: 'brand' },
        { label: 'Partner company', value: 'partner' },
        { label: 'To confirm', value: 'to-confirm' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'since', type: 'number', admin: { position: 'sidebar', description: 'Year it started operating.' } },
    { name: 'order', type: 'number', defaultValue: 100, admin: { position: 'sidebar' } },
  ],
}
