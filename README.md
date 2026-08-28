# RAS Heating & Air — La Habra HVAC Lead Generation Landing Page

A production-ready, conversion-focused landing page for **RAS Heating & Air**,
targeting homeowners in **La Habra, CA** and an approximately 2–5 mile service
radius. Built with Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui, Prisma,
and framer-motion.

## What it does

- **10 conversion-optimized sections** — hero, social proof, lead form, 8
  HVAC services, why-choose-us, local service area, offer, project showcase,
  FAQ, final CTA.
- **Lead capture** — validated form → `/api/leads` → Prisma `Lead` table → CRM
  workflow (auto-response + RAS team notification stubs).
- **Server-side analytics data layer** — typed event taxonomy, first-touch +
  last-touch attribution (gclid/fbclid/gbp preserved), Google Consent Mode v2,
  scroll-depth / engagement-time / form-engagement auto-tracking, ad-blocker-
  proof `/api/track` endpoint.
- **Motion + navigation** — scroll-reveal animations, scroll-spy nav
  highlighting, scroll progress bar, back-to-top button, animated mobile menu.
  All motion respects `prefers-reduced-motion`.
- **SEO** — LocalBusiness/HVAC + FAQ JSON-LD structured data, geo meta tags,
  optimized title/description, canonical URL, semantic headings.

## Quick start (local dev)

```bash
bun install              # installs deps + runs `postinstall: prisma generate`
cp .env.example .env     # local SQLite path is the default
bun run db:push          # creates the SQLite DB + Lead/TrackingEvent tables
bun run dev              # http://localhost:3000
```

## Deploy to Vercel

### Option A — One-click via GitHub (recommended)

1. This repo is pushed to GitHub. In Vercel: **New Project → Import the repo**.
2. Vercel auto-detects Next.js — no config needed.
3. **Environment Variables** — add in Vercel project settings:
   - `DATABASE_URL` — **required for the CRM + analytics pipeline to persist.**
     SQLite does NOT work on Vercel serverless (ephemeral filesystem). Use a
     hosted DB:
     - **Neon** (Postgres, free tier, easiest): create a project → copy the
       connection string → set `DATABASE_URL` to it, then update
       `prisma/schema.prisma`'s `datasource db` to `provider = "postgresql"`.
     - **PlanetScale** / **Supabase** work the same way.
     - **Turso** (SQLite-compatible, edge) — needs `@libsql/client` + the
       Prisma libsql adapter.
   - If you leave `DATABASE_URL` pointing at the local SQLite path, the
     **landing page still renders perfectly** — only `/api/leads` and
     `/api/track` will log-to-console instead of persisting (they fail
     gracefully; see `src/lib/db.ts`).
4. **Deploy**. Vercel runs `bun install` (which triggers the `postinstall:
   prisma generate` script) then `next build` (uses `output: "standalone"`).

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel link        # link this directory to a Vercel project
vercel env add DATABASE_URL   # paste your hosted DB URL
vercel --prod      # deploy to production
```

## Tracking / analytics IDs

Replace the placeholders in [`src/lib/business.ts`](src/lib/business.ts):

- `ga4MeasurementId` — Google Analytics 4 Measurement ID (`G-XXXXXXXX`)
- `gtmContainerId` — Google Tag Manager container ID (`GTM-XXXXXXX`)
- `metaPixelId` — Meta Pixel ID
- `googleAdsConversionId` / `googleAdsConversionLabel` — Google Ads conversion

Until these are replaced, the tracking scripts render as no-ops (the data
layer, attribution, server-side event mirror, and debug logging all still
work — so you can verify everything in the browser console before spending
ad budget).

## Business info

All business contact details (phone, address, email, hours, service area
cities) live in [`src/lib/business.ts`](src/lib/business.ts). Replace the
clearly-marked placeholders with RAS's verified info before going live — every
CTA, the header, footer, sticky bar, and structured data read from this one
file.

## Tech stack

- Next.js 16 (App Router, Turbopack, `output: "standalone"`)
- TypeScript 5, Tailwind CSS 4, shadcn/ui (New York)
- Prisma ORM + SQLite (local) — swap to Postgres/MySQL for Vercel
- framer-motion (motion + `prefers-reduced-motion` aware)
- zod (form validation), react-hook-form (form state)

## Project structure

```
src/
├── app/
│   ├── api/leads/route.ts     # Lead submission → CRM pipeline
│   ├── api/track/route.ts     # Server-side analytics event mirror
│   ├── layout.tsx             # SEO metadata, JSON-LD, GTM/GA4/Meta, data layer bootstrap
│   └── page.tsx               # The landing page (composes all sections)
├── components/landing/        # Hero, Services, LeadForm, Header, Footer, Motion, ...
├── lib/
│   ├── analytics/             # Typed event taxonomy + data layer + attribution
│   ├── business.ts             # Single source of truth for business info + tracking IDs
│   └── db.ts                   # Prisma client (fails gracefully on serverless)
└── hooks/use-scroll-spy.ts     # Active nav section highlighting
prisma/
└── schema.prisma               # Lead + TrackingEvent models
```
