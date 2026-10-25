'use client'

import Script from 'next/script'
import { useActionState, useEffect, useRef, useState, type ReactNode } from 'react'
import { submitApplication, submitEnquiry, type FormState } from '@/lib/actions'

const initial: FormState = { ok: false, message: '' }
const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

const inputClass =
  'mt-2 block w-full rounded-lg border border-line bg-white px-4 py-3 text-base text-navy placeholder:text-slate/60 focus:border-blue focus:outline-none aria-[invalid=true]:border-saffron-text'

function Field({
  label,
  name,
  error,
  optional,
  hint,
  children,
}: {
  label: string
  name: string
  error?: string
  optional?: boolean
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold">
        {label} {optional && <span className="font-normal text-slate">(optional)</span>}
      </label>
      {hint && (
        <p id={`${name}-hint`} className="mt-1 text-sm text-slate">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm font-medium text-saffron-text">
          {error}
        </p>
      )}
    </div>
  )
}

const describedBy = (name: string, state: FormState, hint?: boolean) =>
  [hint && `${name}-hint`, state.errors?.[name] && `${name}-error`].filter(Boolean).join(' ') || undefined

function Status({ state }: { state: FormState }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (state.message) ref.current?.focus()
  }, [state])
  if (!state.message) return null
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role={state.ok ? 'status' : 'alert'}
      className={`rounded-lg p-4 text-sm leading-relaxed ${state.ok ? 'bg-green/10 text-green-deep' : 'bg-saffron/10 text-saffron-text'}`}
    >
      {state.message}
    </div>
  )
}

function Turnstile() {
  if (!turnstileKey) return null
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div className="cf-turnstile" data-sitekey={turnstileKey} />
    </>
  )
}

// Hidden from people; bots that fill every field are ignored.
const Honeypot = () => (
  <div aria-hidden className="absolute -left-[9999px]">
    <label>
      Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
    </label>
  </div>
)

export function EnquiryForm({
  pathways,
  companies,
  defaultPathway,
  defaultCompany,
}: {
  pathways: { value: string; label: string; reply: string }[]
  companies: { slug: string; name: string }[]
  defaultPathway?: string
  defaultCompany?: string
}) {
  const [state, action, pending] = useActionState(submitEnquiry, initial)
  const [pathway, setPathway] = useState(defaultPathway || '')
  const [pageUrl, setPageUrl] = useState('')
  useEffect(() => setPageUrl(window.location.href), [])

  if (state.ok) return <Status state={state} />

  return (
    <form action={action} className="relative space-y-6" noValidate>
      <Status state={state} />
      <Honeypot />
      <input type="hidden" name="pageUrl" value={pageUrl} />
      <Field label="What is this about?" name="pathway" error={state.errors?.pathway}>
        <select
          id="pathway"
          name="pathway"
          required
          value={pathway}
          onChange={(e) => setPathway(e.target.value)}
          aria-invalid={Boolean(state.errors?.pathway)}
          aria-describedby={describedBy('pathway', state)}
          className={inputClass}
        >
          <option value="" disabled>
            Choose one
          </option>
          {pathways.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </Field>
      {pathway === 'business' && (
        <Field label="Which business?" name="company" optional>
          <select id="company" name="company" defaultValue={defaultCompany || ''} className={inputClass}>
            <option value="">Not sure / the Group</option>
            {companies.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" name="name" error={state.errors?.name}>
          <input id="name" name="name" autoComplete="name" required aria-invalid={Boolean(state.errors?.name)} aria-describedby={describedBy('name', state)} className={inputClass} />
        </Field>
        <Field label="Email" name="email" error={state.errors?.email}>
          <input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(state.errors?.email)} aria-describedby={describedBy('email', state)} className={inputClass} />
        </Field>
        <Field label="Phone" name="phone" optional>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
        </Field>
        <Field label="Organisation" name="organisation" optional>
          <input id="organisation" name="organisation" autoComplete="organization" className={inputClass} />
        </Field>
      </div>
      <Field label="Message" name="message" error={state.errors?.message}>
        <textarea id="message" name="message" rows={6} required aria-invalid={Boolean(state.errors?.message)} aria-describedby={describedBy('message', state)} className={inputClass} />
      </Field>
      <Turnstile />
      <p className="text-sm text-slate">
        We use your details only to reply to this message. See our{' '}
        <a href="/privacy" className="text-blue underline decoration-blue/40 underline-offset-4 hover:decoration-blue">
          privacy policy
        </a>
        .
      </p>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-saffron px-8 font-semibold text-navy transition-colors hover:bg-saffron-light disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}

export function ApplyForm({ jobId }: { jobId: number }) {
  const [state, action, pending] = useActionState(submitApplication, initial)
  if (state.ok) return <Status state={state} />

  return (
    <form action={action} className="relative space-y-6" noValidate>
      <Status state={state} />
      <Honeypot />
      <input type="hidden" name="jobId" value={jobId} />
      <Field label="Your name" name="name" error={state.errors?.name}>
        <input id="name" name="name" autoComplete="name" required aria-invalid={Boolean(state.errors?.name)} aria-describedby={describedBy('name', state)} className={inputClass} />
      </Field>
      <Field label="Email" name="email" error={state.errors?.email}>
        <input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(state.errors?.email)} aria-describedby={describedBy('email', state)} className={inputClass} />
      </Field>
      <Field label="Phone" name="phone" optional>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
      </Field>
      <Field label="LinkedIn profile" name="linkedin" optional error={state.errors?.linkedin}>
        <input id="linkedin" name="linkedin" type="url" placeholder="https://www.linkedin.com/in/…" aria-invalid={Boolean(state.errors?.linkedin)} aria-describedby={describedBy('linkedin', state)} className={inputClass} />
      </Field>
      <Field label="CV" name="cv" hint="PDF, up to 4 MB. Stored privately." error={state.errors?.cv}>
        <input
          id="cv"
          name="cv"
          type="file"
          accept="application/pdf"
          required
          aria-invalid={Boolean(state.errors?.cv)}
          aria-describedby={describedBy('cv', state, true)}
          className={`${inputClass} file:mr-4 file:rounded-full file:border-0 file:bg-sand file:px-4 file:py-2 file:text-sm file:font-semibold`}
        />
      </Field>
      <Field label="Anything you'd like to add?" name="note" optional>
        <textarea id="note" name="note" rows={4} className={inputClass} />
      </Field>
      <Turnstile />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-saffron px-8 font-semibold text-navy transition-colors hover:bg-saffron-light disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Submit application'}
      </button>
    </form>
  )
}
