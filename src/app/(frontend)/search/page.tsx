import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowIcon } from '@/components/ui'
import { payload } from '@/lib/data'
import { fullDate } from '@/lib/format'
import { sectorLabel } from '@/lib/options'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search BharatX Group businesses, people, news and jobs.',
  robots: { index: false },
}

type Hit = { href: string; kind: string; title: string; text?: string | null }

/** FR-13: search across companies, leadership, news and open jobs. */
async function search(q: string): Promise<Hit[]> {
  const p = await payload()
  const published = { _status: { equals: 'published' } }
  const like = (...fields: string[]) => ({ or: fields.map((f) => ({ [f]: { like: q } })) })
  const today = new Date(new Date().setHours(0, 0, 0, 0)).toISOString()

  const [companies, partnerships, people, news, jobs] = await Promise.all([
    p.find({ collection: 'companies', depth: 0, limit: 10, where: { and: [published, like('name', 'tagline', 'description')] } }),
    p.find({ collection: 'partnerships', depth: 0, limit: 10, where: { and: [published, like('title', 'partner', 'summary')] } }),
    p.find({ collection: 'people', depth: 0, limit: 10, where: { and: [published, like('name', 'role', 'shortBio')] } }),
    p.find({ collection: 'news', depth: 0, limit: 10, sort: '-date', where: { and: [published, like('title', 'summary')] } }),
    p.find({
      collection: 'jobs',
      depth: 0,
      limit: 10,
      where: { and: [published, { closingDate: { greater_than_equal: today } }, like('title', 'summary', 'location')] },
    }),
  ])

  return [
    ...companies.docs.map((c) => ({ href: `/businesses/${c.slug}`, kind: sectorLabel(c.sector) || 'Business', title: c.name, text: c.tagline })),
    ...partnerships.docs.map((x) => ({ href: `/partnerships/${x.slug}`, kind: x.kind, title: x.title, text: x.summary })),
    ...people.docs.map((x) => ({ href: '/leadership', kind: 'Leadership', title: x.name, text: x.role })),
    ...news.docs.map((n) => ({ href: `/news/${n.slug}`, kind: `News · ${fullDate(n.date)}`, title: n.title, text: n.summary })),
    ...jobs.docs.map((j) => ({ href: `/careers/${j.slug}`, kind: `Job · ${j.location}`, title: j.title, text: j.summary })),
  ]
}

type Props = { searchParams: Promise<{ q?: string }> }

export default async function SearchPage({ searchParams }: Props) {
  const q = ((await searchParams).q ?? '').trim().slice(0, 80)
  const hits = q.length >= 2 ? await search(q) : []

  return (
    <section className="container-narrow py-16 sm:py-20">
      <h1 className="text-4xl sm:text-5xl">Search</h1>
      <form role="search" action="/search" className="mt-8 flex gap-3">
        <label htmlFor="q" className="sr-only">
          Search the site
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Try “castors”, “makhana” or a name"
          className="min-h-12 flex-1 rounded-full border border-line bg-white px-5 text-base focus:border-blue focus:outline-none"
        />
        <button type="submit" className="min-h-12 rounded-full bg-navy px-6 font-semibold text-white hover:bg-navy-soft">
          Search
        </button>
      </form>

      {q.length >= 2 && (
        <div className="mt-10" aria-live="polite">
          <p className="text-sm text-slate">
            {hits.length === 0 ? `No results for “${q}”.` : `${hits.length} result${hits.length === 1 ? '' : 's'} for “${q}”`}
          </p>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {hits.map((h) => (
              <li key={`${h.href}-${h.title}`}>
                <Link href={h.href} className="group flex items-start justify-between gap-6 py-5 no-underline">
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-saffron-text">{h.kind}</span>
                    <span className="mt-1 block font-heading text-xl text-navy group-hover:underline">{h.title}</span>
                    {h.text && <span className="mt-1 block text-slate">{h.text}</span>}
                  </span>
                  <ArrowIcon className="mt-6 size-4 shrink-0 text-slate group-hover:text-navy" />
                </Link>
              </li>
            ))}
          </ul>
          {hits.length === 0 && (
            <p className="mt-6 text-slate">
              Can&apos;t find it?{' '}
              <Link href="/contact" className="text-blue underline decoration-blue/40 underline-offset-4">
                Ask us directly
              </Link>
              .
            </p>
          )}
        </div>
      )}
    </section>
  )
}
