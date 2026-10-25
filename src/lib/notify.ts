import type { Payload } from 'payload'
import { pathwayLabel, pathways } from './options'

type Settings = {
  email?: string | null
  routing?: Partial<Record<string, string | null>> | null
}

/**
 * FR-3: each pathway goes to its own inbox. A business enquiry about a company goes
 * to that company's sales inbox. Anything unrouted falls back to the group email.
 */
export async function inboxFor(payload: Payload, pathway: string, companyId?: number | string | null) {
  const settings = (await payload.findGlobal({ slug: 'site-settings', depth: 0 })) as Settings
  if (pathway === 'business' && companyId) {
    const company = await payload
      .findByID({ collection: 'companies', id: companyId, depth: 0, draft: false })
      .catch(() => null)
    if (company?.salesEmail) return company.salesEmail
  }
  return settings.routing?.[pathway] || settings.email || null
}

export const replyPromise = (pathway: string) =>
  pathways.find((p) => p.value === pathway)?.reply ?? '2 working days'

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export function enquiryEmail(e: {
  pathway: string
  name: string
  email: string
  phone?: string | null
  organisation?: string | null
  message: string
  companyName?: string | null
}) {
  const rows: [string, string | null | undefined][] = [
    ['Pathway', pathwayLabel(e.pathway)],
    ['Company', e.companyName],
    ['Name', e.name],
    ['Email', e.email],
    ['Phone', e.phone],
    ['Organisation', e.organisation],
  ]
  const table = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#464c57">${k}</td><td>${escape(v!)}</td></tr>`)
    .join('')
  return `<table>${table}</table><p style="white-space:pre-wrap">${escape(e.message)}</p>`
}
