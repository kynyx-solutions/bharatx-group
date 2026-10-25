import type { CollectionConfig } from 'payload'
import { adminFieldOnly, adminOnly, hasRole, loggedIn } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Admin',
  },
  auth: true,
  access: {
    read: loggedIn,
    create: adminOnly,
    delete: adminOnly,
    update: ({ req: { user }, id }) => hasRole(user, 'admin') || user?.id === id,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      access: { update: adminFieldOnly },
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Approver (can publish)', value: 'approver' },
        { label: 'Editor (drafts only)', value: 'editor' },
      ],
    },
  ],
}
