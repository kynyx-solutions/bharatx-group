'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Background video for the home hero. Muted, looping, no sound.
 * Visitors who prefer reduced motion get the still poster; everyone gets a pause button (WCAG 2.2.2).
 */
export function HeroVideo({ sources, poster }: { sources: { src: string; type: string }[]; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    video.play().then(
      () => setPlaying(true),
      () => setPlaying(false), // autoplay blocked: the poster stays
    )
  }, [])

  const toggle = () => {
    const video = ref.current
    if (!video) return
    if (video.paused) video.play().then(() => setPlaying(true), () => {})
    else {
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 -z-30 size-full object-cover"
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      >
        {sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
      <button
        type="button"
        onClick={toggle}
        className="absolute right-4 bottom-24 z-10 inline-flex size-10 items-center justify-center rounded-full border border-white/25 bg-navy/40 text-white backdrop-blur transition-colors hover:bg-navy/70 sm:right-8"
      >
        <span className="sr-only">{playing ? 'Pause background video' : 'Play background video'}</span>
        <svg viewBox="0 0 16 16" className="size-4" aria-hidden fill="currentColor">
          {playing ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M5 3l8 5-8 5z" />}
        </svg>
      </button>
    </>
  )
}
