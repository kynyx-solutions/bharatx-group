# BharatX Group website

The BharatX Group corporate website at **bharatxgroup.org**: a Next.js site with Payload CMS, plus the content kit it is built from. Read `docs/prd.md` first.

## Run it locally

Needs Node.js 24.22+ (or 22.23+).

```bash
npm install
cp .env.example .env      # then set PAYLOAD_SECRET (openssl rand -hex 32)
npm run seed              # loads companies, leadership and settings from the content kit; prints the admin login
npm run dev               # http://localhost:3000 · admin at http://localhost:3000/admin
```

The local database is a SQLite file (`bharatx.db`); delete it and run `npm run seed` again to start over. Production will use Postgres (see `docs/decisions.md`).

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run seed` | Load starting content into an empty database |
| `npm run generate:types` | Regenerate `src/payload-types.ts` after changing collections |
| `npm run typecheck` | TypeScript check |

**Temporary preview on Vercel (free):** see [DEPLOY-VERCEL.md](DEPLOY-VERCEL.md).

### How the code is organised

```
src/
  app/(frontend)/      Public pages: home, about, businesses, leadership, foundation, news, careers, contact, legal
  app/(payload)/       Payload admin and API (generated; don't edit)
  collections/         CMS content types: Companies, People, News, Jobs, Media, Enquiries, Applications, CVs, Documents, Users
  globals/             Site settings (contact, inbox routing, fraud notice), Group numbers and milestones, Foundation
  components/          Header, footer, cards, forms
  lib/                 Data fetching, form actions, access rules, email routing
  seed/                Starting content
```

### Rules built into the CMS

- **Editors draft, Approvers publish** (FR-11). An Editor's "Publish" is saved as a draft.
- **No claim without evidence.** Every number and certification has an "as of" date, a source and a "Verified" tick. Only verified rows appear on the site; with none, the section is hidden.
- **Every enquiry is saved before "Thank you"** (FR-2), then emailed to the inbox for its pathway or the company's sales email (Site settings → Enquiry inboxes). Without `RESEND_API_KEY`, emails are only printed to the console and the enquiry shows `not-configured`. Export: `/api/enquiries/export.csv`.
- **Partnerships and programmes** (admin → Content → Partnerships & programmes): each MoU or workshop has its own page at `/partnerships/{slug}`, with a partner logo, event photos (opened full size on click) and MoU images. Show only a signing photo or the first page of an MoU, with the partner's permission; the full copy goes in the private Evidence field. Tick "Written permission to show the logo" once the partner agrees. Logo files are in `images/partner-logos/`.
- **Newsroom opens at 3 items.** Until 3 news items are published, it stays out of the menu, footer, sitemap and search results (PRD section 6).
- **Security headers:** a static Content Security Policy (only Cloudflare Turnstile is allowed from outside) is set in `next.config.ts`. HSTS and `upgrade-insecure-requests` are sent only when `NEXT_PUBLIC_SITE_URL` is https.
- **CVs are private** (FR-7): stored outside the public folder, readable only by signed-in staff.
- **Home hero video:** put `hero.mp4` (H.264, 1920×1080, 10–20 s seamless loop, no audio, under 6 MB) in `public/hero/`, optionally with `hero.webm` and a `poster.webp` (its first frame). Restart or rebuild to pick it up. Without them the hero shows the still image. The video is muted, has a pause button, and doesn't play for visitors who prefer reduced motion.
- Placeholder images (AI/stock from the prototype) are ticked "Placeholder" in Media. Replace them before launch, including everything in `public/placeholders/` (home hero, sector images, page headers).

Live PRD (editable, commentable): https://claude.ai/artifact/XzipgSDgtUt59dYjEseFS5. `docs/prd.md` is an export of it; re-export after major edits.

## What's here

```
requirement.md         Content checklist for BharatX: everything we still need, with status
docs/
  prd.md               Product requirements: goals, companies, audiences, sitemap, requirements, plan
  decisions.md         Domain, stack, hosting, palette decisions; risks
content/
  leadership.md        Titles, bios, photo files, LinkedIn links
  companies.md         Every group company: status, legal entity, address, contacts, what it does
  contact.md           Group phone, office, email, social accounts (with what's unconfirmed)
  prototype-copy.md    Prototype text reviewed page by page (Keep / Rewrite / Drop) +
                       vision and mission aligned with Viksit Bharat @2047
brand/
  brand-colors.md      Palette from the logo + accessibility rules
  design-tokens.css    CSS variables + Tailwind v4 @theme block, ready to paste
  logo/                Master logo PNG, 640 px WebP, 1200×630 social preview image
  favicon/             favicon.ico, 512 px PNG, Apple touch icon
images/
  leadership/          Photos of all four group leaders
  company-logos/       Logos of the group companies
  placeholders/        Prototype images (mostly AI/stock): replace before launch
```

## Still pending

- [ ] **Register bharatxgroup.org** (it isn't registered yet) and set up email on it
- [x] Photos of **Nitin Arora** and **Dr. Akanksha Verma** (hers: passport photo with an office background added; a studio headshot would be better)
- [x] Bio and LinkedIn for **Dharampal Singh** (received 24 Oct 2026)
- [ ] Confirm whether Dharampal Singh is still Founder & CEO of Casters Global
- [x] Company list confirmed by BharatX on 24 Oct 2026: 7 businesses + BharatX Labs Foundation (Section 8, CSR)
- [ ] For each company: subsidiary, brand or partner? And BharatX Labs Foundation's CIN and programmes
- [ ] Confirm the group office address and which social accounts exist
- [ ] Decide which numbers (KPIs) can be shown, with a source for each
- [x] Stack confirmed: Next.js + Payload CMS (24 Oct 2026)
- [ ] Choose hosting and the production database (Postgres on Neon or Supabase)
- [ ] Set up Resend (email) and Cloudflare Turnstile (spam) keys
- [ ] At launch: create fresh admin accounts on the live site with strong passwords (the local `admin@bharatxgroup.org` login is for development only and is never copied to production)
