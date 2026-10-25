import Link from 'next/link'
import { Credentials } from '@/components/Credentials'
import { DayInIndia } from '@/components/DayInIndia'
import { HomeHero } from '@/components/HomeHero'
import { Kpis } from '@/components/Kpis'
import { MediaImage } from '@/components/MediaImage'
import { QuickActions } from '@/components/QuickActions'
import { SectorIcon } from '@/components/SectorIcon'
import { ArrowIcon, ButtonLink, SectionHeading } from '@/components/ui'
import { viksitBharat } from '@/lib/content'
import { asCompany, asMedia, getCompanies, getGroupFacts, getNews, getOpenJobs, getPartnerships, getPeople, verifiedOnly } from '@/lib/data'
import { fullDate } from '@/lib/format'
import { sectorLabel } from '@/lib/options'

export const revalidate = 300

const approach = [
  { title: 'Identify', text: "We find real gaps in India's economy." },
  { title: 'Build', text: 'We create the product, team and operations to fill them.' },
  { title: 'Invest', text: 'We back each business with patient capital and resources.' },
  { title: 'Scale', text: 'We grow its reach across India and abroad.' },
  { title: 'Impact', text: 'We measure success in jobs, skills and lasting value.' },
]

const pillars = [
  { title: 'Capital', text: 'Access to capital and financial resources.' },
  { title: 'Technology', text: 'AI, automation and digital capabilities.' },
  { title: 'Execution', text: 'Real operating experience across industries.' },
  { title: 'Ecosystem', text: 'Shared capabilities, partnerships and market access.' },
]

