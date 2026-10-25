/**
 * Loads the starting content from content/*.md into an empty database.
 * Run: npm run seed
 *
 * Rules (PRD section 6): only facts from the content kit. Claims that are not backed
 * by a document are left out, or saved as unverified so they stay hidden.
 */
import crypto from 'crypto'
import path from 'path'
import { getPayload } from 'payload'
import config from '../payload.config'

const root = process.cwd()
const ctx = { skipRevalidate: true }

const payload = await getPayload({ config })

const existing = await payload.count({ collection: 'companies' })
if (existing.totalDocs > 0) {
  payload.logger.info('Companies already exist — seed skipped. Delete bharatx.db to start again.')
  process.exit(0)
}

async function image(file: string, alt: string, placeholder = false) {
  const doc = await payload.create({
    collection: 'media',
    data: { alt, placeholder },
    filePath: path.join(root, file),
    context: ctx,
  })
  return doc.id
}

// --- Admin user -------------------------------------------------------------
const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@bharatxgroup.org'
const adminPassword = process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url')
const users = await payload.count({ collection: 'users' })
if (users.totalDocs === 0) {
  await payload.create({
    collection: 'users',
    data: { email: adminEmail, password: adminPassword, name: 'Site admin', role: 'admin' },
  })
  payload.logger.info(`Admin user: ${adminEmail} / ${adminPassword}  (change it after first sign-in)`)
}

