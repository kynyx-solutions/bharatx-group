import Link from 'next/link'
import type { Partnership } from '@/payload-types'
import { asMedia } from '@/lib/data'
import { fullDate } from '@/lib/format'
import { MediaImage } from './MediaImage'
import { ArrowIcon } from './ui'

export const kindStyle: Record<string, string> = {
  MoU: 'bg-navy text-white',
  Workshop: 'bg-saffron/15 text-saffron-text',
  Collaboration: 'bg-sky/20 text-navy',
  Programme: 'bg-green/15 text-green-text',
  Recognition: 'bg-sand text-navy',
}

/**
 * Partnership and programme cards, each linking to its own page. A closing "partner with us"
 * card is added when it completes the last row (columns: 2 on tablets, `cols` on desktop).
 */
export function Credentials({
  items,
  cols = 3,
  cta = true,
}: {
  items: Partnership[]
  cols?: 2 | 3
  /** Add the closing "partner with us" card when it completes the last row. */
  cta?: boolean
}) {
  if (items.length === 0) return null
  const fillsRow = cta && (items.length % cols !== 0 || items.length % 2 !== 0)
  const grid = cols === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'

  return (
    <ul className={`grid gap-4 ${grid}`}>
      {items.map((c) => {
        const logo = asMedia(c.logo)
        return (
          <li key={c.id} className="reveal">
            <Link
              href={`/partnerships/${c.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 no-underline transition-all hover:-translate-y-0.5 hover:border-navy hover:shadow-[0_18px_40px_-24px_rgba(1,34,71,0.4)]"
            >
              <span className="flex items-start justify-between gap-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${kindStyle[c.kind] ?? kindStyle.Recognition}`}
                >
                  {c.kind}
                </span>
                {/* The logo slot is always reserved so names line up across cards with and without a logo. */}
                <span className="flex h-14 w-24 shrink-0 items-center justify-end">
                  {logo && (
                    <MediaImage
                      media={logo}
                      size="thumb"
                      sizes="96px"
                      className="max-h-14 w-auto max-w-24 object-contain"
                    />
                  )}
                </span>
              </span>
              <span className="mt-4 block font-heading text-2xl leading-tight text-navy">
                {c.partner}
              </span>
              <span className="mt-2 block text-slate">{c.title}</span>
              {(c.location || c.date) && (
                <span className="mt-2 block text-sm text-slate">
                  {[c.location, c.date && fullDate(c.date)].filter(Boolean).join(' · ')}
                </span>
              )}
              <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-blue">
                Read more{' '}
                <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        )
      })}
      {fillsRow && (
        <li>
          <Link
            href="/contact?pathway=partnerships"
            className="group flex h-full min-h-48 flex-col justify-between rounded-2xl border border-navy bg-navy p-6 text-white no-underline transition-colors hover:bg-navy-soft"
          >
            <span className="font-heading text-2xl leading-tight">Your institution next?</span>
            <span>
              <span className="block text-sm text-white/75">
                Universities, public bodies and companies working on AI and skills.
              </span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-light">
                Partner with us{' '}
                <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
        </li>
      )}
    </ul>
  )
}
