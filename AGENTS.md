<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project rules (from the owner)

Every edit must respect and maintain the existing project structure:

- **Components:** reuse the shared building blocks (`src/components/ui`, `src/components/shared`) and keep one component per section in `src/components/sections`, with section-only pieces in that section's subfolder.
- **Design tokens:** colors, spacing and type come from the theme tokens (`src/styles`, `src/lib/theme-tokens.ts`); never hard-code values that a token already covers.
- **Clean architecture:** content flows Supabase → `CmsContext` → `src/content/*` hooks → section components; keep logic in `src/lib`, name constants, avoid duplication, and leave no dead code.
