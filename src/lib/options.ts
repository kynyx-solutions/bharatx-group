export const sectors = [
  { label: 'Infrastructure', value: 'infrastructure' },
  { label: 'Agriculture and food', value: 'agriculture' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Packaging', value: 'packaging' },
  { label: 'AI and technology', value: 'technology' },
  { label: 'Venture building', value: 'ventures' },
] as const

export type Sector = (typeof sectors)[number]['value']

export const sectorLabel = (value?: string | null) =>
  sectors.find((s) => s.value === value)?.label ?? ''

/** Contact pathways (PRD section 7). */
export const pathways = [
  { label: 'Business enquiry or quote', value: 'business', reply: '1 working day' },
  { label: 'Partnerships', value: 'partnerships', reply: '2 working days' },
  { label: 'Investors', value: 'investors', reply: '2 working days' },
  { label: 'Founders and SMEs', value: 'founders', reply: '3 working days' },
  { label: 'Careers', value: 'careers', reply: 'an acknowledgement straight away' },
  { label: 'Media', value: 'media', reply: '1 working day' },
] as const

export type Pathway = (typeof pathways)[number]['value']

export const pathwayLabel = (value?: string | null) =>
  pathways.find((p) => p.value === value)?.label ?? value ?? ''

export const jobTypes = [
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
] as const

export const foundationAreas = [
  { label: 'Education and skills', value: 'education' },
  { label: 'Research and innovation', value: 'research' },
  { label: 'Environment, waste and recycling', value: 'environment' },
  { label: 'Community', value: 'community' },
] as const
