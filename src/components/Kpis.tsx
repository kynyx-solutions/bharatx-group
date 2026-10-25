import { monthYear } from '@/lib/format'

type Kpi = { id?: string | null; value: string; label: string; asOf: string; source: string; verified?: boolean | null }

const cols = ['lg:grid-cols-1', 'lg:grid-cols-2', 'lg:grid-cols-3', 'lg:grid-cols-4']

/** Shows only verified numbers, each with its "as of" date (FR-10). */
export function Kpis({ items, tone = 'light', className = '' }: { items: Kpi[]; tone?: 'light' | 'dark'; className?: string }) {
  const rows = items.filter((k) => k.verified)
  if (rows.length === 0) return null
  return (
    <dl className={`grid gap-6 sm:grid-cols-2 ${cols[Math.min(rows.length, 4) - 1]} ${className}`}>
      {rows.map((k, i) => (
        <div key={k.id ?? i} className={`border-t pt-4 ${tone === 'dark' ? 'border-white/20' : 'border-line'}`}>
          <dt className="sr-only">{k.label}</dt>
          <dd className={`font-heading text-4xl ${tone === 'dark' ? 'text-white' : 'text-navy'}`}>{k.value}</dd>
          <dd className={`mt-1 ${tone === 'dark' ? 'text-white/80' : 'text-slate'}`}>{k.label}</dd>
          <dd className={`mt-2 text-xs ${tone === 'dark' ? 'text-white/55' : 'text-slate/80'}`}>
            As of {monthYear(k.asOf)} · {k.source}
          </dd>
        </div>
      ))}
    </dl>
  )
}
