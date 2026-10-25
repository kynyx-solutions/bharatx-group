'use server'

import { headers } from 'next/headers'
import { getSettings, payload } from './data'
import { pathways } from './options'

export type FormState = { ok: boolean; message: string; errors?: Record<string, string> }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// FR-4: a simple per-IP rate limit (5 submissions per 10 minutes per server instance).
const hits = new Map<string, number[]>()
function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 5
}

async function clientIp() {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
}

/** FR-4: Cloudflare Turnstile, enforced only when its secret key is configured. */
async function passesTurnstile(token: FormDataEntryValue | null, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (typeof token !== 'string' || !token) return false
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  }).catch(() => null)
  const data = (await res?.json().catch(() => null)) as { success?: boolean } | null
  return Boolean(data?.success)
}

async function failureMessage() {
  const s = await getSettings().catch(() => null)
  const reach = [s?.email, s?.phone].filter(Boolean).join(' or ')
  return `Sorry, we couldn't save your message. Please try again${reach ? `, or reach us at ${reach}` : ''}.`
}

const text = (fd: FormData, key: string, max = 200) => String(fd.get(key) ?? '').trim().slice(0, max)

export async function submitEnquiry(_prev: FormState, fd: FormData): Promise<FormState> {
  // Honeypot: real visitors never fill this hidden field.
  if (text(fd, 'website')) return { ok: true, message: 'Thank you.' }

  const data = {
    pathway: text(fd, 'pathway', 40),
    companySlug: text(fd, 'company', 100),
    name: text(fd, 'name', 120),
    email: text(fd, 'email', 200),
    phone: text(fd, 'phone', 40),
    organisation: text(fd, 'organisation', 200),
    message: text(fd, 'message', 5000),
    pageUrl: text(fd, 'pageUrl', 300),
  }

  const errors: Record<string, string> = {}
  if (!pathways.some((p) => p.value === data.pathway)) errors.pathway = 'Choose what your message is about.'
  if (data.name.length < 2) errors.name = 'Enter your name.'
  if (!EMAIL.test(data.email)) errors.email = 'Enter a valid email address.'
  if (data.message.length < 10) errors.message = 'Write a short message (at least 10 characters).'
  if (Object.keys(errors).length) return { ok: false, message: 'Please check the highlighted fields.', errors }

  const ip = await clientIp()
  if (rateLimited(ip)) return { ok: false, message: 'Too many messages from your connection. Please try again in a few minutes.' }
  if (!(await passesTurnstile(fd.get('cf-turnstile-response'), ip)))
    return { ok: false, message: 'Please complete the security check and try again.' }

  try {
    const p = await payload()
    let company: number | undefined
    if (data.companySlug) {
      const found = await p.find({
        collection: 'companies',
        where: { slug: { equals: data.companySlug } },
        limit: 1,
        depth: 0,
      })
      company = found.docs[0]?.id
    }
    // FR-2: saved to the database before success is shown.
    await p.create({
      collection: 'enquiries',
      overrideAccess: true,
      data: {
        pathway: data.pathway as (typeof pathways)[number]['value'],
        company,
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        organisation: data.organisation || undefined,
        message: data.message,
        pageUrl: data.pageUrl || undefined,
      },
    })
  } catch (err) {
    console.error('Enquiry could not be saved', err)
    return { ok: false, message: await failureMessage() }
  }

  const reply = pathways.find((p) => p.value === data.pathway)?.reply
  return {
    ok: true,
    message: `Thank you, ${data.name.split(' ')[0]}. Your message is saved and on its way to the right team. We aim to reply within ${reply}, and we've sent a confirmation to ${data.email}.`,
  }
}

// 4 MB: Vercel rejects request bodies over 4.5 MB.
const MAX_CV = 4 * 1024 * 1024

export async function submitApplication(_prev: FormState, fd: FormData): Promise<FormState> {
  if (text(fd, 'website')) return { ok: true, message: 'Thank you.' }

  const data = {
    jobId: Number(text(fd, 'jobId', 20)),
    name: text(fd, 'name', 120),
    email: text(fd, 'email', 200),
    phone: text(fd, 'phone', 40),
    linkedin: text(fd, 'linkedin', 300),
    note: text(fd, 'note', 3000),
  }
  const cv = fd.get('cv')

  const errors: Record<string, string> = {}
  if (data.name.length < 2) errors.name = 'Enter your name.'
  if (!EMAIL.test(data.email)) errors.email = 'Enter a valid email address.'
  if (data.linkedin && !/^https?:\/\/([a-z]+\.)?linkedin\.com\//i.test(data.linkedin))
    errors.linkedin = 'Enter a full LinkedIn profile link.'
  if (!(cv instanceof File) || cv.size === 0) errors.cv = 'Attach your CV as a PDF.'
  else if (cv.type !== 'application/pdf') errors.cv = 'Your CV must be a PDF file.'
  else if (cv.size > MAX_CV) errors.cv = 'Your CV must be 4 MB or smaller.'
  if (Object.keys(errors).length) return { ok: false, message: 'Please check the highlighted fields.', errors }

  const ip = await clientIp()
  if (rateLimited(ip)) return { ok: false, message: 'Too many submissions from your connection. Please try again in a few minutes.' }
  if (!(await passesTurnstile(fd.get('cf-turnstile-response'), ip)))
    return { ok: false, message: 'Please complete the security check and try again.' }

  try {
    const p = await payload()
    const job = await p.findByID({ collection: 'jobs', id: data.jobId, depth: 0 })
    if (!job || job._status !== 'published' || new Date(job.closingDate) < new Date(new Date().setHours(0, 0, 0, 0)))
      return { ok: false, message: 'This role is no longer open.' }

    const file = cv as File
    const stored = await p.create({
      collection: 'cv-files',
      overrideAccess: true,
      data: {},
      file: {
        data: Buffer.from(await file.arrayBuffer()),
        mimetype: 'application/pdf',
        name: `${data.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${Date.now()}.pdf`,
        size: file.size,
      },
    })
    await p.create({
      collection: 'applications',
      overrideAccess: true,
      data: {
        job: job.id,
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        linkedin: data.linkedin || undefined,
        note: data.note || undefined,
        cv: stored.id,
      },
    })
  } catch (err) {
    console.error('Application could not be saved', err)
    return { ok: false, message: await failureMessage() }
  }

  return {
    ok: true,
    message: `Thank you, ${data.name.split(' ')[0]}. Your application is saved, and we've sent a confirmation to ${data.email}.`,
  }
}
