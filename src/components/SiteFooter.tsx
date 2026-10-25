import Link from 'next/link'
import { getCompanies, getSettings, isNewsroomOpen } from '@/lib/data'
import { telHref } from '@/lib/format'

export async function SiteFooter() {
  const [settings, companies, newsroomOpen] = await Promise.all([getSettings(), getCompanies(), isNewsroomOpen()])
  const year = new Date().getFullYear()
  const holding = settings.holdingCompany

  return (
    <footer className="mt-24 bg-navy text-white/80">
      {settings.fraudNotice && (
        <div className="border-b border-white/10 bg-navy-soft">
          <p className="container-page py-4 text-sm">
            <strong className="text-saffron-light">Fraud notice:</strong> {settings.fraudNotice}
          </p>
        </div>
      )}
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="font-heading text-2xl text-white">BharatX Group</p>
          <p className="mt-2 text-white/70">Building Businesses. Enabling Bharat.</p>
          <address className="mt-6 space-y-2 text-sm not-italic leading-relaxed">
            {settings.officeAddress && <p className="whitespace-pre-line">{settings.officeAddress}</p>}
            {settings.phone && (
              <p>
                <a href={telHref(settings.phone)} className="text-white hover:underline">
                  {settings.phone}
                </a>
              </p>
            )}
            {settings.email && (
              <p>
                <a href={`mailto:${settings.email}`} className="text-white hover:underline">
                  {settings.email}
                </a>
              </p>
            )}
          </address>
          {settings.socials && settings.socials.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-4 text-sm">
              {settings.socials.map((s) => (
                <li key={s.id}>
                  <a href={s.url} rel="noopener noreferrer" target="_blank" className="text-white hover:underline">
                    {s.network}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-white">Our businesses</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {companies.map((c) => (
              <li key={c.id}>
                <Link href={`/businesses/${c.slug}`} className="text-white hover:underline">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/foundation" className="text-white hover:underline">
                BharatX Foundation
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="text-sm font-semibold uppercase tracking-wider text-white">Group</p>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              ['/about', 'About'],
              ['/leadership', 'Leadership'],
              ['/partnerships', 'Partnerships'],
              ...(newsroomOpen ? [['/news', 'Newsroom']] : []),
              ['/careers', 'Careers'],
              ['/contact', 'Contact'],
              ['/corporate-information', 'Corporate information'],
              ['/privacy', 'Privacy policy'],
              ['/terms', 'Terms of use'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-white hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-6 text-xs text-white/55">
          © {year} {holding?.legalName || 'BharatX Group'}
          {holding?.cin ? ` · CIN ${holding.cin}` : ''}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
