import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'
import { getSettings } from '@/lib/data'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How BharatX Group collects, uses and protects personal data, under the Digital Personal Data Protection Act, 2023.',
  alternates: { canonical: '/privacy' },
}

export default async function PrivacyPage() {
  const s = await getSettings()
  const g = s.grievanceOfficer
  return (
    <LegalPage title="Privacy policy">
      <p>
        This policy explains how BharatX Group (&ldquo;we&rdquo;) handles personal data collected through
        bharatxgroup.org, in line with India&apos;s Digital Personal Data Protection Act, 2023 (DPDP Act).
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>Details you send through our forms: name, email, phone, organisation and your message.</li>
        <li>For job applications: your CV, LinkedIn profile and any note you add.</li>
        <li>Basic, privacy-friendly usage statistics that do not identify you.</li>
      </ul>
      <h2>Why we use it</h2>
      <p>
        We use your data only to reply to your enquiry, route it to the right BharatX business, or consider your job
        application. By submitting a form, you consent to this use. We do not sell your data or use it for unrelated
        marketing.
      </p>
      <h2>Who can see it</h2>
      <p>
        Only the team responsible for your enquiry, and service providers that host our website and send our emails,
        under contracts that protect your data. CVs are stored privately and are visible only to our hiring team.
      </p>
      <h2>How long we keep it</h2>
      <p>We keep enquiries and applications for 24 months, then delete them, unless the law requires us to keep them longer.</p>
      <h2>Your rights</h2>
      <p>
        You can ask to see, correct or delete your personal data, or withdraw your consent, by writing to our Grievance
        Officer below. We will respond within the time the DPDP Act requires.
      </p>
      <h2>Grievance Officer</h2>
      {g?.name || g?.email ? (
        <p>
          {g.name}
          {g.email && (
            <>
              <br />
              Email: <a href={`mailto:${g.email}`}>{g.email}</a>
            </>
          )}
          {g.phone && (
            <>
              <br />
              Phone: {g.phone}
            </>
          )}
        </p>
      ) : (
        <p>
          Write to us through the <a href="/contact">contact page</a>.
        </p>
      )}
    </LegalPage>
  )
}