export default async function HomePage() {
  const [companies, facts, news, jobs, people, credentials] = await Promise.all([
    getCompanies(),
    getGroupFacts(),
    getNews(3),
    getOpenJobs(),
    getPeople(),
    getPartnerships(),
  ])
  const founder = people.find((p) => p.slug === 'pradeep-kumar')
  const founderPhoto = asMedia(founder?.photo)
  const numbers = verifiedOnly(facts.figures)
  const certifications = companies.flatMap((c) =>
    verifiedOnly(c.certifications).map((cert) => ({ ...cert, company: c.name })),
  )

  return (
    <>
      <HomeHero businessCount={companies.length} sectorCount={new Set(companies.map((c) => c.sector)).size} />

      <QuickActions />

      <DayInIndia />

      {/* Partnerships and programmes: names the institutions, not the company (company names live on /businesses). */}
      {credentials.length > 0 && (
        <section className="container-page pb-24" aria-labelledby="institutions-heading">
          <SectionHeading
            id="institutions-heading"
            eyebrow="Partnerships and programmes"
            title="Working with India's institutions."
            intro="Our AI and technology business works with government, leading institutions and public-sector companies on AI adoption and skills."
            action={
              <ButtonLink href="/partnerships" variant="secondary">
                All partnerships <ArrowIcon />
              </ButtonLink>
            }
          />
          <Credentials items={credentials} />
        </section>
      )}

      {/* Group in numbers — verified figures only */}
      {numbers.length > 0 && (
        <section className="border-y border-line bg-white py-20" aria-labelledby="numbers-heading">
          <div className="container-page">
            <p className="eyebrow">Group in numbers</p>
            <h2 id="numbers-heading" className="mt-3 mb-12 text-3xl sm:text-4xl">
              Measured, dated and sourced.
            </h2>
            <Kpis items={numbers} />
          </div>
        </section>
      )}

      {/* How we build */}
      <section className="relative isolate overflow-hidden border-y border-line bg-sand/60 py-24 sm:py-28" aria-labelledby="approach-heading">
        <div aria-hidden className="bg-grid-light absolute inset-0 -z-10" />
        <div aria-hidden className="absolute top-0 left-1/2 -z-10 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-sky/15 blur-[120px]" />
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="eyebrow">How we build</p>
            <h2 id="approach-heading" className="mt-3 text-4xl leading-tight sm:text-5xl">
              From opportunity <span className="text-highlight italic">to enterprise.</span>
            </h2>
            <p className="mt-5 text-lg text-slate">
              We don&apos;t just back businesses. We help build them — with capital, technology, talent and execution.
            </p>
          </div>
          <ol className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            <span aria-hidden className="absolute top-6 right-0 left-0 hidden h-px bg-gradient-to-r from-saffron via-navy/20 to-green lg:block" />
            {approach.map((step, i) => (
              <li key={step.title} className="reveal relative">
                <span className="relative flex size-12 items-center justify-center rounded-full border border-line bg-white font-heading text-lg text-saffron-text shadow-sm">
                  {i + 1}
                </span>
                <h3 className="mt-6 text-2xl">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-slate">{step.text}</p>
              </li>
            ))}
          </ol>
          <ul className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <li key={p.title} className="bg-white p-6">
                <p className="font-heading text-xl">{p.title}</p>
                <p className="mt-2 text-sm text-slate">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Viksit Bharat */}
      <section className="container-page py-24 sm:py-28" aria-labelledby="vb-heading">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Viksit Bharat @2047</p>
            <h2 id="vb-heading" className="mt-3 text-4xl leading-tight sm:text-5xl">
              Built for a developed India.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate">
              Aligned with India&apos;s national vision of Viksit Bharat @2047, we build in the sectors a developed
              India depends on. Here is what each part of the Group contributes today.
            </p>
            <ButtonLink href="/about" variant="secondary" className="mt-8">
              Our vision and mission <ArrowIcon />
            </ButtonLink>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {viksitBharat.map((row) => (
              <li key={row.goal} className="reveal">
                <Link
                  href={row.href}
                  className="group flex h-full gap-4 rounded-2xl border border-line bg-white p-5 no-underline transition-colors hover:border-navy"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sand text-saffron-text transition-colors group-hover:bg-navy group-hover:text-saffron-light">
                    <SectorIcon sector={row.sector} />
                  </span>
                  <span>
                    <span className="block font-heading text-lg text-navy">{row.goal}</span>
                    <span className="mt-1 block text-sm text-slate">{row.what}</span>
                    <span className="mt-2 block text-sm font-semibold text-blue">
                      {row.sector === 'foundation' ? 'Our CSR foundation' : sectorLabel(row.sector)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
            {/* Fills the last slot of the 2-column grid. */}
            <li className="reveal">
              <Link
                href="/contact?pathway=partnerships"
                className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-navy bg-navy p-5 text-white no-underline transition-colors hover:bg-navy-soft"
              >
                <span>
                  <span className="block font-heading text-lg">Build India&apos;s next chapter with us</span>
                  <span className="mt-1 block text-sm text-white/75">Partnerships, institutions and CSR</span>
                </span>
                <ArrowIcon className="size-5 shrink-0 text-saffron-light transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Founder */}
      {founder && (
        <section className="border-y border-line bg-sand/70 py-24 sm:py-28" aria-labelledby="founder-heading">
          <div className="container-page grid items-center gap-12 lg:grid-cols-12">
            <div className="reveal relative lg:col-span-5">
              <div aria-hidden className="absolute -top-4 -left-4 h-full w-full rounded-3xl border-2 border-saffron/60" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-navy">
                {founderPhoto && (
                  <MediaImage media={founderPhoto} fill size="card" sizes="(min-width:1024px) 40vw, 100vw" className="object-cover object-top" />
                )}
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="eyebrow" id="founder-heading">
                Leadership
              </p>
              <blockquote className="mt-5 font-heading text-4xl leading-[1.15] text-navy sm:text-5xl">
                <span aria-hidden className="text-saffron">&ldquo;</span>We don&apos;t just back businesses. We help build
                them.<span aria-hidden className="text-saffron">&rdquo;</span>
              </blockquote>
              <p className="mt-8 text-xl font-semibold">{founder.name}</p>
              <p className="text-saffron-text">{founder.role}</p>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate">{founder.shortBio}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/leadership" variant="secondary">
                  Meet the leadership <ArrowIcon />
                </ButtonLink>
                <ButtonLink href="/about" variant="secondary">
                  About the Group
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Proof — verified certifications only */}
      {certifications.length > 0 && (
        <section className="border-b border-line bg-white py-16" aria-labelledby="proof-heading">
          <div className="container-page">
            <h2 id="proof-heading" className="mb-8 text-2xl">
              Certified and accountable
            </h2>
            <ul className="flex flex-wrap gap-3">
              {certifications.map((c) => (
                <li key={`${c.company}-${c.id}`} className="rounded-full border border-line px-4 py-2 text-sm">
                  <strong>{c.name}</strong> <span className="text-slate">· {c.company}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Latest news */}
      {news.length > 0 && (
        <section className="container-page py-24" aria-labelledby="news-heading">
          <SectionHeading
            id="news-heading"
            eyebrow="Newsroom"
            title="Latest from the Group"
            action={
              <ButtonLink href="/news" variant="secondary">
                All news <ArrowIcon />
              </ButtonLink>
            }
          />
          <ul className="grid gap-6 md:grid-cols-3">
            {news.map((n) => (
              <li key={n.id} className="relative rounded-2xl border border-line bg-white p-6">
                <p className="text-sm text-slate">
                  <time dateTime={n.date}>{fullDate(n.date)}</time>
                  {asCompany(n.company) && ` · ${asCompany(n.company)!.name}`}
                </p>
                <h3 className="mt-3 text-xl leading-snug">
                  <Link href={`/news/${n.slug}`} className="no-underline after:absolute after:inset-0 hover:underline">
                    {n.title}
                  </Link>
                </h3>
                <p className="mt-3 text-slate">{n.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Closing CTA */}
      <section className="container-page pt-24">
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-line bg-white px-6 py-16 sm:px-14 sm:py-20">
          <div aria-hidden className="bg-grid-light absolute inset-0 -z-10" />
          <div aria-hidden className="absolute -right-20 -bottom-32 -z-10 size-[30rem] rounded-full bg-saffron/15 blur-[100px]" />
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <h2 className="text-4xl leading-tight sm:text-5xl">
                Let&apos;s build what <span className="text-highlight italic">comes next.</span>
              </h2>
              <p className="mt-5 max-w-xl text-lg text-slate">
                Whether you&apos;re a business partner, investor, entrepreneur, institution or technology partner,
                let&apos;s explore what we can build together.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/contact" className="!min-h-12 !px-7">
                  Start a conversation <ArrowIcon />
                </ButtonLink>
                <ButtonLink href="/contact?pathway=founders" variant="secondary" className="!min-h-12 !px-7">
                  I&apos;m a founder
                </ButtonLink>
              </div>
            </div>
            <Link
              href="/careers"
              className="group rounded-2xl border border-line bg-sand/60 p-6 no-underline transition-colors hover:border-navy lg:col-span-5"
            >
              <p className="eyebrow">Careers</p>
              <p className="mt-2 font-heading text-2xl text-navy">Build what matters.</p>
              <p className="mt-2 text-slate">
                {jobs.length > 0
                  ? `${jobs.length} open ${jobs.length === 1 ? 'role' : 'roles'} across the Group.`
                  : 'We are always interested in meeting people who want to build with us.'}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
                {jobs.length > 0 ? 'See open roles' : 'Explore careers'}{' '}
                <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
