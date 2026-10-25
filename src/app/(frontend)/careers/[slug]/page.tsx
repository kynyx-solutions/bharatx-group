import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ApplyForm } from '@/components/forms'
import { asCompany, getJob, getOpenJobs, getSettings } from '@/lib/data'
import { fullDate, siteUrl } from '@/lib/format'
import { jobTypes } from '@/lib/options'

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getOpenJobs()).map((j) => ({ slug: j.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJob((await params).slug)
  if (!job) return {}
  return { title: job.title, description: job.summary, alternates: { canonical: `/careers/${job.slug}` } }
}

export default async function JobPage({ params }: Props) {
  const [job, settings] = await Promise.all([getJob((await params).slug), getSettings()])
  if (!job) notFound()
  const company = asCompany(job.company)
  const typeLabel = jobTypes.find((t) => t.value === job.type)?.label

  const posting = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.summary,
    datePosted: job.createdAt,
    validThrough: job.closingDate,
    employmentType: job.type.toUpperCase().replace('-', '_'),
    hiringOrganization: { '@type': 'Organization', name: company?.name ?? 'BharatX Group', sameAs: siteUrl },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: job.location, addressCountry: 'IN' } },
  }

  return (
    <div className="container-page grid gap-16 py-16 lg:grid-cols-12">
      <article className="lg:col-span-7">
        <Link href="/careers" className="text-sm font-semibold text-blue no-underline hover:underline">
          ← All roles
        </Link>
        <h1 className="mt-6 text-4xl leading-tight sm:text-5xl">{job.title}</h1>
        <p className="mt-4 text-slate">
          {[company?.name ?? 'BharatX Group', job.location, typeLabel].filter(Boolean).join(' · ')} · Apply by{' '}
          {fullDate(job.closingDate)}
        </p>
        <p className="mt-8 text-xl leading-relaxed text-slate">{job.summary}</p>
        <RichText data={job.description} className="prose-bx mt-8" />
        {settings.fraudNotice && (
          <p className="mt-10 rounded-xl bg-saffron/10 p-4 text-sm text-saffron-text">
            <strong>Fraud notice:</strong> {settings.fraudNotice}
          </p>
        )}
      </article>
      <section className="lg:col-span-5" aria-labelledby="apply-heading">
        <div className="rounded-2xl border border-line bg-white p-6 sm:p-8 lg:sticky lg:top-32">
          <h2 id="apply-heading" className="mb-6 text-2xl">
            Apply for this role
          </h2>
          <ApplyForm jobId={job.id} />
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(posting).replace(/</g, '\\u003c') }} />
    </div>
  )
}
