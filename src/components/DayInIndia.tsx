import Image from 'next/image'
import Link from 'next/link'
import { dayInIndia } from '@/lib/content'
import { SectorIcon } from './SectorIcon'
import { ArrowIcon } from './ui'

/** Home page story: where each sector shows up in an ordinary Indian's day. */
export function DayInIndia() {
  return (
    <section id="a-day-in-india" className="relative py-24 sm:py-32" aria-labelledby="day-heading">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">A day in India</p>
          <h2 id="day-heading" className="mt-4 text-4xl leading-tight sm:text-6xl">
            Where we meet <span className="italic text-saffron-text">everyday</span> India.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate sm:text-xl">
            From the road you take to work to the box at your door, here is where our businesses show up in an
            ordinary Indian day.
          </p>
        </div>

        <ol className="relative mt-20">
          {/* the spine of the day */}
          <span
            aria-hidden
            className="absolute top-0 bottom-0 left-5 w-px bg-gradient-to-b from-saffron via-blue/40 to-green lg:left-1/2"
          />
          {dayInIndia.map((d, i) => {
            const flip = i % 2 === 1
            return (
              <li key={d.sector} id={`day-${d.sector}`} className="relative scroll-mt-32 pb-16 pl-14 last:pb-0 lg:pl-0">
                {/* sector marker on the spine */}
                <div className="absolute top-0 left-0 flex items-center lg:left-1/2 lg:-translate-x-1/2">
                  <span className="flex size-10 items-center justify-center rounded-full border-4 border-ivory bg-navy text-saffron-light shadow-md">
                    <SectorIcon sector={d.sector} className="size-4" />
                  </span>
                </div>

                <div className={`reveal grid items-center gap-8 lg:grid-cols-2 lg:gap-24 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                  <div className="group relative aspect-[16/10] overflow-hidden rounded-3xl bg-navy shadow-[0_30px_60px_-30px_rgba(1,34,71,0.45)]">
                    <Image
                      src={d.image}
                      alt=""
                      fill
                      sizes="(min-width:1024px) 45vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-saffron-text">{d.moment}</p>
                    <h3 className="mt-3 text-3xl leading-tight sm:text-4xl">{d.title}</h3>
                    <p className="mt-4 text-lg leading-relaxed text-slate">{d.text}</p>
                    <Link
                      href={d.href}
                      className="mt-6 inline-flex items-center gap-2 rounded-full border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy no-underline transition-colors hover:border-navy hover:bg-navy hover:text-white"
                    >
                      {d.cta} <ArrowIcon />
                    </Link>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
