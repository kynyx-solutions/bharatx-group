import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowIcon, ButtonLink, PageHero, SectionHeading } from '@/components/ui'
import { viksitBharat } from '@/lib/content'
import { asCompany, getGroupFacts } from '@/lib/data'
import { sectorLabel } from '@/lib/options'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'About',
  description:
    "BharatX Group builds businesses in the sectors a developed India depends on — infrastructure, agriculture, manufacturing and technology — aligned with India's national vision of Viksit Bharat @2047.",
  alternates: { canonical: '/about' },
}

// One row on wide screens for up to five milestones; more wrap in rows of four.
const timelineCols: Record<number, string> = { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' }

const principles = [
  { title: 'Entrepreneurial', text: 'We think like builders and act with ownership.' },
  { title: 'Execution-driven', text: 'Ideas matter only when they turn into results.' },
  { title: 'Long-term', text: 'We build for lasting value, not short-term visibility.' },
  { title: 'Technology-enabled', text: 'We use technology to run and grow businesses better.' },
  { title: 'Responsible', text: 'Growth must create value for businesses, people and communities.' },
  { title: 'Nation-first', text: "We build businesses that strengthen India's economy and self-reliance." },
]

export default async function AboutPage() {
  const facts = await getGroupFacts()
  const milestones = [...(facts.milestones ?? [])].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <>
      <PageHero
        eyebrow="About BharatX Group"
        title="Building enterprises for a growing Bharat."
        highlight="growing Bharat."
        image="/placeholders/pages/about.webp"
        intro="BharatX Group brings together businesses operating across some of India's most important growth sectors."
      />

      <section className="container-page grid gap-12 py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="text-3xl sm:text-4xl">More than a group of companies</h2>
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-slate lg:col-span-7">
          <p>
            We combine entrepreneurial thinking, operational capability, technology and capital to build businesses that
            solve real-world problems and create long-term value.
          </p>
          <p>
            Our businesses span infrastructure and engineering, agriculture and food, industrial manufacturing, AI and
            technology, packaging and venture building. Through BharatX Labs Foundation, we also invest in education,
            skills, research and the environment.
          </p>
          <p>
            India is entering a period of extraordinary economic transformation. BharatX exists to take part in it — by
            building the businesses that this growth depends on.
          </p>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-y border-line bg-white py-20">
        <div aria-hidden className="bg-grid-light absolute inset-0 -z-10" />
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Our vision</p>
            <p className="mt-4 font-heading text-3xl leading-snug sm:text-4xl">
              To build world-class Indian businesses that help make India a developed nation by 2047.
            </p>
            <p className="mt-6 leading-relaxed text-slate">
              Aligned with India&apos;s national vision of Viksit Bharat @2047, BharatX Group builds world-class
              businesses in the sectors a developed India depends on — infrastructure, agriculture, manufacturing and
              technology — and creates value that lasts for generations.
            </p>
          </div>
          <div>
            <p className="eyebrow">Our mission</p>
            <p className="mt-4 font-heading text-2xl leading-snug sm:text-3xl">
              To find real gaps in India&apos;s economy and build, operate and scale the businesses that fill them —
              creating jobs, raising farmer incomes, making more in India and bringing technology to every business we
              touch.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-20" aria-labelledby="vb-heading">
        <SectionHeading
          id="vb-heading"
          eyebrow="Viksit Bharat @2047"
          title="Our role in India's national vision"
          intro="What each part of the Group contributes today."
        />
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {viksitBharat.map((row) => (
            <li key={row.goal} className="bg-white p-6">
              <h3 className="text-xl">{row.goal}</h3>
              <p className="mt-2 text-slate">{row.what}</p>
              <Link href={row.href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue no-underline hover:underline">
                {row.sector === 'foundation' ? 'Our CSR foundation' : sectorLabel(row.sector)} <ArrowIcon />
              </Link>
            </li>
          ))}
          {/* Two closing cells complete the grid (9 cells: 3×3, or 2 columns with the last one wide). */}
          <li className="bg-sand/60 p-6">
            <h3 className="text-xl">Seven businesses, one direction</h3>
            <p className="mt-2 text-slate">Each business serves its own market; together they build for a developed India.</p>
            <Link href="/businesses" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue no-underline hover:underline">
              See our businesses <ArrowIcon />
            </Link>
          </li>
          <li className="bg-navy p-6 text-white md:col-span-2 lg:col-span-1">
            <h3 className="text-xl !text-white">Partner with us</h3>
            <p className="mt-2 text-white/75">Governments, institutions and companies working towards Viksit Bharat @2047.</p>
            <Link href="/contact?pathway=partnerships" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-light no-underline hover:underline">
              Start a conversation <ArrowIcon />
            </Link>
          </li>
        </ul>
      </section>

      <section className="border-y border-line bg-sand/60 py-20" aria-labelledby="principles-heading">
        <div className="container-page">
          <SectionHeading id="principles-heading" eyebrow="How we work" title="Our principles" />
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p) => (
              <li key={p.title} className="border-l-2 border-saffron pl-5">
                <h3 className="text-xl">{p.title}</h3>
                <p className="mt-2 text-slate">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {milestones.length > 0 && (
        <section className="container-page py-20" aria-labelledby="timeline-heading">
          <SectionHeading id="timeline-heading" eyebrow="Milestones" title="Our journey so far" />
          {/* Horizontal on wide screens (a rule across the top), stacked cards on phones. */}
          <ol className={`relative grid gap-6 sm:grid-cols-2 ${timelineCols[Math.min(milestones.length, 5)] ?? 'lg:grid-cols-4'}`}>
            <span aria-hidden className="absolute top-[7px] right-0 left-0 hidden h-px bg-gradient-to-r from-saffron via-navy/20 to-green lg:block" />
            {milestones.map((m) => (
              <li key={m.id} className="relative">
                <span aria-hidden className="relative block size-3.5 rounded-full border-2 border-ivory bg-saffron ring-1 ring-saffron/40" />
                <div className="mt-5 h-[calc(100%-2rem)] rounded-2xl border border-line bg-white p-6">
                <p className="text-sm font-semibold text-saffron-text">
                  <time dateTime={m.date.slice(0, 4)}>{m.date.slice(0, 4)}</time>
                  {asCompany(m.company) && <span className="text-slate"> · {asCompany(m.company)!.name}</span>}
                </p>
                <h3 className="mt-2 text-xl leading-snug">{m.title}</h3>
                {m.detail && <p className="mt-2 text-slate">{m.detail}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="container-page py-20">
        <div className="rounded-2xl border border-line bg-white p-8 sm:p-12">
          <p className="eyebrow">The journey ahead</p>
          <p className="mt-4 max-w-3xl font-heading text-2xl leading-snug sm:text-3xl">
            BharatX Group is still at the beginning of its journey. As we grow, our ambition remains constant: to create
            enduring enterprises that contribute to India&apos;s economic progress.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/leadership" variant="secondary">
              Meet our leadership <ArrowIcon />
            </ButtonLink>
            <ButtonLink href="/contact">Work with us</ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
