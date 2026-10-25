import type { CollectionConfig } from 'payload'
import { loggedIn } from '../lib/access'
import { enquiryEmail, inboxFor, replyPromise } from '../lib/notify'
import { pathways } from '../lib/options'

const csvCell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: { singular: 'Enquiry', plural: 'Enquiries' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['createdAt', 'pathway', 'company', 'name', 'deliveredTo', 'emailStatus'],
    group: 'Inbox',
    description: 'Every form submission is saved here first (FR-2). Export: /api/enquiries/export.csv',
  },
  defaultSort: '-createdAt',
  access: {
    read: loggedIn,
    // Created by the contact form's server action only (with overrideAccess).
    create: () => false,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [
    { name: 'pathway', type: 'select', required: true, options: pathways.map(({ label, value }) => ({ label, value })) },
    { name: 'company', type: 'relationship', relationTo: 'companies' },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'organisation', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    { name: 'pageUrl', type: 'text', admin: { readOnly: true } },
    {
      type: 'row',
      fields: [
        { name: 'deliveredTo', type: 'text', admin: { readOnly: true } },
        {
          name: 'emailStatus',
          type: 'select',
          defaultValue: 'pending',
          options: ['pending', 'sent', 'failed', 'no-inbox', 'not-configured'],
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: 'handled',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Tick once someone has replied.' },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc
        const { payload } = req
        const companyId = typeof doc.company === 'object' ? doc.company?.id : doc.company
        const company = companyId
          ? await payload.findByID({ collection: 'companies', id: companyId, depth: 0 }).catch(() => null)
          : null
        const to = await inboxFor(payload, doc.pathway, companyId)
        let emailStatus: 'sent' | 'failed' | 'no-inbox' | 'not-configured' = 'no-inbox'
        if (to) {
          try {
            await payload.sendEmail({
              to,
              replyTo: doc.email,
              subject: `[bharatxgroup.org] ${company?.name ? company.name + ' — ' : ''}${doc.name}`,
              html: enquiryEmail({ ...doc, companyName: company?.name }),
            })
            await payload.sendEmail({
              to: doc.email,
              subject: 'We have received your message — BharatX Group',
              html: `<p>Dear ${doc.name},</p><p>Thank you for writing to BharatX Group. Your message has reached the right team, and we aim to reply within ${replyPromise(doc.pathway)}.</p><p>BharatX Group</p>`,
            })
            // Without RESEND_API_KEY, Payload only logs emails to the console.
            emailStatus = process.env.RESEND_API_KEY ? 'sent' : 'not-configured'
          } catch (err) {
            payload.logger.error({ err, msg: `Enquiry ${doc.id}: email failed` })
            emailStatus = 'failed'
          }
        }
        await payload.update({
          collection: 'enquiries',
          id: doc.id,
          data: { deliveredTo: to ?? '', emailStatus },
          req,
        })
        return doc
      },
    ],
  },
  endpoints: [
    {
      // FR-14: admin export of enquiries to CSV
      path: '/export.csv',
      method: 'get',
      handler: async (req) => {
        if (!req.user) return Response.json({ error: 'Sign in first' }, { status: 401 })
        const { docs } = await req.payload.find({
          collection: 'enquiries',
          limit: 0,
          depth: 1,
          sort: '-createdAt',
          req,
        })
        const header = ['Date', 'Pathway', 'Company', 'Name', 'Email', 'Phone', 'Organisation', 'Message', 'Delivered to', 'Email status', 'Handled']
        const lines = docs.map((d) =>
          [
            d.createdAt,
            d.pathway,
            typeof d.company === 'object' ? d.company?.name : '',
            d.name,
            d.email,
            d.phone,
            d.organisation,
            d.message,
            d.deliveredTo,
            d.emailStatus,
            d.handled ? 'yes' : 'no',
          ]
            .map(csvCell)
            .join(','),
        )
        return new Response([header.map(csvCell).join(','), ...lines].join('\n'), {
          headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': `attachment; filename="enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
          },
        })
      },
    },
  ],
}
