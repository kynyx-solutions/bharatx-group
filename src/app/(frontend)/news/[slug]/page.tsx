import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MediaImage } from '@/components/MediaImage'
import { ExternalIcon } from '@/components/ui'
import { asCompany, asMedia, getNews, getNewsItem } from '@/lib/data'
import { fullDate, hostOf } from '@/lib/format'

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getNews()).map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getNewsItem((await params).slug)
  if (!item) return {}
  const img = asMedia(item.image)
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: `/news/${item.slug}` },
    openGraph: { type: 'article', publishedTime: item.date, ...(img?.url && { images: [{ url: img.url }] }) },
  }
}

export default async function NewsItemPage({ params }: Props) {
  const item = await getNewsItem((await params).slug)
  if (!item) notFound()
  const img = asMedia(item.image)
  const company = asCompany(item.company)

  return (
    <article className="container-narrow py-16">
      <Link href="/news" className="text-sm font-semibold text-blue no-underline hover:underline">
        ← Newsroom
      </Link>
      <p className="mt-8 text-sm text-slate">
        <time dateTime={item.date}>{fullDate(item.date)}</time>
        {company && (
          <>
            {' · '}
            <Link href={`/businesses/${company.slug}`} className="text-blue underline decoration-blue/40 underline-offset-4 hover:decoration-blue">
              {company.name}
            </Link>
          </>
        )}
      </p>
      <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{item.title}</h1>
      <p className="mt-5 text-xl leading-relaxed text-slate">{item.summary}</p>
      {img && (
        <figure className="my-10">
          <MediaImage media={img} size="hero" sizes="(min-width:768px) 768px, 100vw" className="w-full rounded-2xl" lcp />
          {img.credit && <figcaption className="mt-2 text-xs text-slate">Photo: {img.credit}</figcaption>}
        </figure>
      )}
      {item.body && <RichText data={item.body} className="prose-bx" />}
      {item.sourceUrl && (
        <p className="mt-10 border-t border-line pt-6 text-sm text-slate">
          Source:{' '}
          <a href={item.sourceUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-blue">
            {hostOf(item.sourceUrl)} <ExternalIcon />
          </a>
        </p>
      )}
    </article>
  )
}
