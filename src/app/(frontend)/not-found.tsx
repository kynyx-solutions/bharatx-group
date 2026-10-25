import { ButtonLink } from '@/components/ui'

export default function NotFound() {
  return (
    <section className="container-page py-28 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 text-4xl sm:text-5xl">We couldn&apos;t find that page.</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-slate">It may have moved. Try one of these instead.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Home</ButtonLink>
        <ButtonLink href="/businesses" variant="secondary">
          Our businesses
        </ButtonLink>
        <ButtonLink href="/contact" variant="secondary">
          Contact
        </ButtonLink>
      </div>
    </section>
  )
}
