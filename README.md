# ToolSprint — Frontend

Next.js 15 (App Router) + TypeScript + Tailwind CSS 4, exported as a fully static site (`out/`).

```bash
npm install          # also copies the PDF.js worker into public/
cp .env.example .env.local
npm run dev          # http://localhost:3000
npm test             # unit tests (Vitest)
npm run typecheck && npm run lint
npm run build        # static export to out/
npx serve out        # preview the production build
```

Structure:
- `src/lib/tools/registry.ts` — the 47 tools, categories, titles and meta descriptions
- `src/content/` — original long-form content for each tool page
- `src/lib/calc/` — pure, unit-tested logic (calculators, text, JSON, MD5, ranges…)
- `src/components/tools/` — tool UIs, lazy-loaded per page via `ToolRenderer`
- `src/components/AdSlot.tsx` — AdSense unit (disabled unless env vars set)
- `src/components/layout/Scripts.tsx` — consent banner, GA4 and AdSense loader

To add a tool: add an entry to the registry, a content entry, a component, and a line in `ToolRenderer.tsx`. `tests/registry.test.ts` fails if any piece is missing or the content is thin.
