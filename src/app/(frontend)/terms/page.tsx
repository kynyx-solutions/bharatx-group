import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Terms of use',
  description: 'Terms for using bharatxgroup.org.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use">
      <p>By using bharatxgroup.org you agree to these terms.</p>
      <h2>Information on this site</h2>
      <p>
        We work to keep the information on this site accurate and dated. Figures are shown with the date they apply to.
        The site is for general information and is not an offer of securities or a binding quotation; quotes and
        contracts are issued by the relevant BharatX business in writing.
      </p>
      <h2>Group businesses</h2>
      <p>
        Each BharatX business is a separate entity responsible for its own products, services and contracts. Their legal
        details are listed on our <a href="/corporate-information">corporate information</a> page.
      </p>
      <h2>Trademarks and content</h2>
      <p>
        The BharatX Group name, logo and content on this site belong to BharatX Group or its businesses. You may share
        links and quote short extracts with credit. Other use needs our written permission.
      </p>
      <h2>Links to other sites</h2>
      <p>We link to our businesses&apos; own websites and to news sources. We are not responsible for other sites&apos; content.</p>
      <h2>Fraud</h2>
      <p>
        BharatX Group never charges fees for jobs, interviews or vendor registration. Do not pay anyone who asks for money
        in our name, and report it to us through the <a href="/contact">contact page</a>.
      </p>
      <h2>Law</h2>
      <p>These terms are governed by the laws of India. Courts in New Delhi have jurisdiction.</p>
    </LegalPage>
  )
}