// --- Companies (content/companies.md, checked 23–24 Oct 2026) ---------------
const companies = [
  {
    name: 'BharatX Labs',
    slug: 'bharatx-labs',
    sector: 'technology',
    order: 1,
    // Added 25 Oct 2026 as the Group's technology and R&D business; details to come (requirement.md).
    tagline: 'Research and development in technology, engineering and AI for the Group’s businesses.',
    description:
      'BharatX Labs is the Group’s technology and research and development business. It works on technology, engineering and AI for BharatX businesses and the industries they serve.',
    logo: ['images/company-logos/bharatx-labs.png', 'BharatX Labs logo'],
  },
  {
    name: 'BharatX Ventures',
    slug: 'bharatx-ventures',
    sector: 'ventures',
    order: 2,
    tagline: 'Combining capital, strategy and execution to build and scale enterprises.',
    description:
      'BharatX Ventures builds new businesses and helps established small and medium enterprises grow. It brings growth capital, strategy consulting and hands-on operating support, with a focus on agri-tech manufacturing and AI-led industrial automation.',
    offerings: ['Venture building', 'SME growth capital', 'Strategy consulting', 'Operating support for founders'],
    customers: 'Founders and owners of small and medium businesses across India who want to build or scale.',
    legalName: 'Bharatx Ventures Private Limited',
    cin: 'U01139BR2026PTC083018',
    registeredOffice: 'Bihar Infrastructure Hub, Gaya, Bihar',
    salesEmail: 'info@bharatx.vc',
    website: 'https://bharatx.vc/',
    logo: ['images/company-logos/bharatx-ventures-1.png', 'BharatX Ventures logo'],
    hero: 'images/placeholders/companies/bharatx-ventures.webp',
  },
  {
    name: 'BharatX Infratech',
    slug: 'bharatx-infratech',
    sector: 'infrastructure',
    order: 3,
    tagline: 'Building roads, bridges and civil infrastructure for a growing India.',
    description:
      'BharatX Infratech builds roads and highways, bridges and flyovers, government civil works, power infrastructure and smart-city projects.',
    offerings: ['Roads and highways', 'Bridges and flyovers', 'Government civil works', 'Power infrastructure', 'Smart-city projects'],
    customers: 'Government departments, public-sector bodies and private developers.',
    legalName: 'BharatX Infratech Private Limited',
    cin: 'U41001BR2026PTC082273',
    operatingAddress: '9th Floor, Logix Cyberpark, Tower-C, Sector 62, Noida, Uttar Pradesh 201309',
    salesEmail: 'info@bharatxinfratech.com',
    salesPhone: '+91 98112 63046',
    whatsapp: '919811263046',
    website: 'https://bharatxinfratech.com/',
    logo: ['images/company-logos/bharatx-infratech-2.png', 'BharatX Infratech logo'],
    hero: 'images/placeholders/companies/bharatx-infratech.webp',
  },
  {
    name: 'Casters Global',
    slug: 'casters-global',
    sector: 'manufacturing',
    order: 5,
    since: 2018,
    tagline: 'Designing and making industrial, medical and retail castors in India since 2018.',
    description:
      'Casters Global designs and manufactures castors and wheels for industrial, medical, furniture and retail use, including heavy-duty polyurethane, nylon and rubber castors, and custom-engineered solutions. It started in a New Delhi workshop in 2018 and now makes its products at a facility in Manesar, Haryana.',
    offerings: ['Industrial castors', 'Medical castors', 'Furniture and retail castors', 'Heavy-duty PU, nylon and rubber wheels', 'Custom engineering'],
    customers: 'Manufacturers, hospitals and healthcare equipment makers, furniture brands, warehouses and retailers.',
    legalName: 'Casters Global',
    operatingAddress: 'Plot No. 298, 3rd Floor, Sector 10A, Gurgaon, Haryana 122001\nFactory: Manesar, Haryana',
    salesEmail: 'sales@castersglobal.com',
    salesPhone: '+91 88268 83046',
    whatsapp: '918826883046',
    website: 'https://castersglobal.com/',
    logo: ['images/company-logos/casters-global.png', 'Casters Global logo'],
    hero: 'images/placeholders/companies/casters-global.webp',
    // Claimed on its website; hidden until the certificates are on file.
    certifications: ['ISO 9001:2015', 'ISO 14001:2015'],
  },
  {
    name: 'AIxperts Labs',
    slug: 'aixperts-labs',
    sector: 'technology',
    order: 4,
    tagline: 'Building AI, automation and digital solutions for modern businesses.',
    description:
      'AIxperts Labs helps companies adopt AI: strategy, automation and AI agents, custom language models and training for institutions and teams. It also builds HelloGini, a voice AI product.',
    offerings: ['Enterprise AI strategy', 'Automation and AI agents', 'Custom language models', 'AI training for institutions and companies', 'HelloGini voice AI'],
    customers: 'Companies, institutions and colleges adopting AI.',
    legalName: 'AIxperts Labs Private Limited',
    website: 'https://aixpertslabs.com/',
    logo: ['images/company-logos/aixperts-labs.webp', 'AIxperts Labs logo'],
    hero: 'images/placeholders/companies/aixperts-labs.webp',
  },
  {
    name: 'BharatX Agro',
    slug: 'bharatx-agro',
    sector: 'agriculture',
    order: 6,
    tagline: 'Taking Indian agricultural products such as makhana and moringa to global markets.',
    description:
      'BharatX Agro exports Indian agri-ingredients: makhana from Bihar, moringa powder from South India, onion powder and dried mushroom.',
    offerings: ['Makhana (fox nuts)', 'Moringa powder', 'Onion powder', 'Dried mushroom'],
    customers: 'Food manufacturers, importers and distributors outside India.',
    salesEmail: 'export@bharatxagro.com',
    website: 'https://bharatxagro.com/',
    logo: ['images/company-logos/bharatx-agro.png', 'BharatX Agro logo'],
  },
  {
    name: 'BharatX Enterprises',
    slug: 'bharatx-enterprises',
    sector: 'packaging',
    order: 7,
    tagline: 'Industrial packaging materials, corrugated boxes, protective cushioning and bulk logistics containers.',
    description:
      'BharatX Enterprises supplies corrugated boxes and industrial packaging for manufacturers and logistics businesses.',
    offerings: ['Corrugated boxes', 'Industrial packaging', 'Protective cushioning', 'Bulk logistics containers'],
  },
  {
    name: 'Sumedha Agro',
    slug: 'sumedha-agro',
    sector: 'agriculture',
    order: 8,
    tagline: 'Producing mushroom spawn and training farmers to grow mushrooms.',
    description:
      'Sumedha Agro produces mushroom spawn and runs training for farmers who want to start growing mushrooms, from its base near Lucknow.',
    offerings: ['Mushroom spawn', 'Farmer training batches'],
    customers: 'Farmers and rural entrepreneurs in Uttar Pradesh and nearby states.',
    operatingAddress: '982 Village Andpurdev, Banthra, Sarojni Nagar, Lucknow, Uttar Pradesh 226401',
    salesEmail: 'info@sumedhaagro.com',
    salesPhone: '+91 94738 96285',
    website: 'https://sumedhaagro.com/',
    logo: ['images/company-logos/sumedha-agro.webp', 'Sumedha Agro logo'],
    hero: 'images/placeholders/companies/sumedha-agro.webp',
  },
] as const

