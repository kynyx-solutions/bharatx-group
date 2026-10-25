import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowIcon, ButtonLink, PageHero, SectionHeading } from '@/components/ui'
import { asCompany, getOpenJobs, getSettings } from '@/lib/data'
import { fullDate } from '@/lib/format'
import { jobTypes } from '@/lib/options'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Open roles across BharatX Group and its businesses.',
  alternates: { canonical: '/careers' },
}

// Career areas in the operating sectors (prototype copy, approved in content/prototype-copy.md).
const careerAreas = [
  { area: 'Infrastructure', roles: 'Civil engineering · Project management · Site operations · Procurement' },
  { area: 'Manufacturing', roles: 'Production · Quality · Supply chain' },
  { area: 'Agriculture and exports', roles: 'Sourcing · Quality · Export operations' },
  { area: 'AI and technology', roles: 'Engineering · Data · AI training' },
  { area: 'Group functions', roles: 'Finance · Strategy · Sales · People' },
]

const values = [
  { title: 'Ownership', text: 'Take responsibility. Make decisions. Create outcomes.' },
  { title: 'Learning', text: 'Work across industries and keep building new capabilities.' },
  { title: 'Execution', text: 'Turn ideas into measurable results.' },
  { title: 'Impact', text: 'See how your work helps businesses, people and communities.' },
]

export default async function CareersPage() {
  const [jobs, settings] = await Promise.all([getOpenJobs(), getSettings()])

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build what matters."
        highlight="matters."
        image="/placeholders/pages/careers.webp"
        intro="BharatX is a place for people who want to take ownership, solve meaningful problems and see their work create real-world impact."
      />

      <section className="container-page py-20" aria-labelledby="roles-heading">
        <SectionHeading id="roles-heading" eyebrow="Open roles" title={jobs.length ? `${jobs.length} open ${jobs.length === 1 ? 'role' : 'roles'}` : 'No open roles right now'} />
        {jobs.length > 0 ? (
          <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
            {jobs.map((job) => (
              <li key={job.id} className="relative flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl">
                    <Link href={`/careers/${job.slug}`} className="no-underline after:absolute after:inset-0 hover:underline">
                      {job.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-slate">
                    {[asCompany(job.company)?.name ?? 'BharatX Group', job.location, jobTypes.find((t) => t.value === job.type)?.label]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
                <p className="flex items-center gap-2 text-sm text-slate">
                  Apply by {fullDate(job.closingDate)} <ArrowIcon />
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="flex flex-col rounded-2xl border border-line bg-white p-8">
              <h3 className="text-2xl">Introduce yourself</h3>
              <p className="mt-3 flex-1 text-slate">
                Don&apos;t see a role? We are always interested in meeting talented people who want to build with us.
              </p>
              <ButtonLink href="/contact?pathway=careers" variant="secondary" className="mt-6 self-start">
                Get in touch <ArrowIcon />
              </ButtonLink>
            </div>
            <div className="rounded-2xl border border-line bg-white p-8">
              <h3 className="text-2xl">Where you could work</h3>
              <dl className="mt-4 space-y-3 text-sm">
                {careerAreas.map((a) => (
                  <div key={a.area}>
                    <dt className="font-semibold text-navy">{a.area}</dt>
                    <dd className="text-slate">{a.roles}</dd>
                  </div>
                ))}
              </dl>
            </div>
            {settings.fraudNotice && (
              <div className="rounded-2xl border border-saffron/30 bg-saffron/10 p-8">
                <h3 className="text-2xl">Beware of job fraud</h3>
                <p className="mt-3 text-saffron-text">{settings.fraudNotice}</p>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="border-y border-line bg-sand/60 py-20" aria-labelledby="values-heading">
        <div className="container-page">
          <SectionHeading
            id="values-heading"
            eyebrow="How we work"
            title="More than a job. A chance to build."
            intro="We value initiative over hierarchy and outcomes over activity."
          />
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <li key={v.title} className="border-l-2 border-saffron pl-5">
                <h3 className="text-xl">{v.title}</h3>
                <p className="mt-2 text-slate">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {jobs.length > 0 && settings.fraudNotice && (
        <section className="container-page pt-16">
          <p className="rounded-xl bg-saffron/10 p-5 text-saffron-text">
            <strong>Fraud notice:</strong> {settings.fraudNotice}
          </p>
        </section>
      )}
    </>
  )
}
