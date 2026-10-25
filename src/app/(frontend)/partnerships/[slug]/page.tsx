import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Credentials, kindStyle } from '@/components/Credentials'
import { Gallery, type GalleryImage } from '@/components/Gallery'
import { MediaImage } from '@/components/MediaImage'
import { ArrowIcon, ButtonLink, PageHero } from '@/components/ui'
import { asCompany, asMedia, getPartnership, getPartnerships } from '@/lib/data'
import { fullDate } from '@/lib/format'
import type { Media } from '@/payload-types'

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

const path = (url?: string | null) => (url ?? '').replace(/^https?:\/\/[^/]+/, '')

const toGallery = (items: (number | Media)[] | null | undefined): GalleryImage[] =>
  (items ?? [])
    .map(asMedia)
    .filter((m): m is Media => Boolean(m?.url))
    .map((m) => ({
      src: path(m.sizes?.card?.url || m.url),
      full: path(m.sizes?.hero?.url || m.url),
      alt: m.alt,
      width: m.sizes?.hero?.width || m.width || 1600,
      height: m.sizes?.hero?.height || m.height || 1200,
      credit: m.credit,
    }))

export async function generateStaticParams() {
  return (await getPartnerships()).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getPartnership((await params).slug)
  if (!item) return {}
  const cover = asMedia(item.cover)
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: `/partnerships/${item.slug}` },
    openGraph: cover?.url
      ? { images: [{ url: path(cover.sizes?.hero?.url || cover.url) }] }
      : undefined,
  }
}

export default async function PartnershipPage({ params }: Props) {
  const item = await getPartnership((await params).slug)
  if (!item) notFound()

  const all = await getPartnerships()
  // One full row of related items; the sidebar already has the call to action.
  const others = all.filter((p) => p.id !== item.id).slice(0, 3)
  const logo = asMedia(item.logo)
  const cover = asMedia(item.cover)
  const company = asCompany(item.company)
  const photos = toGallery(item.gallery)
  const documents = toGallery(item.documentImages)
  const hasMain = Boolean(item.body) || photos.length > 0 || documents.length > 0

  const facts: [string, React.ReactNode][] = [
    ['Partner', item.partner],
    ['Type', item.kind],
    ...(item.date ? [['Date', fullDate(item.date)] as [string, string]] : []),
    ...(item.location ? [['Where', item.location] as [string, string]] : []),
    ...(company
      ? [
          [
            'With',
            <Link
              key="c"
              href={`/businesses/${company.slug}`}
              className="text-blue underline decoration-blue/40 underline-offset-4"
            >
              {company.name}
            </Link>,
          ] as [string, React.ReactNode],
        ]
      : []),
  ]

  return (
    <>
      <PageHero
        eyebrow={`Partnerships and programmes · ${item.kind}`}
        title={item.title}
        highlight={item.partner}
        intro={item.summary}
        image={cover ? path(cover.sizes?.hero?.url || cover.url) : undefined}
      />

      <div className={`container-page grid gap-12 py-16 ${hasMain ? 'lg:grid-cols-12' : ''}`}>
        {hasMain && (
          <div className="space-y-14 lg:col-span-8">
            {item.body && <RichText data={item.body} className="prose-bx" />}

            {photos.length > 0 && (
              <section aria-labelledby="photos-heading">
                <h2 id="photos-heading" className="mb-6 text-3xl">
                  Photos
                </h2>
                <Gallery images={photos} label={`${item.title}: photos`} />
              </section>
            )}

            {documents.length > 0 && (
              <section aria-labelledby="documents-heading">
                <h2 id="documents-heading" className="mb-6 text-3xl">
                  {item.kind === 'MoU' ? 'The MoU' : 'Documents'}
                </h2>
                <Gallery images={documents} label={`${item.title}: documents`} />
              </section>
            )}
          </div>
        )}

        {/* Without a story or photos yet, the facts and the call to action sit side by side. */}
        <aside className={hasMain ? 'space-y-6 lg:col-span-4' : 'grid gap-6 lg:grid-cols-2'}>
          <div className="rounded-2xl border border-line bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${kindStyle[item.kind] ?? kindStyle.Recognition}`}
              >
                {item.kind}
              </span>
              {logo && (
                <MediaImage
                  media={logo}
                  size="thumb"
                  sizes="128px"
                  className="max-h-20 w-auto max-w-32 object-contain"
                />
              )}
            </div>
            <dl className="mt-6 space-y-4">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs uppercase tracking-wider text-slate">{k}</dt>
                  <dd className="mt-0.5 text-navy">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 border-t border-line pt-4 text-xs text-slate">
              Source: {item.source}
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-navy p-6 text-white sm:p-8">
            <p className="font-heading text-xl">Work with us on AI and skills</p>
            <p className="mt-2 text-sm text-white/75">
              Universities, public bodies and companies are welcome.
            </p>
            <ButtonLink href="/contact?pathway=partnerships" className="mt-5 self-start">
              Partner with us <ArrowIcon />
            </ButtonLink>
          </div>
        </aside>
      </div>

      {others.length > 0 && (
        <section className="container-page" aria-labelledby="more-heading">
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-14">
            <h2 id="more-heading" className="text-3xl">
              More partnerships and programmes
            </h2>
            <ButtonLink href="/partnerships" variant="secondary">
              See all <ArrowIcon />
            </ButtonLink>
          </div>
          <div className="mt-8">
            <Credentials items={others} cta={false} />
          </div>
        </section>
      )}
    </>
  )
}
