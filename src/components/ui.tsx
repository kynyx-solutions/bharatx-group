import Image from 'next/image'
import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

type ButtonProps = ComponentProps<typeof Link> & { variant?: 'primary' | 'secondary' | 'light' }

const variants = {
  // Saffron buttons take navy text (6.0:1); white on saffron fails contrast.
  primary: 'bg-saffron text-navy hover:bg-saffron-light',
  secondary: 'border border-navy/25 text-navy hover:border-navy hover:bg-white',
  light: 'border border-white/40 text-white hover:bg-white hover:text-navy',
}

export function ButtonLink({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <Link
      {...props}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold no-underline transition-colors ${variants[variant]} ${className}`}
    />
  )
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  action,
  id,
}: {
  eyebrow?: string
  title: string
  intro?: ReactNode
  action?: ReactNode
  id?: string
}) {
  return (
    <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 id={id} className="text-3xl leading-tight sm:text-4xl">
          {title}
        </h2>
        {intro && <p className="mt-4 text-lg leading-relaxed text-slate">{intro}</p>}
      </div>
      {action}
    </div>
  )
}

/** Inner-page header: light, with a faint grid, a soft saffron glow and an optional photo fading in on the right. */
export function PageHero({
  eyebrow,
  title,
  highlight,
  intro,
  image,
  children,
}: {
  eyebrow: string
  title: string
  /** Words inside the title to set in saffron italics. */
  highlight?: string
  intro?: ReactNode
  /** Backdrop image path under /public. */
  image?: string
  children?: ReactNode
}) {
  const at = highlight ? title.indexOf(highlight) : -1
  const heading =
    at >= 0 ? (
      <>
        {title.slice(0, at)}
        <span className="text-highlight italic">{highlight}</span>
        {title.slice(at + highlight!.length)}
      </>
    ) : (
      title
    )

  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-ivory">
      {/* Photo on the right half, fading into the page (desktop only; phones get a tiny file via sizes). */}
      {image && (
        <div aria-hidden className="absolute inset-y-0 right-0 -z-20 hidden w-[55%] [mask-image:linear-gradient(90deg,transparent,#000_45%)] lg:block">
          <Image src={image} alt="" fill loading="eager" fetchPriority="high" quality={55} sizes="(min-width:1024px) 55vw, 1px" className="object-cover" />
        </div>
      )}
      <div aria-hidden className="absolute -top-32 left-[-10%] -z-10 size-[30rem] rounded-full bg-saffron/10 blur-[110px]" />
      <div aria-hidden className="bg-grid-light absolute inset-0 -z-10" />
      <div className="container-page py-20 sm:py-24 lg:py-28">
        <div className="max-w-3xl">
          <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white/80 px-4 py-1.5 text-xs font-medium tracking-wide text-slate backdrop-blur">
            <span className="size-1.5 rounded-full bg-saffron" />
            {eyebrow}
          </p>
          <h1 className="mt-7 font-heading text-4xl leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">{heading}</h1>
          {intro && (
            <p className="animate-rise mt-7 max-w-2xl text-lg leading-relaxed text-slate sm:text-xl" style={{ animationDelay: '240ms' }}>
              {intro}
            </p>
          )}
        </div>
        {children && (
          <div className="animate-rise" style={{ animationDelay: '360ms' }}>
            {children}
          </div>
        )}
      </div>
    </section>
  )
}

export function ArrowIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ExternalIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path d="M6 3H3v10h10v-3M9 3h4v4M13 3 7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Initials({ name, className = '' }: { name: string; className?: string }) {
  const initials = name
    .replace(/^(Dr|Mr|Ms|Mrs)\.?\s+/i, '')
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
  return (
    <div aria-hidden className={`flex items-center justify-center bg-navy font-heading text-4xl text-white ${className}`}>
      {initials}
    </div>
  )
}
