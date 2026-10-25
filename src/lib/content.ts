/** Fixed copy shared by several pages (approved in content/prototype-copy.md). */

export type StorySector = 'infrastructure' | 'agriculture' | 'manufacturing' | 'packaging' | 'technology' | 'ventures' | 'foundation'

/**
 * "A day in India": where each sector shows up in an ordinary Indian's day.
 * Describes what the products and services do, not claimed impact (PRD section 4).
 * Images are placeholders from the prototype; replace with real photos before launch.
 */
export const dayInIndia: {
  sector: StorySector
  moment: string
  title: string
  text: string
  image: string
  href: string
  cta: string
}[] = [
  {
    sector: 'infrastructure',
    moment: 'The journey to work',
    title: 'Roads and bridges that connect India',
    text: 'Every morning, millions of Indians set out for work, school and the market. We build the roads, bridges, civil works and power infrastructure that carry them there.',
    image: '/placeholders/sectors/infrastructure.webp',
    href: '/businesses#infrastructure',
    cta: 'Our infrastructure business',
  },
  {
    sector: 'agriculture',
    moment: 'Breakfast',
    title: 'From Indian farms to plates around the world',
    text: 'Makhana from Bihar, moringa from the South, and more from Indian farms. We add value to Indian produce and take it to markets in India and abroad.',
    image: '/placeholders/sectors/agriculture.webp',
    href: '/businesses#agriculture',
    cta: 'Our agriculture business',
  },
  {
    sector: 'manufacturing',
    moment: 'At the hospital and the factory',
    title: 'Made in India, moving India',
    text: 'The hospital bed wheeled into a ward, the trolley on a factory floor, the chair you sit on at work — they all roll on castors. We design and make them in India.',
    image: '/placeholders/sectors/manufacturing.webp',
    href: '/businesses#manufacturing',
    cta: 'Our manufacturing business',
  },
  {
    sector: 'packaging',
    moment: 'A parcel at the door',
    title: 'Packaging that gets goods home safely',
    text: 'Corrugated boxes, cushioning and bulk containers keep products safe on the long road from the factory to your doorstep.',
    image: '/placeholders/sectors/packaging.webp',
    href: '/businesses#packaging',
    cta: 'Our packaging business',
  },
  {
    sector: 'technology',
    moment: 'On the phone, at the counter',
    title: 'AI that works for Indian businesses',
    text: 'From voice assistants that answer customers to automation that cuts paperwork, we help businesses serve people faster — and we train young Indians in AI.',
    image: '/placeholders/sectors/technology.webp',
    href: '/businesses#technology',
    cta: 'Our technology businesses',
  },
  {
    sector: 'ventures',
    moment: 'The business down the street',
    title: 'Backing the next Indian enterprise',
    text: 'Behind every growing business is a founder who took a risk. We help founders and small businesses build, fund and scale what they started.',
    image: '/placeholders/sectors/ventures.webp',
    href: '/businesses#ventures',
    cta: 'Our venture-building business',
  },
  {
    sector: 'foundation',
    moment: 'In the community',
    title: 'Giving back to the places we work',
    text: 'Through our not-for-profit foundation, we invest in education and skills, research, and a cleaner environment through waste management and recycling.',
    image: '/placeholders/sectors/foundation.webp',
    href: '/foundation',
    cta: 'Our CSR foundation',
  },
]

/** Order of sectors on the Businesses page: technology first (positioning, 24 Oct 2026), then the day's order. */
export const sectorOrder: StorySector[] = ['technology', 'infrastructure', 'manufacturing', 'agriculture', 'packaging', 'ventures']

/** One-line introduction per sector, used on the Businesses page. */
export const sectorIntro: Record<string, string> = Object.fromEntries(
  dayInIndia.map((d) => [d.sector, d.text]),
)

// PRD section 4: "Our role in Viksit Bharat @2047". Named by sector; company names live on /businesses.
export const viksitBharat: { goal: string; what: string; sector: StorySector; href: string }[] = [
  { goal: 'World-class infrastructure', what: 'Roads, bridges and civil works', sector: 'infrastructure', href: '/businesses#infrastructure' },
  { goal: 'Prosperous farmers', what: 'Value addition and exports for Indian produce', sector: 'agriculture', href: '/businesses#agriculture' },
  { goal: 'Make in India', what: 'Castors designed and made in India', sector: 'manufacturing', href: '/businesses#manufacturing' },
  { goal: 'Jobs and skills for youth', what: 'Jobs across the Group; AI training', sector: 'technology', href: '/careers' },
  { goal: 'Technology-led growth', what: 'AI and automation for Indian businesses', sector: 'technology', href: '/businesses#technology' },
  { goal: 'Entrepreneurship and MSMEs', what: 'Building and scaling new ventures', sector: 'ventures', href: '/businesses#ventures' },
  { goal: 'Sustainable growth', what: 'ISO 14001 manufacturing; environment, waste and recycling programmes', sector: 'foundation', href: '/foundation' },
]

/** States where group companies have registered or operating addresses (content/companies.md). */
export const states = ['Bihar', 'Delhi', 'Haryana', 'Uttar Pradesh']