const companyIds: Record<string, number> = {}
for (const c of companies) {
  const { logo, hero, offerings, certifications, ...rest } = c as typeof c & {
    offerings?: readonly string[]
    hero?: string
    logo?: readonly [string, string]
    certifications?: readonly string[]
  }
  const doc = await payload.create({
    collection: 'companies',
    context: ctx,
    data: {
      ...rest,
      relationship: 'to-confirm',
      // Sumedha Agro is off the website (BharatX, 25 Oct 2026); kept as a draft.
      _status: c.slug === 'sumedha-agro' ? 'draft' : 'published',
      offerings: offerings?.map((item: string) => ({ item })),
      logo: logo ? await image(logo[0], logo[1]) : undefined,
      heroImage: hero ? await image(hero, `${c.name} (placeholder image)`, true) : undefined,
      certifications: certifications?.map((name) => ({
        name,
        asOf: '2026-10-01',
        verified: false,
        source: 'Claimed on the company website; certificate not yet received',
      })),
    },
  })
  companyIds[c.slug] = doc.id
}

// --- Partnerships and programmes (stated by BharatX, 24 Oct 2026; documents requested) ---
const partnerLogo = async (file: string, alt: string) => image(`images/partner-logos/${file}`, alt)
const logos = {
  nsic: await partnerLogo('nsic.png', 'NSIC logo'),
  iit: await partnerLogo('iit-delhi.png', 'IIT Delhi logo'),
  ongc: await partnerLogo('ongc.png', 'ONGC logo'),
  igl: await partnerLogo('igl.png', 'Indraprastha Gas Limited logo'),
  cehro: await partnerLogo('cehro-india.png', 'CEHRO India logo'),
}
// Order as decided by BharatX (24 Oct 2026).
const partnerships = [
  // No logo: the Ministry's identity is the State Emblem of India, which cannot be used commercially.
  { slug: 'ministry-of-msme-ai-programme', kind: 'Programme', partner: 'Ministry of MSME', title: 'AI programme under the Ministry of MSME',
    summary: 'AIxperts Labs delivers an AI programme under a scheme of the Ministry of Micro, Small and Medium Enterprises, Government of India.' },
  { slug: 'iit-delhi-mou', kind: 'MoU', partner: 'IIT Delhi', logo: logos.iit, title: 'MoU with IIT Delhi',
    summary: 'AIxperts Labs has signed an MoU with the Indian Institute of Technology Delhi.' },
  { slug: 'nsic-mou', kind: 'MoU', partner: 'NSIC', logo: logos.nsic, title: 'MoU with the National Small Industries Corporation (NSIC)',
    summary: 'AIxperts Labs has signed an MoU with NSIC, the Government of India enterprise that supports micro, small and medium businesses.' },
  { slug: 'ongc-mou', kind: 'MoU', partner: 'ONGC', logo: logos.ongc, title: 'MoU with ONGC',
    summary: 'AIxperts Labs has signed an MoU with Oil and Natural Gas Corporation (ONGC).' },
  { slug: 'igl-mou', kind: 'MoU', partner: 'IGL', logo: logos.igl, title: 'MoU with Indraprastha Gas Limited (IGL)',
    summary: 'AIxperts Labs has signed an MoU with Indraprastha Gas Limited (IGL).' },
  { slug: 'cehro-india-collaboration', kind: 'Collaboration', partner: 'CEHRO India', logo: logos.cehro, title: 'Collaboration with CEHRO India',
    summary: 'AIxperts Labs is collaborating with CEHRO India.' },
] as const
for (const [i, p] of partnerships.entries()) {
  await payload.create({
    collection: 'partnerships',
    context: ctx,
    data: {
      ...p,
      company: companyIds['aixperts-labs'],
      source: 'Stated by BharatX, 24 Oct 2026 (documents requested)',
      logoPermission: false,
      order: i + 1,
      _status: 'published',
    },
  })
}

