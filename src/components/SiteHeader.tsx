'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export const nav = [
  { href: '/about', label: 'About' },
  { href: '/businesses', label: 'Businesses' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/foundation', label: 'Foundation' },
  { href: '/news', label: 'Newsroom' },
  { href: '/careers', label: 'Careers' },
]

export function SiteHeader({ showNews = true }: { showNews?: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  const items = showNews ? nav : nav.filter((item) => item.href !== '/news')

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/85">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <div className="container-page flex h-20 items-center justify-between gap-6 lg:h-24">
        <Link href="/" className="shrink-0" aria-label="BharatX Group home">
          <Image
            src="/brand/bharatx-group-logo-640.webp"
            alt="BharatX Group"
            width={136}
            height={88}
            loading="eager"
            className="h-16 w-auto lg:h-[88px]"
          />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`rounded-full px-3.5 py-2 text-base font-medium no-underline transition-colors hover:bg-sand ${
                    isActive(item.href) ? 'text-navy underline decoration-saffron decoration-2' : 'text-slate'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="inline-flex size-11 items-center justify-center rounded-full text-navy transition-colors hover:bg-sand"
          >
            <span className="sr-only">Search</span>
            <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden>
              <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="m13.5 13.5 3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href="/contact"
            className="hidden min-h-11 items-center rounded-full bg-navy px-5 text-sm font-semibold text-white no-underline transition-colors hover:bg-navy-soft sm:inline-flex"
          >
            Contact us
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-line bg-ivory lg:hidden">
          <ul className="container-page flex flex-col py-3">
            {[...items, { href: '/contact', label: 'Contact us' }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className="block border-b border-line/70 py-3.5 text-lg font-medium text-navy no-underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
