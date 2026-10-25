import Image from 'next/image'
import Link from 'next/link'
import type { Company } from '@/payload-types'
import { asMedia, verifiedOnly } from '@/lib/data'
import { sectorLabel } from '@/lib/options'
import { MediaImage } from './MediaImage'
import { SectorIcon } from './SectorIcon'
import { ArrowIcon, ExternalIcon } from './ui'

/** JSW-style company banner: visual, logo, one line, verified numbers, "Explore" and "Get a quote". */
export function CompanyCard({ company, featured = false }: { company: Company; featured?: boolean }) {
  const logo = asMedia(company.logo)
  const hero = asMedia(company.heroImage)
  const kpis = verifiedOnly(company.kpis).slice(0, 3)

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(1,34,71,0.35)]">
      {/* Visual header */}
      <div className={`relative overflow-hidden bg-navy ${featured ? 'aspect-[16/9]' : 'aspect-[16/10]'}`}>
        {hero ? (
          <MediaImage
            media={hero}
            fill
            size="card"
            sizes={featured ? '(min-width:1280px) 66vw, 100vw' : '(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw'}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          // No photo of its own yet: fall back to the sector image (placeholder).
          <Image
            src={`/placeholders/sectors/${company.sector}.webp`}
            alt=""
            fill
            sizes={featured ? '(min-width:1280px) 66vw, 100vw' : '(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw'}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy backdrop-blur">
          <SectorIcon sector={company.sector} className="size-3.5 text-saffron-text" />
          {sectorLabel(company.sector)}
        </span>
        {logo && (
          <div className="absolute bottom-4 left-4 flex h-14 items-center rounded-xl bg-white px-3 shadow-lg">
            <MediaImage media={logo} size="thumb" sizes="140px" className="h-10 w-auto max-w-[140px] object-contain" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className={featured ? 'text-3xl' : 'text-2xl'}>
          <Link href={`/businesses/${company.slug}`} className="no-underline after:absolute after:inset-0">
            {company.name}
          </Link>
        </h3>
        <p className="mt-3 flex-1 leading-relaxed text-slate">{company.tagline}</p>
        {kpis.length > 0 && (
          <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
            {kpis.map((k) => (
              <div key={k.id}>
                <dt className="sr-only">{k.label}</dt>
                <dd className="font-heading text-xl">{k.value}</dd>
                <dd className="text-xs leading-snug text-slate">{k.label}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="relative z-10 mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5 text-sm font-semibold">
          <span className="inline-flex items-center gap-1.5 text-navy">
            Explore <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
          <Link href={`/contact?pathway=business&company=${company.slug}`} className="text-blue no-underline hover:underline">
            Get a quote
          </Link>
          {company.website && (
            <a href={company.website} target="_blank" rel="noopener" className="ml-auto inline-flex items-center gap-1 text-slate no-underline hover:underline">
              Website <ExternalIcon />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