// --- Leadership (content/leadership.md, supplied by BharatX 24 Oct 2026) ---
type PersonSeed = {
  name: string
  slug: string
  role: string
  order: number
  shortBio: string
  bio?: string
  linkedin?: string
  photo?: string
  otherRoles?: string[]
}

const people: PersonSeed[] = [
  {
    name: 'Pradeep Kumar',
    slug: 'pradeep-kumar',
    role: 'Group Chairman & Managing Director',
    order: 1,
    photo: 'images/leadership/pradeep-kumar.webp',
    linkedin: 'https://www.linkedin.com/in/pradeep-kumar-5170655b',
    otherRoles: ['Co-founder & Managing Director, Casters Global'],
    shortBio:
      'Technology and business leader with 15+ years across product, data, AI and enterprise technology at SAP Labs, Meta, Airtel and Samsung. Master’s in AI from IIT Delhi; MBA from IIM Ahmedabad.',
    bio: 'Pradeep Kumar is a technology and business leader with over 15 years of experience across product management, data, AI and enterprise technology. He holds a Master’s in AI from IIT Delhi and an MBA from IIM Ahmedabad. Having worked with organisations including SAP Labs, Meta, Airtel & Samsung, he brings experience in technology-led product development and business strategy. At BharatX Group, he leads the Group’s strategic direction, focusing on building sustainable businesses, advancing innovation and creating long-term value.',
  },
  {
    name: 'Dharampal Singh',
    slug: 'dharampal-singh',
    role: 'Chief Revenue & Operating Officer',
    order: 2,
    photo: 'images/leadership/dharampal-singh.webp',
    linkedin: 'https://www.linkedin.com/in/dharampal-singh-995aa2228',
    // castersglobal.com lists him as Founder & CEO of Casters Global, but BharatX's bio doesn't.
    // Left off the site until BharatX confirms (content/leadership.md).
    shortBio:
      'Operations leader with 28+ years in automotive manufacturing. Former Plant Head at Jay Ushin Ltd (JPM Group), running three plants and teams of 1,000+. Expert in Lean, Six Sigma and IATF 16949.',
    bio: 'Dharampal Singh is the Chief Revenue & Operating Officer of BharatX Group. He leads operations, delivery and revenue performance across the Group’s ventures. He brings more than 28 years of experience in automotive manufacturing and multi-site operations, and has led teams of over 1,000 people.\n\nBefore joining BharatX Group, he spent over 27 years at Jay Ushin Limited (JPM Group), which he joined in 1999. Most recently he was Plant Head there, overseeing three group plants in Manesar, Bengaluru and Gujarat. Over his career he has worked across product planning, quality, production, stores, warehousing and spare-parts management. He has a record of raising productivity while bringing down overall costs.\n\nDharampal specialises in operational excellence, including Lean Manufacturing, Six Sigma, Kanban, and quality control and assurance. He is well versed in global standards such as IATF 16949, ISO 14001 and OHSAS 18001. At BharatX Group, he brings this process discipline to scaling operations, strengthening delivery and driving sustainable growth.\n\nHe studied at a Government Polytechnic College and is based in Gurugram, Haryana.',
  },
  {
    name: 'Nitin Arora',
    slug: 'nitin-arora',
    role: 'Executive Vice President — Product, Technology & AI',
    order: 3,
    photo: 'images/leadership/nitin-arora.png',
    linkedin: 'https://www.linkedin.com/in/aronitin',
    shortBio:
      'Technologist with 15+ years across product, AI and entrepreneurship at Google, Amazon, GE and Deloitte, and founder of his own startup. B.Tech and PhD in Computer Science, IIT Delhi; master’s, NYU.',
    bio: 'Nitin Arora brings over 15 years of experience across technology, product innovation, artificial intelligence and entrepreneurship. He holds a bachelor’s degree in Computer Science from IIT Delhi, a master’s degree from New York University, and a PhD in Computer Science and Computation from IIT Delhi. His professional experience spans leading organisations including Google, Amazon, GE, iLabs and Deloitte, alongside building his own startup. At BharatX Group, he will lead product, technology and AI strategy, driving scalable innovation and the development of impactful, AI-powered solutions across the Group’s portfolio.',
  },
  {
    name: 'Dr. Akanksha Verma',
    slug: 'akanksha-verma',
    role: 'Chief Operating Officer',
    order: 4,
    // Passport photo (413×531) on a blurred office background; original: akanksha-verma-passport.png.
    photo: 'images/leadership/akanksha-verma-office.jpg',
    linkedin: 'https://www.linkedin.com/in/akanksha-verma-304a18191',
    shortBio:
      'Environmental scientist with an M.Phil. and Ph.D., and research in sustainability and pollution. Her role as COO covers operational coordination, execution and the Group’s strategic priorities.',
    bio: 'Dr. Akanksha Verma has an academic background in environmental sciences and management, with qualifications spanning undergraduate and postgraduate studies, an M.Phil. and a Ph.D. Her expertise in environmental research, sustainability and pollution-related studies provides a foundation for her role as Chief Operating Officer at BharatX Group, where she will focus on operational coordination, execution and supporting the Group’s strategic priorities.',
  },
]

