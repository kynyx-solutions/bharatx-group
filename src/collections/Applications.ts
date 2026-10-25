import type { CollectionConfig } from 'payload'
import { loggedIn } from '../lib/access'
import { inboxFor } from '../lib/notify'

export const Applications: CollectionConfig = {
  slug: 'applications',
  labels: { singular: 'Application', plural: 'Applications' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['createdAt', 'job', 'name', 'email', 'emailStatus'],
    group: 'Inbox',
  },
  defaultSort: '-createdAt',
  access: {
    read: loggedIn,
    create: () => false,
    update: loggedIn,
    delete: loggedIn,
  },
  fields: [
    { name: 'job', type: 'relationship', relationTo: 'jobs', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'linkedin', type: 'text' },
    { name: 'note', type: 'textarea' },
    { name: 'cv', type: 'upload', relationTo: 'cv-files', required: true },
    {
      name: 'emailStatus',
      type: 'select',
      defaultValue: 'pending',
      options: ['pending', 'sent', 'failed', 'no-inbox', 'not-configured'],
      admin: { readOnly: true },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc
        const { payload } = req
        const jobId = typeof doc.job === 'object' ? doc.job.id : doc.job
        const job = await payload.findByID({ collection: 'jobs', id: jobId, depth: 0 }).catch(() => null)
        const to = await inboxFor(payload, 'careers')
        let emailStatus: 'sent' | 'failed' | 'no-inbox' | 'not-configured' = 'no-inbox'
        try {
          if (to) {
            await payload.sendEmail({
              to,
              replyTo: doc.email,
              subject: `[Careers] ${job?.title ?? 'Application'} — ${doc.name}`,
              html: `<p>New application for <b>${job?.title ?? ''}</b> from ${doc.name} (${doc.email}). Open it in the admin panel to download the CV.</p>`,
            })
          }
          await payload.sendEmail({
            to: doc.email,
            subject: 'Application received — BharatX Group',
            html: `<p>Dear ${doc.name},</p><p>Thank you for applying for ${job?.title ?? 'a role'} at BharatX Group. We have received your application and will contact you if your profile matches the role.</p><p>BharatX Group never charges fees for jobs or interviews.</p>`,
          })
          emailStatus = !to ? 'no-inbox' : process.env.RESEND_API_KEY ? 'sent' : 'not-configured'
        } catch (err) {
          payload.logger.error({ err, msg: `Application ${doc.id}: email failed` })
          emailStatus = 'failed'
        }
        await payload.update({ collection: 'applications', id: doc.id, data: { emailStatus }, req })
        return doc
      },
    ],
  },
}
