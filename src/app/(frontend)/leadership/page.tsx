import type { Metadata } from 'next'
import { PersonCard } from '@/components/PersonCard'
import { PageHero, SectionHeading } from '@/components/ui'
import { asCompany, getPeople } from '@/lib/data'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Leadership',
  description: 'The people who lead BharatX Group and its businesses.',
  alternates: { canonical: '/leadership' },
}

export default async function LeadershipPage() {
  const people = await getPeople()
  const group = people.filter((p) => p.team === 'group')
  const companyHeads = people.filter((p) => p.team === 'company')
  const foundation = people.filter((p) => p.team === 'foundation')

  return (
    <>
      <PageHero
        eyebrow="Leadership"
        title="The people building BharatX."
        highlight="building BharatX."
        image="/placeholders/pages/leadership.webp"
        intro="Experience across technology, operations, manufacturing and research — focused on building businesses that last."
      />
      <section className="container-page py-20" aria-labelledby="group-heading">
        <SectionHeading id="group-heading" title="Group leadership" />
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {group.map((p) => (
            <PersonCard key={p.id} person={p} full />
          ))}
        </div>
      </section>
      {companyHeads.length > 0 && (
        <section className="border-t border-line bg-sand/50 py-20" aria-labelledby="company-heading">
          <div className="container-page">
            <SectionHeading id="company-heading" title="Leading our businesses" />
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {companyHeads.map((p) => (
                <div key={p.id}>
                  {asCompany(p.company) && <p className="eyebrow mb-3">{asCompany(p.company)!.name}</p>}
                  <PersonCard person={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {foundation.length > 0 && (
        <section className="container-page py-20" aria-labelledby="foundation-heading">
          <SectionHeading id="foundation-heading" title="BharatX Labs Foundation" />
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {foundation.map((p) => (
              <PersonCard key={p.id} person={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
