const tz = 'Asia/Kolkata'

export const monthYear = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { month: 'short', year: 'numeric', timeZone: tz }) : ''

export const fullDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: tz }) : ''

export const telHref = (phone?: string | null) => (phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : undefined)

export const whatsappHref = (digits?: string | null, text?: string) =>
  digits ? `https://wa.me/${digits.replace(/\D/g, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}` : undefined

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bharatxgroup.org').replace(/\/$/, '')

export const hostOf = (url?: string | null) => {
  if (!url) return ''
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return url
  }
}
