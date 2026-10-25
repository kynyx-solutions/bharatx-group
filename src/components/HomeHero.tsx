import fs from 'fs'
import path from 'path'
import Image from 'next/image'
import { states } from '@/lib/content'
import { HeroVideo } from './HeroVideo'
import { ArrowIcon, ButtonLink } from './ui'

const ticker = [
  'AI & automation',
  'Engineering',
  'Roads & bridges',
  'Agri-exports',
  'Made-in-India castors',
  'Industrial packaging',
  'Venture building',
  'Education, research & environment',
]

const POSTER = '/placeholders/home-hero.webp'

/** Drop hero.mp4 (and optionally hero.webm) into public/hero/ and the video appears; until then, the still image. */
const videoSources = [
  { file: 'hero.webm', type: 'video/webm' },
  { file: 'hero.mp4', type: 'video/mp4' },
]
  .filter((v) => fs.existsSync(path.join(process.cwd(), 'public', 'hero', v.file)))
  .map((v) => ({ src: `/hero/${v.file}`, type: v.type }))

const poster = fs.existsSync(path.join(process.cwd(), 'public', 'hero', 'poster.webp')) ? '/hero/poster.webp' : POSTER

const delay = (ms: number) => ({ animationDelay: `${ms}ms` })

export function HomeHero({ businessCount, sectorCount }: { businessCount: number; sectorCount: number }) {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-5rem)] flex-col overflow-hidden bg-navy text-white lg:min-h-[calc(100svh-6rem)]">
      {/* Backdrop: video (or still), then shading so the text always reads */}
      {videoSources.length > 0 ? (
        <HeroVideo sources={videoSources} poster={poster} />
      ) : (
        <Image src={poster} alt="" fill loading="eager" fetchPriority="high" quality={55} sizes="100vw" className="-z-30 object-cover" />
      )}
      <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-r from-navy via-navy/75 to-navy/10" />
      <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-t from-navy via-transparent to-navy/30" />

      <div className="container-page flex flex-1 flex-col justify-center py-20 lg:py-24">
        <div className="max-w-3xl">
          <p
            className="animate-rise inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white/90 backdrop-blur"
            style={delay(0)}
          >
            <span className="size-1.5 rounded-full bg-saffron" />
            New Delhi · Building for Viksit Bharat @2047
          </p>

          <h1 className="mt-8 font-heading text-[3.25rem] leading-[0.98] tracking-tight !text-white drop-shadow-[0_2px_24px_rgba(1,34,71,0.5)] sm:text-7xl xl:text-[5.75rem]">
            {/* No entrance animation on the headline: it is often the LCP element. */}
            <span className="block">Building Businesses.</span>
            <span className="block">
              Enabling <span className="text-saffron-gradient italic">Bharat.</span>
            </span>
          </h1>

          <p className="animate-rise mt-8 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl" style={delay(400)}>
            A technology-led Indian group. From the roads you travel to the food on your plate, we build the businesses
            everyday India runs on — in AI and technology, infrastructure, manufacturing, agriculture, packaging and
            venture building.
          </p>

          <div className="animate-rise mt-10 flex flex-wrap gap-3" style={delay(520)}>
            <ButtonLink href="#a-day-in-india" className="!min-h-12 !px-7 shadow-[0_10px_40px_-10px_rgba(254,120,2,0.7)]">
              See a day in India <ArrowIcon className="size-4 rotate-90" />
            </ButtonLink>
            <ButtonLink href="/businesses" variant="light" className="!min-h-12 !px-7">
              Our businesses
            </ButtonLink>
          </div>

          <dl className="animate-rise mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-white/15 pt-8" style={delay(640)}>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/60">Sectors</dt>
              <dd className="mt-1 font-heading text-4xl">{sectorCount}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/60">Businesses</dt>
              <dd className="mt-1 font-heading text-4xl">{businessCount}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/60">States</dt>
              <dd className="mt-1 font-heading text-4xl" title={states.join(', ')}>
                {states.length}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Sector ticker */}
      <div className="border-t border-white/10 bg-navy/70 py-5 backdrop-blur" aria-hidden>
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
          <ul className="animate-marquee flex shrink-0 items-center gap-10 pr-10">
            {[...ticker, ...ticker].map((t, i) => (
              <li key={i} className="flex shrink-0 items-center gap-10 whitespace-nowrap font-heading text-lg text-white/70">
                {t}
                <span className="size-1.5 rounded-full bg-saffron" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
