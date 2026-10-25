import type { Metadata } from 'next'
import Link from 'next/link'
import { MediaImage } from '@/components/MediaImage'
import { PageHero } from '@/components/ui'
import { asCompany, asMedia, getNews, getSettings, isNewsroomOpen } from '@/lib/data'
import { fullDate } from '@/lib/format'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Newsroom',
    description: 'Dated, verified news from BharatX Group and its businesses, and the media kit.',
    alternates: { canonical: '/news' },
    // Out of search results until the Newsroom has enough items to open (see isNewsroomOpen).
    ...(!(await isNewsroomOpen()) && { robots: { index: false } }),
  }
}

export default async function NewsPage() {
  const [news, settings] = await Promise.all([getNews(), getSettings()])

  return (
    <>
      <PageHero
        eyebrow="Newsroom"
        title="News from the Group."
        highlight="the Group."
        image="/placeholders/pages/news.webp"
        intro="Every item here is dated and backed by a source."
      />
      <div className="container-page grid gap-16 py-16 lg:grid-cols-12">
        <section className="lg:col-span-8" aria-label="News">
          {news.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line p-10 text-center text-slate">
              News will appear here soon.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {news.map((n) => {
                const img = asMedia(n.image)
                return (
                  <li key={n.id} className="relative grid gap-6 py-8 first:pt-0 sm:grid-cols-[200px_1fr]">
                    {img ? (
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand">
                        <MediaImage media={img} fill size="thumb" sizes="200px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="hidden sm:block" />
                    )}
                    <div>
                      <p className="text-sm text-slate">
                        <time dateTime={n.date}>{fullDate(n.date)}</time>
                        {asCompany(n.company) && ` · ${asCompany(n.company)!.name}`}
                      </p>
                      <h2 className="mt-2 text-2xl leading-snug">
                        <Link href={`/news/${n.slug}`} className="no-underline after:absolute after:inset-0 hover:underline">
                          {n.title}
                        </Link>
                      </h2>
                      <p className="mt-2 text-slate">{n.summary}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <aside className="lg:col-span-4" aria-labelledby="media-kit">
          <div className="rounded-2xl bg-sand p-6 sm:p-8">
            <h2 id="media-kit" className="text-xl">
              Media kit
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate">
              BharatX Group is a New Delhi–based group of businesses in infrastructure, agri-exports, manufacturing,
              packaging, AI and venture building.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              <li>
                <a href="/brand/bharatx-group-logo-640.webp" download className="text-blue underline decoration-blue/40 underline-offset-4 hover:decoration-blue">
                  Download logo (WebP)
                </a>
              </li>
              <li>
                <a href="/brand/og-image-1200x630.jpg" download className="text-blue underline decoration-blue/40 underline-offset-4 hover:decoration-blue">
                  Download banner image (JPG)
                </a>
              </li>
            </ul>
            <p className="mt-6 text-sm font-semibold">Press enquiries</p>
            <p className="text-sm text-slate">
              <Link href="/contact?pathway=media" className="text-blue underline decoration-blue/40 underline-offset-4 hover:decoration-blue">
                Contact our media team
              </Link>
              {settings.routing?.media && (
                <>
                  {' '}or write to{' '}
                  <a href={`mailto:${settings.routing.media}`} className="text-blue underline decoration-blue/40 underline-offset-4 hover:decoration-blue">
                    {settings.routing.media}
                  </a>
                </>
              )}
              .
            </p>
          </div>
        </aside>
      </div>
    </>
  )
}
