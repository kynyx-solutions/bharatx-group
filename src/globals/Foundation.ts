import type { GlobalConfig } from 'payload'
import { hasRole } from '../lib/access'
import { kpiArray } from '../lib/fields'
import { foundationAreas } from '../lib/options'
import { revalidateGlobal } from '../lib/revalidate'

export const Foundation: GlobalConfig = {
  slug: 'foundation',
  label: 'BharatX Labs Foundation',
  admin: { group: 'Content' },
  access: {
    read: () => true,
    update: ({ req: { user } }) => hasRole(user, 'admin', 'approver'),
  },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: 'name', type: 'text', required: true, defaultValue: 'BharatX Labs Foundation' },
    { name: 'intro', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'cin', label: 'CIN', type: 'text' },
        { name: 'registration', type: 'text', admin: { description: 'e.g. Section 8 licence no., 12A, 80G' } },
      ],
    },
    { name: 'registeredOffice', type: 'textarea' },
    { name: 'contactEmail', type: 'email' },
    {
      name: 'programmes',
      type: 'array',
      admin: { description: 'Programmes running now. Each needs a start date and, ideally, a photo.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'area', type: 'select', required: true, options: [...foundationAreas] },
          ],
        },
        { name: 'description', type: 'textarea', required: true },
        {
          type: 'row',
          fields: [
            { name: 'location', type: 'text' },
            { name: 'since', type: 'date', admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' } } },
          ],
        },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    kpiArray('figures', 'Foundation in numbers'),
    {
      name: 'partners',
      type: 'array',
      admin: { description: 'Only partners who agreed to be named.' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'logo', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
