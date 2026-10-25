import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Pages are statically generated; refresh them when editors publish.
 * revalidatePath only exists inside the Next.js runtime, so scripts (seed) skip it.
 */
const refreshSite = async () => {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    // Not running inside Next.js (e.g. `payload run`); nothing to refresh.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ doc, context }) => {
  if (!context.skipRevalidate) await refreshSite()
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ doc, context }) => {
  if (!context.skipRevalidate) await refreshSite()
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc, context }) => {
  if (!context.skipRevalidate) await refreshSite()
  return doc
}
