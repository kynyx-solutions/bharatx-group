import type { Person } from '@/payload-types'
import { asMedia } from '@/lib/data'
import { MediaImage } from './MediaImage'
import { ExternalIcon, Initials } from './ui'

/**
 * Cards show the short bio (kept to ~200 characters so cards line up);
 * with `full`, the complete bio opens below under "Read full bio".
 */
export function PersonCard({ person, full = false }: { person: Person; full?: boolean }) {
  const photo = asMedia(person.photo)
  const hasMore = full && (person.bio || (person.otherRoles && person.otherRoles.length > 0))

  return (
    <article className="flex h-full flex-col">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand">
        {photo ? (
          <MediaImage media={photo} fill size="card" sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover object-top" />
        ) : (
          <Initials name={person.name} className="absolute inset-0" />
        )}
      </div>
      <h3 className="mt-5 text-xl">{person.name}</h3>
      {/* Room for two lines, so bios start at the same height across a row. */}
      <p className="mt-1 min-h-10 text-sm font-medium text-saffron-text">{person.role}</p>
      <p className="mt-3 flex-1 leading-relaxed text-slate">{person.shortBio}</p>

      {(person.linkedin || hasMore) && (
        <div className="mt-5 border-t border-line pt-4 text-sm">
          {person.linkedin && (
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 font-semibold text-blue no-underline hover:underline"
            >
              LinkedIn <ExternalIcon />
              <span className="sr-only">profile of {person.name} (opens in a new tab)</span>
            </a>
          )}
          {hasMore && (
            <details className="group mt-3">
              <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 font-semibold text-navy [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">Read full bio</span>
                <span className="hidden group-open:inline">Hide full bio</span>
                <svg viewBox="0 0 16 16" className="size-3.5 transition-transform group-open:rotate-180" aria-hidden fill="none">
                  <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              {person.bio && <p className="mt-3 whitespace-pre-line leading-relaxed text-slate">{person.bio}</p>}
              {person.otherRoles && person.otherRoles.length > 0 && (
                <ul className="mt-3 text-slate">
                  {person.otherRoles.map((r) => (
                    <li key={r.id}>Also {r.role}</li>
                  ))}
                </ul>
              )}
            </details>
          )}
        </div>
      )}
    </article>
  )
}
