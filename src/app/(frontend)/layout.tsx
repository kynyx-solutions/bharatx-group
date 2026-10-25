import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import React from 'react'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getSettings, isNewsroomOpen } from '@/lib/data'
import { siteUrl } from '@/lib/format'
import './globals.css'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

const description =
  'BharatX Group is a New Delhi–based group of businesses in infrastructure, agri-exports, manufacturing, packaging, AI and venture building.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'BharatX Group — Building Businesses. Enabling Bharat.', template: '%s — BharatX Group' },
  description,
  applicationName: 'BharatX Group',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'BharatX Group',
    locale: 'en_IN',
    url: '/',
    description,
    images: [{ url: '/brand/og-image-1200x630.jpg', width: 1200, height: 630, alt: 'BharatX Group' }],
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = { themeColor: '#012247' }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, newsroomOpen] = await Promise.all([getSettings(), isNewsroomOpen()])
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BharatX Group',
    url: siteUrl,
    logo: `${siteUrl}/brand/bharatx-group-logo-640.webp`,
    ...(settings.email && { email: settings.email }),
    ...(settings.phone && { telephone: settings.phone }),
    ...(settings.officeAddress && {
      address: { '@type': 'PostalAddress', streetAddress: settings.officeAddress, addressCountry: 'IN' },
    }),
    ...(settings.socials?.length && { sameAs: settings.socials.map((s) => s.url) }),
  }

  return (
    <html lang="en-IN" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <SiteHeader showNews={newsroomOpen} />
        <main id="main">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, '\\u003c') }}
        />
      </body>
    </html>
  )
}