for (const p of people) {
  const { photo, otherRoles, ...rest } = p
  await payload.create({
    collection: 'people',
    context: ctx,
    data: {
      ...rest,
      team: 'group',
      _status: 'published',
      otherRoles: otherRoles?.map((role) => ({ role })),
      photo: photo ? await image(photo, `${p.name}, ${p.role}`) : undefined,
    },
  })
}

// --- Globals ----------------------------------------------------------------
await payload.updateGlobal({
  slug: 'site-settings',
  context: ctx,
  data: {
    phone: '+91 98112 63046',
    whatsapp: '919811263046',
    // Proposed address; works once bharatxgroup.org is registered (requirement.md section 1).
    email: 'contact@bharatxgroup.org',
    // To confirm: Motilal Nehru Complex (prototype) or Logix Cyberpark, Noida.
    officeAddress: 'Building no. 511, First Floor, Motilal Nehru Complex, New Delhi 110017',
    hours: 'Monday to Saturday, 10:00 AM to 6:00 PM IST',
    socials: [], // none confirmed to exist yet
  },
})

const milestone = (date: string, title: string, detail: string, source: string, slug?: string) => ({
  date,
  title,
  detail,
  source,
  company: slug ? companyIds[slug] : undefined,
})
await payload.updateGlobal({
  slug: 'group-facts',
  context: ctx,
  data: {
    // Only facts with a public source; the About page shows the year alone.
    milestones: [
      milestone('2018-01-01', 'Casters Global starts in a New Delhi workshop', 'The castor manufacturer begins with a small workshop in New Delhi.', 'castersglobal.com/about', 'casters-global'),
      milestone('2025-01-01', 'Casters Global opens its Haryana factory', 'A 50,000 sq ft manufacturing facility in Manesar, Haryana.', 'castersglobal.com/about', 'casters-global'),
      milestone('2026-01-01', 'AIxperts Labs incorporated', 'The Group’s AI and technology company. It has since signed MoUs with IIT Delhi, NSIC, ONGC and IGL.', 'Stated by BharatX, 24 Oct 2026 (documents requested)', 'aixperts-labs'),
      milestone('2026-01-01', 'BharatX Infratech and BharatX Ventures incorporated', 'Both companies are registered in Bihar.', 'CINs U41001BR2026PTC082273 and U01139BR2026PTC083018 (MCA)'),
      milestone('2026-01-02', 'BharatX Labs Foundation incorporated', 'A not-for-profit Section 8 company for the Group’s CSR work, registered in Uttar Pradesh.', 'CIN U85500UP2026NPL252546 (MCA)'),
    ],
  },
})

await payload.updateGlobal({
  slug: 'foundation',
  context: ctx,
  data: {
    name: 'BharatX Labs Foundation',
    cin: 'U85500UP2026NPL252546',
    intro:
      "BharatX Labs Foundation is BharatX Group's not-for-profit Section 8 company. It carries out the Group's CSR work in education and skills, research, and the environment, including waste management and recycling.",
    programmes: [], // to be supplied (requirement.md section 6)
  },
})

payload.logger.info('Seed complete.')
process.exit(0)
