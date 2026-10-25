#!/usr/bin/env node
/**
 * Runs before `next build`. On Vercel, with a hosted database configured, it runs the one-time content import
 * (src/seed/hosted-import.ts). Locally it does nothing.
 */
import { spawnSync } from 'node:child_process'

if (process.env.VERCEL !== '1' || !process.env.TURSO_DATABASE_URL) process.exit(0)

const result = spawnSync('npx', ['payload', 'run', 'src/seed/hosted-import.ts'], {
  stdio: 'inherit',
  // production: Payload never auto-changes the schema; the snapshot already has it.
  env: { ...process.env, NODE_ENV: 'production', NODE_OPTIONS: '--no-deprecation' },
})
process.exit(result.status ?? 1)
