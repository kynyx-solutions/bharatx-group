import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CompanyCard } from '@/components/CompanyCard'
import { Credentials } from '@/components/Credentials'
import { Kpis } from '@/components/Kpis'
import { MediaImage } from '@/components/MediaImage'
import { PersonCard } from '@/components/PersonCard'
import { ArrowIcon, ButtonLink, ExternalIcon } from '@/components/ui'
import { asCompany, asMedia, getCompanies, getCompany, getPeople, verifiedOnly, getPartnerships } from '@/lib/data'
import { hostOf, monthYear, telHref, whatsappHref } from '@/lib/format'
import { sectorLabel } from '@/lib/options'

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const companies = await getCompanies()
  return companies.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const company = await getCompany((await params).slug)
  if (!company) return {}
  const hero = asMedia(company.heroImage)
  return {
    title: company.name,
    description: company.tagline,
    alternates: { canonical: `/businesses/${company.slug}` },
    openGraph: hero?.url ? { images: [{ url: hero.sizes?.hero?.url || hero.url }] } : undefined,
  }
}

export default async function CompanyPage({ params }: Props) {
  const company = await getCompany((await params).slug)
  if (!company) notFound()

  const [people, companies, partnerships] = await Promise.all([getPeople(), getCompanies(), getPartnerships()])
  const credentials = partnerships.filter((p) => asCompany(p.company)?.id === company.id)
  // Three other businesses, starting after this one, so every page links onward.
  const others = [...companies, ...companies]
    .slice(companies.findIndex((c) => c.id === company.id) + 1)
    .filter((c) => c.id !== company.id)
    .slice(0, 3)
  const heads = people.filter((p) => asCompany(p.company)?.id === company.id)
  const logo = asMedia(company.logo)
  const hero = asMedia(company.heroImage)
  const gallery = (company.gallery ?? []).map(asMedia).filter((m) => m !== null)
  const certs = verifiedOnly(company.certifications)
  const wa = whatsappHref(company.whatsapp, `Hello ${company.name}, I would like a quote for `)

  return (
    <>
      <section className="border-b border-line bg-sand/60">
        <div className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-4">{sectorLabel(company.sector)}</p>
            {logo && <MediaImage media={logo} size="thumb" sizes="200px" className="mb-6 h-16 w-auto max-w-[200px] object-contain" />}
            <h1 className="text-4xl leading-[1.08] sm:text-5xl">{company.name}</h1>
            <p className="mt-5 max-w-2xl text-xl leading-relaxed text-slate">{company.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`/contact?pathway=business&company=${company.slug}`}>
                Get a quote <ArrowIcon />
              </ButtonLink>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-navy/25 px-6 text-sm font-semibold no-underline hover:border-navy hover:bg-white"
                >
                  Visit {hostOf(company.website)} <ExternalIcon />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
            </div>
          </div>
          {hero && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:col-span-5">
              <MediaImage media={hero} fill size="hero" lcp sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
            </div>
          )}
        </div>
      </section>

      <div className="container-page grid gap-16 py-16 lg:grid-cols-12">
        <div className="space-y-14 lg:col-span-8">
          <section aria-labelledby="what-heading">
            <h2 id="what-heading" className="text-3xl">
              What we do
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate">{company.description}</p>
            {company.offerings && company.offerings.length > 0 && (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {company.offerings.map((o) => (
                  <li key={o.id} className="flex gap-3 rounded-xl border border-line bg-white p-4">
                    <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-green" />
                    {o.item}
                  </li>
                ))}
                {/* An odd number leaves a gap in the 2-column grid: fill it with a quote prompt. */}
                {company.offerings.length % 2 === 1 && (
                  <li className="hidden sm:block">
                    <Link
                      href={`/contact?pathway=business&company=${company.slug}`}
                      className="flex h-full items-center justify-between gap-3 rounded-xl border border-dashed border-navy/30 p-4 font-semibold text-navy no-underline hover:border-navy hover:bg-white"
                    >
                      Need something specific? Ask for a custom quote <ArrowIcon />
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </section>

          {company.customers && (
            <section aria-labelledby="who-heading">
              <h2 id="who-heading" className="text-3xl">
                Who we serve
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate">{company.customers}</p>
            </section>
          )}

          {credentials.length > 0 && (
            <section aria-labelledby="credentials-heading">
              <h2 id="credentials-heading" className="mb-6 text-3xl">
                Partnerships and programmes
              </h2>
              <Credentials items={credentials} cols={2} />
            </section>
          )}

          {verifiedOnly(company.kpis).length > 0 && (
            <section aria-labelledby="numbers-heading">
              <h2 id="numbers-heading" className="mb-8 text-3xl">
                In numbers
              </h2>
              <Kpis items={company.kpis ?? []} />
            </section>
          )}

          {gallery.length > 0 && (
            <section aria-labelledby="gallery-heading">
              <h2 id="gallery-heading" className="mb-6 text-3xl">
                Our work
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {gallery.map((m) => (
                  <li key={m.id} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand">
                    <MediaImage media={m} fill size="card" sizes="(min-width:640px) 33vw, 100vw" className="object-cover" />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {heads.length > 0 && (
            <section aria-labelledby="leaders-heading">
              <h2 id="leaders-heading" className="mb-8 text-3xl">
                Leadership
              </h2>
              <div className="grid gap-10 sm:grid-cols-2">
                {heads.map((p) => (
                  <PersonCard key={p.id} person={p} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="text-xl">Talk to sales</h2>
            <ul className="mt-4 space-y-2 text-slate">
              {company.salesEmail && (
                <li>
                  <a href={`mailto:${company.salesEmail}`} className="text-blue underline decoration-blue/40 underline-offset-4 hover:decoration-blue">
                    {company.salesEmail}
                  </a>
                </li>
              )}
              {company.salesPhone && (
                <li>
                  <a href={telHref(company.salesPhone)} className="text-blue underline decoration-blue/40 underline-offset-4 hover:decoration-blue">
                    {company.salesPhone}
                  </a>
                </li>
              )}
            </ul>
            <div className="mt-5 flex flex-col gap-2">
              <ButtonLink href={`/contact?pathway=business&company=${company.slug}`}>Request a quote</ButtonLink>
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-green-text/40 px-6 text-sm font-semibold text-green-text no-underline hover:bg-green/10"
                >
                  Chat on WhatsApp
                </a>
              )}
            </div>
          </div>

          {certs.length > 0 && (
            <div className="rounded-2xl border border-line bg-white p-6">
              <h2 className="text-xl">Certifications</h2>
              <ul className="mt-4 space-y-3">
                {certs.map((c) => (
                  <li key={c.id}>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-slate">As of {monthYear(c.asOf)}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl bg-sand p-6 text-sm text-slate">
            <h2 className="text-base font-semibold">Company information</h2>
            <dl className="mt-3 space-y-3">
              {company.legalName && (
                <div>
                  <dt className="text-xs uppercase tracking-wider">Legal name</dt>
                  <dd className="text-navy">{company.legalName}</dd>
                </div>
              )}
              {company.cin && (
                <div>
                  <dt className="text-xs uppercase tracking-wider">CIN</dt>
                  <dd className="text-navy">{company.cin}</dd>
                </div>
              )}
              {company.since && (
                <div>
                  <dt className="text-xs uppercase tracking-wider">Operating since</dt>
                  <dd className="text-navy">{company.since}</dd>
                </div>
              )}
              {(company.operatingAddress || company.registeredOffice) && (
                <div>
                  <dt className="text-xs uppercase tracking-wider">Address</dt>
                  <dd className="whitespace-pre-line text-navy">{company.operatingAddress || company.registeredOffice}</dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>

      {others.length > 0 && (
        <section className="container-page pb-4" aria-labelledby="others-heading">
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-14">
            <h2 id="others-heading" className="text-3xl">
              Other businesses in the Group
            </h2>
            <ButtonLink href="/businesses" variant="secondary">
              All businesses <ArrowIcon />
            </ButtonLink>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {others.map((c, i) => (
              // The third card only shows when three fit in a row, so two columns never leave a gap.
              <div key={c.id} className={i === 2 ? 'hidden xl:block' : undefined}>
                <CompanyCard company={c} />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
