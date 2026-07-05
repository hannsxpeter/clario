# Clario

**Marketing that sounds human, not like AI.**

Clario reads a business, sequences its **Company DNA** (voice, identity, and story), and builds a full channel-by-channel marketing plan where every generated asset is written in that brand's voice and scored for authenticity, so it reads like a person wrote it, not a machine.

Built for the It's Today Media Marketing Development Engineer build contest.

---

## What it does

You give Clario whatever reveals a brand's voice: a website, an X or LinkedIn URL, an uploaded plan, or just a description. Add as many links as you want with the plus button, or upload a document, or type a paragraph. Any combination.

From that, Clario:

1. **Sequences the Company DNA.** A structured profile of the brand's voice (register, cadence, vocabulary, sentence music, humor, signature phrases), its identity (mission, value proposition, differentiators, audience), and the story it tells (origin, the villain it fights, the transformation it promises). Plus a brand archetype and an Always/Never voice ruleset.
2. **Builds a channel plan.** Target personas, then the full channel taxonomy (TV, radio, CTV, OOH, paid search, paid social, native/Taboola, affiliate, influencer, SEO, GEO/AEO, email, SMS, landing pages, community, digital PR, experiential, and more) with a recommended budget split, honest ROI and success ranges, KPIs, and a top-five shortlist. Estimates are presented as ranges with assumptions, never as fake hero numbers.
3. **Generates humanized creative.** On any channel, Clario drafts an asset, scores it for authenticity, rewrites it into the brand's voice to strip AI tells, and re-scores it. You watch the authenticity score climb from "Reads AI" to "Reads human," with a playbook to run it.
4. **Exports.** A full marketing plan (Markdown) and a branded pitch deck (PPTX), one click each. Any humanized asset can also be exported straight into **Google RSA, Meta, and Taboola** field formats, with live character-count checks a media buyer can paste in directly, or **pushed into the platform as a paused ad**: dry-run by default (it shows the exact API request), and real for Google Ads when credentialed. See [CONNECTORS.md](CONNECTORS.md).

5. **Campaign agent.** One click, and Clario autonomously fans out the draft, score, humanize, and re-score loop across your top channels, a full humanized creative set without clicking channel by channel.
6. **Agent readiness (GEO / AEO).** Generate the machine-facing assets that make a brand legible to AI shopping agents and answer engines: JSON-LD schema, an answer-engine FAQ, and a machine-readable offer feed. This is the other end of the barbell, marketing to the AI agent, not just the human.

More ways in:
- **Slop meter (`/check`).** Paste any existing ad, email, or landing copy for an instant authenticity score, the exact AI tells found, and a humanized rewrite. Two modes: human authenticity, and agent readiness (how well the copy holds up for AI agents to parse, cite, and act on).
- **MCP server (`mcp/`).** The whole pipeline is exposed as Model Context Protocol tools, so any AI agent (Claude Code, Cursor) can call `sequence_dna`, `recommend_channels`, `humanize`, `authenticity_score`, and the ad-push builders (`push_to_google`, `push_to_meta`, `push_to_taboola`) from the terminal. The "MCP connector" and agentic threads, made real.

## Why I built THIS one

It's Today Media buys media at scale to build email and SMS lists. Success is creative volume plus creative that actually converts. But there is a trap that a performance shop feels first and worst: AI has made it trivial to flood every channel with generic copy, and consumers now punish exactly that. From the verified research this project is grounded in: **63% of consumers are less likely to buy from a brand using AI-generated ads, and verified human trust is the moat.**

So the valuable problem is not "use AI to write more marketing faster." Everyone can do that, and it is becoming a liability. The valuable problem is: **generate at AI speed without sounding like AI.**

Clario is the answer. It encodes a brand's authentic voice once, then refuses to ship generic output: every customer-facing asset is rewritten into the Company DNA and scored, with the before/after visible. It is a creative engine that keeps the human voice, which is the exact edge a media-buying team needs and the exact thing that is getting scarce.

