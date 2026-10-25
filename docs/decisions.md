# Decisions and recommendations

| # | Topic | Decision | Status |
| --- | --- | --- | --- |
| 1 | Domain | **bharatxgroup.org** | Decided by BharatX. **Not registered yet**: on 23 Oct 2026 the .org registry returned "Domain not found". Register it now; also consider .com and .in |
| 2 | Framework | **Next.js** (App Router) + TypeScript + Tailwind CSS | Decided (24 Oct 2026). The team knows React, Next.js and Laravel. Next.js wins on speed and SEO for a content site, and lets the team reuse the prototype's React work |
| 3 | CMS | **Payload CMS** (inside the Next.js app). SQLite file for local development; **Postgres** (Neon or Supabase) in production | Decided by BharatX (24 Oct 2026); build started. MySQL is not an option: Payload supports only Postgres, SQLite and MongoDB |
| 4 | Hosting | **Vercel Pro** (~$20 per developer seat per month, about ₹2,000 including GST) | Recommended. The free Hobby plan is for **non-commercial use only** ([Vercel fair use](https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage)). Cheaper legitimate alternative: a small VPS with Coolify |
| 5 | Brand colours | Taken from the logo: Navy `#012247`, Saffron `#FE7802`, Blue `#016DAB`, Green `#5C9B19` | Decided. See `brand/brand-colors.md` |
| 6 | Logo vector kit | Not needed for now | Decided by BharatX |
| 7 | Name spelling | **Dharampal Singh** (as on his LinkedIn and in the bio BharatX supplied, 24 Oct 2026) | Changed from "Dharmapal" (castersglobal.com spelling). Casters Global's site should be corrected to match |
| 8 | Laravel | Not for the public site. Use it later for heavy internal systems (applicant tracking, vendor portals) as a separate app, e.g. `portal.bharatxgroup.org` | Recommendation |

## Risks to keep in mind

- **Name clash:** a Y Combinator-backed Bengaluru fintech called **BharatX** ([bharatx.tech](https://linkedin.com/company/bharatx)) already exists. Target **"BharatX Group"** in titles and SEO, and check trademark rights with a lawyer.
- **Unverified claims:** company sites carry numbers and logos with no backing (see `content/companies.md`). Nothing goes on the group site without a source.
- **Content is the critical path**, not code: photos, verified KPIs and bios take the longest.
