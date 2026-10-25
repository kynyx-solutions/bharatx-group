const paths: Record<string, string> = {
  // bridge
  infrastructure: 'M3 17h18M5 17V9m14 8V9M3 9c3 0 6-3 9-3s6 3 9 3M9 17v-4m6 4v-4',
  // leaf
  agriculture: 'M5 19c0-8 5-13 14-14 0 9-5 14-13 14M5 19l7-7',
  // gear
  manufacturing:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.3l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-2.2-1.3L14.4 3h-4l-.4 2.4a7.6 7.6 0 0 0-2.2 1.3l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.6l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 0 0 2.2 1.3l.4 2.4h4l.4-2.4a7.6 7.6 0 0 0 2.2-1.3l2.4 1 2-3.4-2-1.6c.1-.4.1-.9.1-1.3Z',
  // box
  packaging: 'M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Zm0 0 9 4.5m0 0 9-4.5M12 12v9',
  // chip
  technology: 'M8 8h8v8H8zM5 5h14v14H5zM9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3',
  // rocket
  ventures: 'M14 4c3 0 6 3 6 6l-7 7-6-6 7-7Zm-7 7-3 1 2 2m6 6 1-3m-2-8a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0M5 19l3-3',
  // hands / heart
  foundation: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
}

export function SectorIcon({ sector, className = 'size-5' }: { sector: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d={paths[sector] ?? paths.ventures} />
    </svg>
  )
}
