import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/format'

export default function robots(): MetadataRoute.Robots {
  // Only the live domain is indexed; previews and staging stay out of search results.
  const isLive = siteUrl === 'https://bharatxgroup.org'
  return {
    rules: isLive ? { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] } : { userAgent: '*', disallow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
