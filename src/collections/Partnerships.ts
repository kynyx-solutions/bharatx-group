import type { CollectionConfig } from 'payload'
import { loggedIn, onlyApproversPublish, publishedOrLoggedIn } from '../lib/access'
import { slugField } from '../lib/fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../lib/revalidate'

export const partnershipKinds = [
  'MoU',
  'Collaboration',
  'Workshop',
  'Programme',
  'Recognition',
] as const

/** MoUs, collaborations and workshops, each with its own page at /partnerships/{slug}. */
export const Partnerships: CollectionConfig = {
  slug: 'partnerships',
  labels: { singular: 'Partnership or programme', plural: 'Partnerships & programmes' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'partner', 'date', '_status'],
    group: 'Content',
    description:
      'Each item gets a card on the home page and its own page. Name partners as fact; show their logos only with written permission.',
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
          label: 'Details',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: { description: 'e.g. "MoU with IIT Delhi"' },
            },
            {
              type: 'row',
              fields: [
                { name: 'kind', type: 'select', required: true, options: [...partnershipKinds] },
                {
                  name: 'partner',
                  type: 'text',
                  required: true,
                  admin: { description: 'Shown large on the card, e.g. "IIT Delhi"' },
                },
              ],
            },
            {
              name: 'summary',
              type: 'textarea',
              required: true,
              admin: { description: 'One or two sentences for the card and search results.' },
            },
            {
              name: 'body',
              type: 'richText',
              admin: {
                description:
                  'The full story: purpose, what happened, who took part, what comes next.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'date',
                  type: 'date',
                  admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
                },
                { name: 'location', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Photos',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'logo',
                  label: 'Partner logo',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'The partner’s official logo, as published on its own website.',
                  },
                },
                {
                  name: 'logoPermission',
                  label: 'Written permission to show the logo',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description:
                      'Tick once the partner has agreed in writing. Keep the email or letter in Evidence.',
                  },
                },
              ],
            },
            {
              name: 'cover',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Main photo, shown at the top of the page.' },
            },
            {
              name: 'gallery',
              label: 'Event photos',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: { description: 'Only with consent from the people shown.' },
            },
            {
              name: 'documentImages',
              label: 'MoU or certificate images',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: {
                description:
                  'Signing photo or the first page only, with the partner’s permission. Never pages with terms or signatures; the full copy goes in "Evidence".',
              },
            },
          ],
        },
        {
          label: 'Evidence',
          fields: [
            {
              name: 'source',
              type: 'text',
              required: true,
              admin: {
                description: 'Who confirmed it, e.g. "MoU signed 12 Mar 2026, copy on file".',
              },
            },
            {
              name: 'evidence',
              type: 'upload',
              relationTo: 'documents',
              admin: { description: 'Full MoU copy or letter. Private: never shown on the site.' },
            },
          ],
        },
      ],
    },
    slugField('title'),
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Lower numbers show first.' },
    },
  ],
}
