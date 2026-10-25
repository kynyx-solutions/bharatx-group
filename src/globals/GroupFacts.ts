import type { GlobalConfig } from 'payload'
import { hasRole } from '../lib/access'
import { kpiArray } from '../lib/fields'
import { revalidateGlobal } from '../lib/revalidate'

export const GroupFacts: GlobalConfig = {
  slug: 'group-facts',
  label: 'Group numbers and milestones',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
    update: ({ req: { user } }) => hasRole(user, 'admin', 'approver'),
  },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    kpiArray(
      'figures',
      'Group in numbers',
      'Home page "Group in numbers". Only verified rows are shown; with none, the section is hidden.',
    ),
    {
      name: 'milestones',
      type: 'array',
      admin: { description: 'About page timeline. Real, dated events only. Only the year is shown, so a known year is enough.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'date', type: 'date', required: true, admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' } } },
            { name: 'title', type: 'text', required: true },
          ],
        },
        { name: 'detail', type: 'textarea' },
        { name: 'company', type: 'relationship', relationTo: 'companies' },
        { name: 'source', type: 'text', required: true, admin: { description: 'e.g. "Certificate of incorporation (MCA)".' } },
      ],
    },
  ],
}
