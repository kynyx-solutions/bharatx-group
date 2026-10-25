import type { MetadataRoute } from 'next'
import { getCompanies, getNews, getOpenJobs, getPartnerships, isNewsroomOpen } from '@/lib/data'
import { siteUrl } from '@/lib/format'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [companies, news, jobs, partnerships, newsroomOpen] = await Promise.all([
    getCompanies(),
    getNews(),
    getOpenJobs(),
    getPartnerships(),
    isNewsroomOpen(),
  ])
  const fixed = ['', '/about', '/businesses', '/leadership', '/partnerships', '/foundation', ...(newsroomOpen ? ['/news'] : []), '/careers', '/contact', '/corporate-information', '/privacy', '/terms']
  return [
    ...fixed.map((path) => ({ url: `${siteUrl}${path}` })),
    ...companies.map((c) => ({ url: `${siteUrl}/businesses/${c.slug}`, lastModified: c.updatedAt })),
    ...partnerships.map((p) => ({ url: `${siteUrl}/partnerships/${p.slug}`, lastModified: p.updatedAt })),
    ...news.map((n) => ({ url: `${siteUrl}/news/${n.slug}`, lastModified: n.updatedAt })),
    ...jobs.map((j) => ({ url: `${siteUrl}/careers/${j.slug}`, lastModified: j.updatedAt })),
  ]
}
