import type { Metadata } from 'next'
import Link from 'next/link'
import { CompanyCard } from '@/components/CompanyCard'
import { SectorIcon } from '@/components/SectorIcon'
import { ArrowIcon, PageHero } from '@/components/ui'
import { getCompanies, getFoundation } from '@/lib/data'
import { sectorLabel } from '@/lib/options'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Our businesses',
  description:
    'The BharatX Group businesses: technology and AI, venture building, infrastructure, castor manufacturing, agri-exports and packaging, and BharatX Foundation for CSR.',
  alternates: { canonical: '/businesses' },
}

const number = (i: number) => String(i + 1).padStart(2, '0')

export default async function BusinessesPage() {
  // One row per business, in the order set in the admin (BharatX's sequence, 25 Oct 2026), then the Foundation.
  const [companies, foundation] = await Promise.all([getCompanies(), getFoundation()])
  const seen = new Set<string>()
  const firstOfSector = (sector: string) => (seen.has(sector) ? false : (seen.add(sector), true))

  return (
    <>
      <PageHero
        eyebrow="Our businesses"
        title="Different businesses. One ecosystem."
        highlight="One ecosystem."
        image="/placeholders/pages/businesses.webp"
        intro={`${companies.length} businesses and a CSR foundation. Each runs in its own market and draws on the wider Group's capital, technology, relationships and talent.`}
      >
        <nav aria-label="Jump to a business" className="mt-10 flex flex-wrap gap-2">
          {companies.map((c) => (
            <a
              key={c.id}
              href={`#${c.slug}`}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-medium text-navy no-underline transition-colors hover:border-navy"
            >
              <SectorIcon sector={c.sector} className="size-4 text-saffron-text" />
              {c.name}
            </a>
          ))}
          <a
            href="#bharatx-foundation"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-green/40 bg-green/10 px-4 text-sm font-medium text-navy no-underline transition-colors hover:border-green-text"
          >
            <SectorIcon sector="foundation" className="size-4 text-green-text" />
            BharatX Foundation
          </a>
        </nav>
      </PageHero>

      <div className="container-page divide-y divide-line">
        {companies.map((c, i) => (
          <section key={c.id} id={c.slug} className="relative scroll-mt-28 grid gap-10 py-16 lg:grid-cols-12" aria-labelledby={`${c.slug}-heading`}>
            {/* Sector anchors (#technology, #agriculture, …) land on the first business of that sector; takes no space. */}
            {firstOfSector(c.sector) && <span id={c.sector} aria-hidden className="absolute top-0 scroll-mt-28" />}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <div className="flex items-center gap-4">
                  <span className="font-heading text-4xl text-saffron-text">{number(i)}</span>
                  <span className="flex size-11 items-center justify-center rounded-xl bg-navy text-saffron-light">
                    <SectorIcon sector={c.sector} className="size-5" />
                  </span>
                </div>
                <p className="eyebrow mt-6">{sectorLabel(c.sector)}</p>
                <h2 id={`${c.slug}-heading`} className="mt-2 text-3xl leading-tight sm:text-4xl">
                  {c.name}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-slate">{c.description}</p>
              </div>
            </div>
            <div className="lg:col-span-7">
              <CompanyCard company={c} featured />
            </div>
          </section>
        ))}

        <section id="bharatx-foundation" className="scroll-mt-28 grid gap-10 py-16 lg:grid-cols-12" aria-labelledby="foundation-heading">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <span className="font-heading text-4xl text-green-text">{number(companies.length)}</span>
              <span className="flex size-11 items-center justify-center rounded-xl bg-green-deep text-white">
                <SectorIcon sector="foundation" className="size-5" />
              </span>
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-green-text">Corporate social responsibility</p>
            <h2 id="foundation-heading" className="mt-2 text-3xl leading-tight sm:text-4xl">
              BharatX Foundation
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate">{foundation.intro}</p>
          </div>
          <div className="lg:col-span-7">
            <Link
              href="/foundation"
              className="group relative flex h-full min-h-72 flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-green/30 bg-green/10 p-8 text-navy no-underline transition-colors hover:border-green-text sm:p-12"
            >
              <div aria-hidden className="bg-grid-light absolute inset-0" />
              <SectorIcon sector="foundation" className="relative size-12 text-green-text" />
              <div className="relative">
                <p className="font-heading text-3xl">{foundation.name}</p>
                <p className="mt-2 max-w-xl text-slate">
                  Section 8 company for CSR: education and skills, research, and the environment.
                  {foundation.cin && <span className="block text-sm"> CIN {foundation.cin}</span>}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-green-text">
                  Learn more <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
