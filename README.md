# Osama Tammam: portfolio

Bilingual (English / Arabic, RTL) portfolio at [os-tammam.cc](https://www.os-tammam.cc), with a built-in admin panel for editing the content.

**Stack:** Next.js 16 (app router), React 19, Tailwind CSS v4, three.js + GSAP + Motion, Supabase (content, images, feedback). Deployed on Vercel: every push to `main` goes live.

## Run it locally

```bash
npm install
cp .env.local.template .env.local   # then fill in the values
npm run dev                         # http://localhost:3000, admin at /admin
```

| Script | |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build (what Vercel runs) |
| `npm test` | Unit tests (Vitest) |
| `npm run lint` | ESLint (blocked for now: typescript-eslint doesn't support TypeScript 7 yet) |

## Environment variables

| Name | What it's for |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Reading the published content |
| `SUPABASE_SERVICE_ROLE_KEY` | Saving from the admin, image uploads, the feedback inbox (server only) |
| `ADMIN_SECRET` | The admin password; changing it signs everyone out |

Locally, the service role key is optional: without it, admin saves and feedback go to files under `node_modules/.cache`.

## How the code is organized

```
src/
  app/            routes (home, /admin, /login, /case-study/[id]) and server actions
  components/
    sections/     one component per page section (Hero, Skills, Portfolio, …)
    ui/           shared building blocks: CTAButton, PillButton, IconButton, Tag, SectionTitle
    shared/       site-wide pieces: dialogs, 3D shapes, hex grid, cursor
    cms/          the admin panel's editors
  content/        one module per section: turns CMS data into ready-to-show text
  contexts/       CMS data and language providers
  lib/            helpers (scroll, motion presets, WebGL, chapter stepper, Supabase)
  translations/   fixed interface text and fallback copy, in English and Arabic
  types/cms.ts    the content model and its defaults
```

Content flows one way: **Supabase → `CmsContext` → `src/content/*` hooks → section components.** Sections never read raw CMS data; they ask their content hook, which handles the language and the fallbacks.

## Database

Run the files in `supabase/migrations/` in order in the Supabase SQL editor:

1. `01_cms_data_table.sql`: the content table (one JSON row, `main`).
2. `02_feedback_submissions.sql`: the private feedback inbox.

Images go in a public storage bucket named `cms-images`.
