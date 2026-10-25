import type { Metadata } from 'next'
import Link from 'next/link'
import { Kpis } from '@/components/Kpis'
import { MediaImage } from '@/components/MediaImage'
import { ArrowIcon, ButtonLink, PageHero, SectionHeading } from '@/components/ui'
import { asMedia, getFoundation } from '@/lib/data'
import { monthYear } from '@/lib/format'
import { foundationAreas } from '@/lib/options'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'BharatX Labs Foundation',
  description:
    "BharatX Labs Foundation is BharatX Group's not-for-profit Section 8 company for CSR: education and skills, research, and the environment.",
  alternates: { canonical: '/foundation' },
}

const areaText: Record<string, string> = {
  education: 'Training and skills that open up jobs and livelihoods.',
  research: 'Research and innovation that can grow into solutions for India.',
  environment: 'Waste management, recycling and care for the environment.',
  community: 'Support for the communities around our businesses.',
}

export default async function FoundationPage() {
  const f = await getFoundation()
  const programmes = f.programmes ?? []
  const partners = f.partners ?? []

  return (
    <>
      <PageHero
        eyebrow="Corporate social responsibility"
        title={f.name}
        highlight="Foundation"
        intro={f.intro}
        image="/placeholders/pages/foundation.webp"
      />

      <section className="container-page py-20" aria-labelledby="areas-heading">
        <SectionHeading id="areas-heading" eyebrow="What we work on" title="Our focus areas" />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {foundationAreas
            .filter((a) => a.value !== 'community' || programmes.some((p) => p.area === 'community'))
            .map((a) => (
              <li key={a.value} className="rounded-2xl border border-line bg-white p-6">
                <span aria-hidden className="block h-1 w-10 rounded bg-green" />
                <h3 className="mt-5 text-xl">{a.label}</h3>
                <p className="mt-2 text-slate">{areaText[a.value]}</p>
              </li>
            ))}
          {/* Completes the row: 3 focus areas + this card. */}
          <li>
            <Link
              href="/contact?pathway=partnerships"
              className="group flex h-full flex-col justify-between rounded-2xl border border-green/30 bg-green/10 p-6 no-underline transition-colors hover:border-green-text"
            >
              <span>
                <span className="block h-1 w-10 rounded bg-saffron" aria-hidden />
                <span className="mt-5 block font-heading text-xl text-navy">Join a programme</span>
                <span className="mt-2 block text-slate">Volunteers, NGOs, institutions and CSR partners are welcome.</span>
              </span>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-green-text">
                Get in touch <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        </ul>
      </section>

      {programmes.length > 0 && (
        <section className="border-y border-line bg-sand/60 py-20" aria-labelledby="programmes-heading">
          <div className="container-page">
            <SectionHeading id="programmes-heading" eyebrow="Programmes" title="What we are doing now" />
            <ul className="grid gap-8 md:grid-cols-2">
              {programmes.map((p) => {
                const img = asMedia(p.image)
                return (
                  <li key={p.id} className="overflow-hidden rounded-2xl border border-line bg-white">
                    {img && (
                      <div className="relative aspect-[16/9]">
                        <MediaImage media={img} fill size="card" sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
                      </div>
                    )}
                    <div className="p-6">
                      <p className="text-sm font-medium text-green-text">
                        {foundationAreas.find((a) => a.value === p.area)?.label}
                      </p>
                      <h3 className="mt-2 text-2xl">{p.title}</h3>
                      <p className="mt-3 leading-relaxed text-slate">{p.description}</p>
                      {(p.location || p.since) && (
                        <p className="mt-4 text-sm text-slate">
                          {[p.location, p.since && `Since ${monthYear(p.since)}`].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      )}

      {(f.figures ?? []).some((n) => n.verified) && (
        <section className="container-page py-20">
          <SectionHeading eyebrow="Impact" title="In numbers" />
          <Kpis items={f.figures ?? []} />
        </section>
      )}

      {partners.length > 0 && (
        <section className="container-page py-16">
          <h2 className="mb-6 text-2xl">Our partners</h2>
          <ul className="flex flex-wrap gap-4">
            {partners.map((p) => (
              <li key={p.id} className="rounded-full border border-line bg-white px-5 py-2.5">
                {p.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="container-page py-16">
        <div className="relative isolate grid gap-8 overflow-hidden rounded-2xl border border-green/30 bg-green/10 p-8 sm:p-12 lg:grid-cols-12 lg:items-center">
          <div aria-hidden className="bg-grid-light absolute inset-0 -z-10" />
          <div className="lg:col-span-8">
            <h2 className="text-3xl">Partner with the Foundation</h2>
            <p className="mt-3 text-slate">
              Institutions, NGOs, volunteers and companies looking for CSR partners — write to us.
            </p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <ButtonLink href="/contact?pathway=partnerships">
              Get in touch <ArrowIcon />
            </ButtonLink>
          </div>
        </div>
        {(f.cin || f.registration || f.registeredOffice) && (
          <p className="mt-6 text-sm text-slate">
            {[f.name, 'a Section 8 company', f.cin && `CIN ${f.cin}`, f.registration, f.registeredOffice]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
      </section>
    </>
  )
}
