# Architecture

## Overview

Clario is a SvelteKit frontend on top of a Convex backend. All AI work happens in Convex actions calling DeepSeek. The frontend never holds an API key and never calls the model directly; it reads reactive Convex queries and calls two server functions (create a project, generate an asset).

```
SvelteKit (Vercel)                     Convex (server)                 DeepSeek
------------------                     ---------------                 --------
/new  wizard  --- mutation create ---> projects.create
                                       |  schedules
                                       v
/p/[id]  <=== reactive query get ===   pipeline.run (action)
  (live status)                          ingest (scrape/parse)
                                          sequence  ------------------> DNA
                                          recommend ------------------> plan
ChannelCard --- action generate -----> assets.generate (action)
  (before/after gauge)                   draft ---------------------->  copy
                                          score ---------------------->  authenticity
                                          humanize ------------------->  rewrite
                                          re-score ------------------->  authenticity
```

## Data model (`convex/schema.ts`)

- **projects**: `status`, `inputs` (urls, docName, docText, description, goals, monthlyBudget), aggregated `sourceText`, `sources`, `error`. Status drives the UI: `created -> ingesting -> sequencing -> recommending -> ready` (or `error`).
- **dna**: one per project. `data` (the `CompanyDna` object) and a reusable `styleGuide` string.
- **recommendations**: one per project. `data` (the `Recommendations` object: personas, channels, budget).
- **assets**: many per project. `channelKey`, `kind`, `status` (`generating | ready | error`), and `data` (the `CreativeAsset`).

The big AI outputs are stored as `v.any()` under `data`, with authoritative TypeScript shapes in `convex/types.ts`. This keeps the schema stable while the AI output shape evolves, and gives the frontend strong types.

## The pipeline (`convex/pipeline.ts`)

`pipeline.run` is an internal action scheduled by `projects.create`. It:

1. **Ingest.** Fetches each URL and reduces the HTML to text (best-effort, failures are skipped and recorded in `sources`). Concatenates the description, uploaded document text, and scraped pages into one `sourceText`, capped for token budget.
2. **Sequence.** Calls DeepSeek with the DNA prompt to produce the `CompanyDna` plus a style guide.
3. **Recommend.** Calls DeepSeek with the recommendations prompt, injecting the grounded knowledge base, to produce personas and the channel plan.

Each step patches `projects.status`, so the reactive query on the project page animates through the stages live.

## The creative loop (`convex/assets.ts`)

`assets.generate` inserts an asset in `generating` state (so it appears immediately), then runs four DeepSeek calls:

1. **Draft** the asset in the brand voice (`creativeSystem`).
2. **Score** the raw draft (`authenticitySystem`), a banded 0 to 100.
3. **Humanize** it to the brand's style guide (`humanizerSystem`), removing AI tells.
4. **Re-score** the humanized version.

The asset is patched to `ready` with both scores, the humanized text, what changed, and a run playbook. The UI shows the before and after gauges side by side.

## Prompts (`convex/prompts.ts`)

Four builders, porting published skills:

- `dnaSystem` adapts scriveno's Voice DNA (9 parts, 15+ dimensions) to a company.
- `recommendSystem` + `recommendUser` inject `MARKETING_KNOWLEDGE` and enforce the honest-ranges rules.
- `authenticitySystem` embeds the shared 32-pattern tell catalog and the 4-pass, baseline-70 banded scoring.
- `humanizerSystem` embeds the same catalog with voice-first rewriting and faithfulness guards.

The catalog (`TELL_CATALOG`) is shared between scoring and rewriting so they agree on what counts as a tell.

## Knowledge base (`convex/knowledge.ts`)

`MARKETING_KNOWLEDGE` is distilled from a verified marketing research document. It carries the full channel taxonomy (24 channels across five groups), honest ROI ranges with caveats, the barbell and dual-audience frameworks, and It's Today Media's business context. Every range is deliberately conservative and labeled.

## Frontend

- `convex-svelte` provides `setupConvex` (root layout) and `useQuery` / `useConvexClient`.
- The project page (`/p/[id]`) is one reactive `projects.get` query returning project, dna, recommendations, and assets together. Svelte 5 runes (`$derived`) compute the view state from it, so nothing polls.
- Components are hand-built (no component library) for a distinctive, controlled aesthetic: `DnaCard`, `ChannelCard`, `AssetCard`, `Gauge`, `Donut`, `DnaHelix`, `Icon`.
- Exports (`src/lib/export.ts`) run client-side: a Markdown plan and a `pptxgenjs` deck.

## Where to extend

- **Ad-platform connectors:** add Convex actions that push `assets` to Google/Meta/Taboola/TikTok and pull performance back onto the recommendation.
- **PDF/DOCX intake:** add parsing in `pipeline.run` ingest (or client-side before upload).
- **Auth and workspaces:** add Convex Auth or BetterAuth and scope tables by user.
- **Model routing:** `convex/deepseek.ts` is the single seam; swap or route models per call there.
