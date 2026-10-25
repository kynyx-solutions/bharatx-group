# Deploying a temporary preview on Vercel (free)

A preview of the site and admin on `https://<project>.vercel.app`. Vercel's free Hobby plan is for non-commercial use, so use this only for previews; move to Vercel Pro (or another host) before the public launch. No code changes are needed for that move.

**How it runs on Vercel**

| On this computer | On Vercel | Set by |
| --- | --- | --- |
| `bharatx.db` (SQLite file) | Turso (hosted SQLite, same engine) | `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` |
| `media/`, `private/` (uploads) | Vercel Blob | `BLOB_READ_WRITE_TOKEN` |

Search engines stay blocked (`robots.txt` only allows indexing on bharatxgroup.org). Email is printed to the logs until `RESEND_API_KEY` is set.

## Automatic import and content updates (no keys needed on this computer)

Vercel marks the Turso and Blob keys as sensitive, so they can't be downloaded. Instead, each Vercel build brings the content up to date itself:

- **Content is edited on this computer** (local admin), then published with:
  ```bash
  npm run snapshot     # deploy-snapshot/: the database without private data, the images, a version stamp
  git add deploy-snapshot && git commit -m "Content update" && git push
  ```
  The push starts a Vercel build.
- Before each build, `scripts/prebuild.mjs` runs `src/seed/hosted-import.ts`:
  1. **Database:** empty → full import. Older snapshot → the content tables are refreshed. User accounts, enquiries, applications, CVs and documents on Vercel are **never** touched.
  2. **Images:** any file missing from Blob is uploaded.
  3. **Admin:** if there are no accounts, an admin is created with a random password, printed once in the **build log** (Deployments → the deployment → Build Logs, search for `Admin login`).
- **When content starts being edited in the Vercel admin instead,** set `FREEZE_HOSTED_CONTENT=1` in Vercel's environment variables. Builds then leave the hosted content alone, so those edits are never overwritten by a snapshot.
- A snapshot can't change the database **schema**: after adding or changing CMS fields, the hosted database needs a full re-import (empty it, then redeploy) or a migration.

## Steps (manual alternative with real keys)

1. **Log in and create the project** (in this folder):
   ```bash
   npx vercel login
   npx vercel link          # create a new project, e.g. "bharatx-group"
   ```
2. **Add storage** in the Vercel dashboard → your project → **Storage**:
   - **Create → Blob**, connect it to the project. This adds `BLOB_READ_WRITE_TOKEN`.
   - **Browse Marketplace → Turso Cloud**, create a database in **Mumbai (ap-south-1)**, connect it to the project. This adds `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`.
3. **Add environment variables** (Settings → Environment Variables, all environments):
   - `PAYLOAD_SECRET`: a new random value (`openssl rand -hex 32`)
   - `NEXT_PUBLIC_SITE_URL`: `https://<project>.vercel.app`
4. **Copy the content up** (database and uploads, from this computer):
   ```bash
   npx vercel env pull .env.vercel     # git-ignored; holds the tokens
   npm run push:db                     # add -- --replace to overwrite later
   npm run push:media
   ```
5. **Deploy:**
   ```bash
   npx vercel deploy --prod
   ```

Admin: `https://<project>.vercel.app/admin`, with the same accounts as the local database (they were copied in step 4). Change the password after the first sign-in.

## Updating later
- Content edited on Vercel's admin lives in Turso and Blob; local edits don't sync automatically. To push local content up again: `npm run push:db -- --replace` and `npm run push:media` (this overwrites the hosted content).
- Code changes: `npx vercel deploy --prod`.

## Limits on the free plan
- Requests over 4.5 MB are rejected, so CVs are limited to 4 MB and admin uploads to 4.5 MB.
- Vercel Blob files are public (with hard-to-guess paths for private ones); move CVs and evidence documents to a private bucket before launch.
- Not for commercial use: see Vercel's fair-use guidelines.
