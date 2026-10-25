import type { Metadata } from 'next'
import { EnquiryForm } from '@/components/forms'
import { PageHero } from '@/components/ui'
import { getCompanies, getSettings } from '@/lib/data'
import { telHref, whatsappHref } from '@/lib/format'
import { pathways } from '@/lib/options'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact BharatX Group for business enquiries, quotes, partnerships, investment, founders, careers and media.',
  alternates: { canonical: '/contact' },
}

const pathwayText: Record<string, string> = {
  business: 'Quotes and orders from any of our businesses.',
  partnerships: 'Joint projects, government and institutional partnerships, CSR.',
  investors: "Investment in the Group or one of its businesses.",
  founders: 'Build or grow your business with BharatX Ventures.',
  careers: 'Questions about working with us.',
  media: 'Press enquiries, interviews and media kit.',
}

type Props = { searchParams: Promise<{ pathway?: string; company?: string }> }

export default async function ContactPage({ searchParams }: Props) {
  const [{ pathway, company }, settings, companies] = await Promise.all([searchParams, getSettings(), getCompanies()])
  const wa = whatsappHref(settings.whatsapp, 'Hello BharatX Group, ')

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's build what comes next."
        highlight="comes next."
        image="/placeholders/pages/contact.webp"
        intro="Tell us what you need and we'll send it to the right team. The next BharatX business could begin with a conversation."
      />
      <div className="container-page grid gap-16 py-16 lg:grid-cols-12">
        <section className="lg:col-span-7" aria-labelledby="form-heading">
          <h2 id="form-heading" className="mb-8 text-3xl">
            Send us a message
          </h2>
          <EnquiryForm
            pathways={pathways.map(({ value, label, reply }) => ({ value, label, reply }))}
            companies={companies.map((c) => ({ slug: c.slug, name: c.name }))}
            defaultPathway={pathways.some((p) => p.value === pathway) ? pathway : undefined}
            defaultCompany={company}
          />
        </section>

        <aside className="space-y-8 lg:col-span-5">
          <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
            <h2 className="text-xl">Group office</h2>
            <address className="mt-4 space-y-3 not-italic text-slate">
              {settings.officeAddress && <p className="whitespace-pre-line text-navy">{settings.officeAddress}</p>}
              {settings.phone && (
                <p>
                  Phone:{' '}
                  <a href={telHref(settings.phone)} className="text-blue underline decoration-blue/40 underline-offset-4 hover:decoration-blue">
                    {settings.phone}
                  </a>
                </p>
              )}
              {settings.email && (
                <p>
                  Email:{' '}
                  <a href={`mailto:${settings.email}`} className="text-blue underline decoration-blue/40 underline-offset-4 hover:decoration-blue">
                    {settings.email}
                  </a>
                </p>
              )}
              {settings.hours && <p>{settings.hours}</p>}
            </address>
            <div className="mt-6 flex flex-wrap gap-3">
              {wa && (
                <a href={wa} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center rounded-full border border-green-text/40 px-5 text-sm font-semibold text-green-text no-underline hover:bg-green/10">
                  Chat on WhatsApp
                </a>
              )}
              {settings.mapUrl && (
                <a href={settings.mapUrl} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm font-semibold no-underline hover:border-navy">
                  Open in Maps
                </a>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl">Who we'll connect you with</h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {pathways.map((p) => (
                <li key={p.value} className="py-4">
                  <p className="font-semibold">{p.label}</p>
                  <p className="text-sm text-slate">
                    {pathwayText[p.value]} We reply within {p.reply}.
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  )
}
