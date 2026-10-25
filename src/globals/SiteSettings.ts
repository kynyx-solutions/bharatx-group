import type { GlobalConfig } from 'payload'
import { hasRole } from '../lib/access'
import { pathways } from '../lib/options'
import { revalidateGlobal } from '../lib/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
    update: ({ req: { user } }) => hasRole(user, 'admin', 'approver'),
  },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text' },
                { name: 'whatsapp', label: 'WhatsApp number', type: 'text', admin: { description: 'Digits with country code, e.g. 919811263046' } },
                { name: 'email', type: 'email', admin: { description: 'Shown on the site and used when a pathway has no inbox.' } },
              ],
            },
            { name: 'officeAddress', type: 'textarea' },
            { name: 'mapUrl', label: 'Map link', type: 'text' },
            { name: 'hours', type: 'text', defaultValue: 'Monday to Saturday, 10:00 AM to 6:00 PM IST' },
            {
              name: 'socials',
              type: 'array',
              admin: { description: 'Only accounts that exist. Empty means no icons in the footer.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'network',
                      type: 'select',
                      required: true,
                      options: ['LinkedIn', 'Instagram', 'YouTube', 'X', 'Facebook'],
                    },
                    { name: 'url', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Enquiry inboxes',
          description: 'Where each contact-form pathway is delivered (FR-3).',
          fields: [
            {
              name: 'routing',
              type: 'group',
              fields: pathways.map((p) => ({
                name: p.value,
                label: `${p.label} (reply within ${p.reply})`,
                type: 'email' as const,
                admin: {
                  description:
                    p.value === 'business'
                      ? "Used when the visitor doesn't pick a company, or the company has no sales email."
                      : undefined,
                },
              })),
            },
          ],
        },
        {
          label: 'Corporate',
          fields: [
            {
              name: 'holdingCompany',
              type: 'group',
              admin: { description: 'Leave empty until the holding company is confirmed.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'legalName', type: 'text' },
                    { name: 'cin', label: 'CIN', type: 'text' },
                  ],
                },
                { name: 'registeredOffice', type: 'textarea' },
              ],
            },
            {
              name: 'fraudNotice',
              type: 'textarea',
              defaultValue:
                'BharatX Group never charges fees for jobs, interviews or vendor registration. If anyone asks you for money in our name, do not pay and write to us.',
            },
            {
              name: 'grievanceOfficer',
              type: 'group',
              admin: { description: 'Required in the privacy policy (DPDP Act 2023).' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text' },
                    { name: 'email', type: 'email' },
                    { name: 'phone', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
