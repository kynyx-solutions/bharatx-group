import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/ui'
import { getCompanies, getFoundation, getSettings } from '@/lib/data'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Corporate information',
  description: 'Legal entities of BharatX Group with their CINs and registered offices.',
  alternates: { canonical: '/corporate-information' },
}

export default async function CorporateInformationPage() {
  const [companies, foundation, settings] = await Promise.all([getCompanies(), getFoundation(), getSettings()])
  const holding = settings.holdingCompany
  const rows = [
    ...(holding?.legalName ? [{ name: 'BharatX Group', legal: holding.legalName, cin: holding.cin, office: holding.registeredOffice, href: '/about' }] : []),
    ...companies.map((c) => ({ name: c.name, legal: c.legalName, cin: c.cin, office: c.registeredOffice || c.operatingAddress, href: `/businesses/${c.slug}` })),
    { name: foundation.name, legal: `${foundation.name} (Section 8 company)`, cin: foundation.cin, office: foundation.registeredOffice, href: '/foundation' },
  ]

  return (
    <>
      <PageHero
        eyebrow="Corporate information"
        title="Our legal entities"
        highlight="legal entities"
        intro="Each BharatX business is a separate legal entity."
      />
      <section className="container-page py-16">
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">BharatX Group legal entities</caption>
            <thead className="bg-sand text-xs uppercase tracking-wider text-slate">
              <tr>
                <th scope="col" className="px-5 py-3">Business</th>
                <th scope="col" className="px-5 py-3">Legal name</th>
                <th scope="col" className="px-5 py-3">CIN</th>
                <th scope="col" className="px-5 py-3">Registered office</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.name} className="align-top">
                  <th scope="row" className="px-5 py-4 font-semibold">
                    <Link href={r.href} className="text-navy">
                      {r.name}
                    </Link>
                  </th>
                  <td className="px-5 py-4 text-slate">{r.legal || 'To be added'}</td>
                  <td className="px-5 py-4 font-mono text-xs text-slate">{r.cin || 'To be added'}</td>
                  <td className="whitespace-pre-line px-5 py-4 text-slate">{r.office || 'To be added'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
