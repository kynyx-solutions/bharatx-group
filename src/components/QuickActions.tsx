import Link from 'next/link'
import { ArrowIcon } from './ui'

/** Mahindra-style shortcuts: send each visitor straight to their task (PRD section 3 journeys). */
const actions = [
  {
    href: '/contact?pathway=business',
    title: 'Get a quote',
    text: 'Products and services from any of our businesses',
    icon: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
  },
  {
    href: '/contact?pathway=partnerships',
    title: 'Partner with us',
    text: 'Joint projects, institutions and CSR',
    icon: 'M3 12l4-4 4 3 3-3 7 6-5 5-4-3-2 2zM7 8l-4 4m14-4 4 4',
  },
  {
    href: '/contact?pathway=founders',
    title: 'Build with us',
    text: 'Founders and growing businesses',
    icon: 'M14 4c3 0 6 3 6 6l-7 7-6-6 7-7Zm-7 7-3 1 2 2m6 6 1-3m-2-8a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0',
  },
  {
    href: '/careers',
    title: 'Join our team',
    text: 'Careers across the Group',
    icon: 'M4 8h16v11H4zM9 8V5h6v3M4 13h16',
  },
]

export function QuickActions() {
  return (
    <nav aria-label="Quick actions" className="relative z-10 border-b border-line bg-white">
      <ul className="container-page grid divide-line sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
        {actions.map((a) => (
          <li key={a.href} className="border-b border-line last:border-b-0 sm:border-b-0">
            <Link
              href={a.href}
              className="group flex h-full items-center gap-4 px-2 py-6 no-underline transition-colors hover:bg-sand/60 sm:px-6"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy text-saffron-light transition-colors group-hover:bg-saffron group-hover:text-navy">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-5">
                  <path d={a.icon} />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-navy">{a.title}</span>
                <span className="block text-sm text-slate">{a.text}</span>
              </span>
              <ArrowIcon className="size-4 shrink-0 text-slate transition-transform group-hover:translate-x-1 group-hover:text-navy" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
