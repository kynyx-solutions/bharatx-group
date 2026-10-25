import type { Metadata } from 'next'
import { Credentials } from '@/components/Credentials'
import { PageHero } from '@/components/ui'
import { getPartnerships } from '@/lib/data'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Partnerships and programmes',
  description: 'Programmes, MoUs and collaborations between BharatX Group businesses and India’s government bodies, institutions and public-sector companies.',
  alternates: { canonical: '/partnerships' },
}

export default async function PartnershipsPage() {
  const items = await getPartnerships()
  return (
    <>
      <PageHero
        eyebrow="Partnerships and programmes"
        title="Working with India's institutions."
        highlight="India's institutions."
        intro="Programmes, MoUs and collaborations with government, leading institutions and public-sector companies, on AI adoption and skills."
      />
      <section className="container-page py-16">
        <Credentials items={items} />
      </section>
    </>
  )
}
