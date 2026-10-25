import 'server-only'
import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import type { Company, Foundation, GroupFact, Job, Media, News, Partnership, Person, SiteSetting } from '@/payload-types'

export const payload = cache(async () => getPayload({ config }))

type Evidence = { verified?: boolean | null }
/** Only claims marked verified reach visitors (PRD section 6). */
export const verifiedOnly = <T extends Evidence>(rows?: T[] | null) => (rows ?? []).filter((r) => r.verified)

export const getSettings = cache(async () =>
  (await payload()).findGlobal({ slug: 'site-settings', depth: 0 }) as Promise<SiteSetting>,
)

export const getGroupFacts = cache(async () =>
  (await payload()).findGlobal({ slug: 'group-facts', depth: 1 }) as Promise<GroupFact>,
)

export const getFoundation = cache(async () =>
  (await payload()).findGlobal({ slug: 'foundation', depth: 1 }) as Promise<Foundation>,
)

export const getCompanies = cache(async () => {
  const res = await (await payload()).find({
    collection: 'companies',
    depth: 1,
    limit: 50,
    sort: 'order',
    where: { _status: { equals: 'published' } },
  })
  return res.docs as Company[]
})

export const getCompany = cache(async (slug: string) => {
  const res = await (await payload()).find({
    collection: 'companies',
    depth: 1,
    limit: 1,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  return (res.docs[0] as Company | undefined) ?? null
})

export const getPartnerships = cache(async () => {
  const res = await (await payload()).find({
    collection: 'partnerships',
    depth: 1,
    limit: 100,
    sort: 'order',
    where: { _status: { equals: 'published' } },
  })
  return res.docs as Partnership[]
})

export const getPartnership = cache(async (slug: string) => {
  const res = await (await payload()).find({
    collection: 'partnerships',
    depth: 1,
    limit: 1,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  return (res.docs[0] as Partnership | undefined) ?? null
})

export const getPeople = cache(async () => {
  const res = await (await payload()).find({
    collection: 'people',
    depth: 1,
    limit: 100,
    sort: 'order',
    where: { _status: { equals: 'published' } },
  })
  return res.docs as Person[]
})

export const getNews = cache(async (limit = 50) => {
  const res = await (await payload()).find({
    collection: 'news',
    depth: 1,
    limit,
    sort: '-date',
    where: { _status: { equals: 'published' } },
  })
  return res.docs as News[]
})

/** PRD section 6: launch with at least three verifiable news items; until then Newsroom stays out of menus. */
export const NEWSROOM_MIN_ITEMS = 3

export const isNewsroomOpen = cache(async () => {
  const { totalDocs } = await (await payload()).count({
    collection: 'news',
    where: { _status: { equals: 'published' } },
  })
  return totalDocs >= NEWSROOM_MIN_ITEMS
})

export const getNewsItem = cache(async (slug: string) => {
  const res = await (await payload()).find({
    collection: 'news',
    depth: 1,
    limit: 1,
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
  })
  return (res.docs[0] as News | undefined) ?? null
})

/** FR-8: listings past their closing date hide automatically. */
const openJobsWhere = () => ({
  _status: { equals: 'published' },
  closingDate: { greater_than_equal: new Date(new Date().setHours(0, 0, 0, 0)).toISOString() },
})

export const getOpenJobs = cache(async () => {
  const res = await (await payload()).find({
    collection: 'jobs',
    depth: 1,
    limit: 100,
    sort: 'closingDate',
    where: openJobsWhere(),
  })
  return res.docs as Job[]
})

export const getJob = cache(async (slug: string) => {
  const res = await (await payload()).find({
    collection: 'jobs',
    depth: 1,
    limit: 1,
    where: { slug: { equals: slug }, ...openJobsWhere() },
  })
  return (res.docs[0] as Job | undefined) ?? null
})

export const asMedia = (m: number | Media | null | undefined) => (m && typeof m === 'object' ? m : null)
export const asCompany = (c: number | Company | null | undefined) => (c && typeof c === 'object' ? c : null)
