import Image from 'next/image'
import type { Media } from '@/payload-types'

type Size = 'thumb' | 'card' | 'hero'

/** Renders a CMS image, picking the generated size closest to the slot. */
export function MediaImage({
  media,
  size = 'card',
  className,
  sizes,
  lcp,
  fill,
}: {
  media: Media | null
  size?: Size
  className?: string
  sizes?: string
  /** The page's main (LCP) image: load it straight away at high priority. */
  lcp?: boolean
  fill?: boolean
}) {
  if (!media?.url) return null
  const variant = media.sizes?.[size]
  // Payload returns absolute URLs when serverURL is set; serve them as same-origin paths.
  const src = (variant?.url || media.url).replace(/^https?:\/\/[^/]+/, '')
  const width = variant?.width || media.width || 1200
  const height = variant?.height || media.height || 800
  return fill ? (
    <Image src={src} alt={media.alt} fill sizes={sizes} className={className} loading={lcp ? 'eager' : undefined} fetchPriority={lcp ? 'high' : undefined} />
  ) : (
    <Image src={src} alt={media.alt} width={width} height={height} sizes={sizes} className={className} loading={lcp ? 'eager' : undefined} fetchPriority={lcp ? 'high' : undefined} />
  )
}
