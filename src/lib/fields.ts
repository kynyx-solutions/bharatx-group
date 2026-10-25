import type { Field } from 'payload'
import { slugify } from './slugify'

export const slugField = (from = 'name'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Part of the page URL. Filled from the name if left empty.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => (value ? slugify(value) : data?.[from] ? slugify(data[from]) : value),
    ],
  },
})

/**
 * Every claim on the site needs an owner, a date and a source (PRD section 6).
 * Only rows marked verified are shown to visitors.
 */
export const evidenceFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'asOf',
        label: 'As of',
        type: 'date',
        required: true,
        admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' } },
      },
      {
        name: 'verified',
        type: 'checkbox',
        defaultValue: false,
        admin: { description: 'Tick only when the source document is on file.' },
      },
    ],
  },
  {
    name: 'source',
    type: 'text',
    required: true,
    admin: { description: 'Where this comes from, e.g. "Sales ledger FY26, Finance team".' },
  },
  {
    name: 'sourceDocument',
    type: 'upload',
    relationTo: 'documents',
    admin: { description: 'Private copy of the supporting document. Never shown publicly.' },
  },
]

export const kpiArray = (
  name = 'kpis',
  label = 'Key numbers',
  description = 'Shown with an "as of" date. Unverified rows stay hidden.',
): Field => ({
  name,
  label,
  type: 'array',
  admin: { description },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'value', type: 'text', required: true, admin: { description: 'e.g. 2.5 lakh+' } },
        { name: 'label', type: 'text', required: true, admin: { description: 'e.g. castors shipped' } },
      ],
    },
    ...evidenceFields,
  ],
})
