import type { Access, CollectionBeforeChangeHook, FieldAccess } from 'payload'

export type Role = 'admin' | 'approver' | 'editor'

type MaybeUser = { role?: Role | null } | null | undefined

export const hasRole = (user: MaybeUser, ...roles: Role[]) =>
  Boolean(user?.role && roles.includes(user.role))

export const anyone: Access = () => true
export const loggedIn: Access = ({ req: { user } }) => Boolean(user)
export const adminOnly: Access = ({ req: { user } }) => hasRole(user as MaybeUser, 'admin')
export const adminFieldOnly: FieldAccess = ({ req: { user } }) =>
  hasRole(user as MaybeUser, 'admin')

/** Public visitors see published documents only; signed-in staff see drafts too. */
export const publishedOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}

/**
 * FR-11: Editors draft, Approvers publish.
 * An editor's attempt to publish is saved as a draft instead.
 * Server code with no signed-in user (seed scripts) is trusted.
 */
export const onlyApproversPublish: CollectionBeforeChangeHook = ({ data, req }) => {
  if (req.user && data?._status === 'published' && !hasRole(req.user as MaybeUser, 'admin', 'approver')) {
    return { ...data, _status: 'draft' }
  }
  return data
}
