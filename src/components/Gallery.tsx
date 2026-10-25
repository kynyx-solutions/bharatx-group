'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

export type GalleryImage = {
  src: string
  full: string
  alt: string
  width: number
  height: number
  credit?: string | null
}

/** Photo grid; a click opens the photo full size in a dialog (arrow keys move, Esc closes). */
export function Gallery({ images, label }: { images: GalleryImage[]; label: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState<number | null>(null)

  const open = (i: number) => {
    setIndex(i)
    dialog.current?.showModal()
  }
  const close = () => dialog.current?.close()
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  )

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    const onClose = () => setIndex(null)
    el.addEventListener('keydown', onKey)
    el.addEventListener('close', onClose)
    return () => {
      el.removeEventListener('keydown', onKey)
      el.removeEventListener('close', onClose)
    }
  }, [step])

  const current = index === null ? null : images[index]

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {images.map((img, i) => (
          <li key={img.src}>
            <button
              type="button"
              onClick={() => open(i)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-sand"
            >
              <span className="sr-only">
                Open photo {i + 1} of {images.length}: {img.alt}
              </span>
              <Image
                src={img.src}
                alt=""
                fill
                sizes="(min-width:1024px) 30vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={label}
        className="m-auto max-h-[92vh] w-[min(92vw,1200px)] overflow-visible bg-transparent p-0 backdrop:bg-navy/85"
        onClick={(e) => e.target === dialog.current && close()}
      >
        {current && (
          <figure className="relative">
            <Image
              src={current.full}
              alt={current.alt}
              width={current.width}
              height={current.height}
              sizes="92vw"
              className="mx-auto max-h-[80vh] w-auto rounded-xl object-contain"
            />
            <figcaption className="mt-3 flex items-center justify-between gap-4 text-sm text-white">
              <span>
                {current.alt}
                {current.credit && (
                  <span className="text-white/60"> · Photo: {current.credit}</span>
                )}
              </span>
              <span className="shrink-0 text-white/60">
                {index! + 1} / {images.length}
              </span>
            </figcaption>
            <div className="absolute top-3 right-3 flex gap-2">
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="size-10 rounded-full bg-white/90 text-navy hover:bg-white"
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="size-10 rounded-full bg-white/90 text-navy hover:bg-white"
                    aria-label="Next photo"
                  >
                    ›
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={close}
                className="size-10 rounded-full bg-white/90 text-navy hover:bg-white"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </figure>
        )}
      </dialog>
    </>
  )
}
