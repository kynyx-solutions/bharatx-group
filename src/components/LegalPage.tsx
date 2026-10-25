import type { ReactNode } from 'react'

export function LegalPage({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <article className="container-narrow py-16">
      <h1 className="text-4xl sm:text-5xl">{title}</h1>
      {updated && <p className="mt-3 text-sm text-slate">Last updated: {updated}</p>}
      {process.env.NODE_ENV !== 'production' && (
        <p className="mt-6 rounded-lg bg-saffron/10 p-4 text-sm text-saffron-text">
          Draft wording. A lawyer must review this page before launch (PRD section 8).
        </p>
      )}
      <div className="prose-bx mt-10">{children}</div>
    </article>
  )
}