It also demonstrates range: it composes four skills I have already published (a voice-profiling system and a humanize/authenticity/verify stack) plus a fact-checked marketing research base, into one product.

## What I would build next (if this were the full-time job)

The obvious next move closes the loop with the actual media-buying stack:

- **MCP connectors to Google, Meta, Taboola, and TikTok.** Push the humanized creative straight into ad accounts, and pull performance back so the DNA and the plan learn from real ROAS and EPC, not just estimates.
- **Creative fatigue automation.** The research shows creative burns out fast. Auto-generate fresh, on-DNA variants on a schedule and rotate them before performance decays.
- **Landing page generation** wired to the same DNA, since the team already builds LPs to capture email and SMS.
- **Incrementality and holdout testing** baked in, so budget shifts are validated, not guessed, which is the honesty rule Clario already preaches.
- **A team workspace** with saved brands, versioned DNA, and an approval queue.

## How it works

```
Intake (URLs + docs + description)
        |
   [ingest]  scrape + parse to text                        (Convex action)
        |
   [sequence]  DeepSeek -> Company DNA + style guide        (scriveno Voice DNA, adapted)
        |
   [recommend]  DeepSeek + grounded knowledge base -> plan  (verified research, honest ranges)
        |
   ready ---> generate creative per channel:
                 draft -> authenticity score
                       -> humanize to brand voice
                       -> re-score   (before/after gauge)
```

Status transitions on the project drive a live, reactive UI via Convex, so you watch the DNA sequence and the score climb in real time.

## Stack

- **SvelteKit** (Svelte 5 runes) + **Tailwind v4**, deployed on **Vercel**
- **Convex** for the reactive database, file handling, and server actions
- **DeepSeek** (`deepseek-chat`) for DNA sequencing, recommendations, humanizing, and scoring
- **Bun**, TypeScript, `pptxgenjs` for deck export
- Design: Fraunces (display), Hanken Grotesk (body), JetBrains Mono (data). Editorial and warm on purpose, the anti-AI-slop aesthetic.

## Run it locally

Prerequisites: Bun, a Convex account, a DeepSeek API key.

```sh
bun install

# 1. Provision Convex (creates .env.local with PUBLIC_CONVEX_URL)
npx convex dev --once

# 2. Give the backend your DeepSeek key
npx convex env set DEEPSEEK_API_KEY <your-deepseek-key>

# 3. Run Convex (watch) and the app
npx convex dev        # in one terminal
bun run dev           # in another
```

Open http://localhost:5173.

## Deploy

- Push to GitHub, import into Vercel.
- Set `PUBLIC_CONVEX_URL` in Vercel to your production Convex URL.
- Run `npx convex deploy` and set `DEEPSEEK_API_KEY` on the production deployment (`npx convex env set --prod DEEPSEEK_API_KEY ...`).

## Built on my own work

Clario ports four skills I have published, into server-side prompts:

- **scriveno** Voice DNA (a 9-part, 15+ dimension voice profile) becomes Company DNA.
- **authenticity-check** (32 AI-tell patterns, four-pass, 0-100 banded score) becomes the authenticity gauge.
- **humanizer** (same catalog, rewrite to a target voice) becomes the voice-matching rewriter.
- **voiceprint** (diagnose once, rewrite once) is the generation loop.

The recommendation engine is grounded in a verified "Future of Marketing in the AI Era" research base, whose honest-ranges ethos (label forecasts, flag selection effects, never fake precision) Clario follows throughout.

## Project structure

```
convex/           backend: schema, pipeline, assets, prompts, knowledge, deepseek client
src/lib/          api surface, types, channel formats, export (md + pptx)
src/lib/components DnaCard, ChannelCard, AssetCard, Gauge, Donut, DnaHelix, Icon
src/routes/       landing, /new intake wizard, /p/[id] workspace, /check slop meter
convex/           + check.ts (slop meter), adformat.ts (ad-platform export)
mcp/              standalone MCP server exposing humanize + authenticity_score
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for the data flow and [ABOUT.md](ABOUT.md) for the philosophy.

## License

MIT. See [LICENSE](LICENSE).
