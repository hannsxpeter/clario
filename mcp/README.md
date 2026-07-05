# Clario MCP server

A small, self-contained [Model Context Protocol](https://modelcontextprotocol.io) server that exposes Clario's core capabilities as MCP tools. Any MCP-capable AI coding agent (Claude Code, Cursor, and others) can connect to it to run the full Clario pipeline from the terminal: sequence a brand's Company DNA, turn that DNA into a channel plan, score and humanize the copy, then build the ad-platform push requests.

It reuses the exact prompt builders the Clario app uses (`../convex/prompts.ts`) and calls the same DeepSeek model, so the behavior is identical to the product. The house rules carry over: sound like a person, never like AI. No em dashes, no emojis, honest ranges over false precision.

This package is fully isolated. It has its own `package.json` and `node_modules` and does not touch the app's root dependencies.

## Tools

The seven tools cover the whole Clario pipeline. A typical flow is `sequence_dna` to distill a brand's Company DNA, then `recommend_channels` to turn that DNA into a plan, then `humanize` and `authenticity_score` on the copy you write for each channel, then `push_to_google`, `push_to_meta`, or `push_to_taboola` to build the ad-platform push request. Each tool is independent, though, so you can call any of them on its own.

The first four tools call DeepSeek and need a `DEEPSEEK_API_KEY`. The three push tools are pure dry-run builders: they assemble and return the request JSON only, so they call no model, no ad platform, and need no API key.

### `sequence_dna`

Distills a business's Company DNA from any material it provides (website copy, social bios, an uploaded plan, or a plain description): its voice, identity, story, and brand rules. This is the first step of the pipeline; its output feeds the others.

Input:

- `text` (string, required): everything the business provided, as one blob of text.

Returns a JSON object with the Company DNA: `companyName`, `oneLine`, an `archetype`, a `voice` profile, `identity`, `story`, `rules` (always / never / consider), `keywords`, a `confidence` band with a note, and a compact reusable `styleGuide`.

### `recommend_channels`

Turns a Company DNA into an actionable channel plan grounded in Clario's verified marketing knowledge base, with personas and honest success and ROI ranges.

Input:

- `dna` (string, required): the Company DNA as a JSON string (as produced by `sequence_dna`) or a plain free-text description of the brand. If it parses as JSON it is passed as an object; otherwise it is passed through as-is.

Returns a JSON object with a `summary`, 2 to 3 `personas`, 8 to 14 `channels` (each with fit, `budgetPct`, success and ROI ranges, KPIs, rationale, and brand-voiced `messaging`), the `topPicks`, and a `budget` block.

### `authenticity_score`

Scores how authentically human a piece of marketing copy reads. Read-only diagnostic; it does not rewrite.

Input:

- `text` (string, required): the copy to score.
- `voice` (string, optional): a target brand voice or style guide to compare against.

Returns a JSON object with a `0-100` `score`, a `band` (`human`, `mixed`, or `ai`), the flagged AI-tell `flags` (each with the offending span, its tell family, and a note), and a short `basis` explaining the score.

### `humanize`

Rewrites copy so it reads as genuinely human, in the given brand voice if one is supplied. Preserves every fact, number, and name.

Input:

- `text` (string, required): the copy to humanize.
- `voice` (string, optional): a target brand voice or style guide to rewrite the copy into.

Returns a JSON object with the rewritten `humanized` copy and a `changed` list of short notes on what changed and why.

### `push_to_google`

Builds the exact Google Ads create-request for a responsive search ad, always as `PAUSED`, from labelled ad fields. This is a safe dry-run builder: it returns the request JSON that would be sent to create the paused ad and does not call the Google Ads API. Nothing is pushed live. It reuses `buildGoogleRequest` from `../convex/adpush.ts`, so the payload matches exactly what the app would send.

Input:

- `fields` (array, required): the ad fields as `{ label, value, limit }` objects. Headlines come from labels starting with `headline`, descriptions from labels starting with `description`.
- `finalUrl` (string, optional): the landing page URL. Defaults to `https://example.com`.

Returns the built create-request as pretty-printed JSON text (an `adGroupAds:mutate` operation with `status: "PAUSED"` and a `responsiveSearchAd`).

### `push_to_meta`

Builds the exact Meta (Facebook) AdCreative create-request from labelled ad fields, for a paused ad. Dry-run builder: it returns the request JSON and does not call the Meta Marketing API. Nothing is pushed live. It reuses `buildMetaRequest` from `../convex/adpush.ts`.

Input:

- `fields` (array, required): the ad fields as `{ label, value, limit }` objects (primary text, headline, description).
- `finalUrl` (string, optional): the landing page URL. Defaults to `https://example.com`.

Returns the built AdCreative create-request as pretty-printed JSON text, plus a `followUp` note reminding you to create the Ad itself as `PAUSED` referencing this creative.

### `push_to_taboola`

Builds the exact Taboola Backstage campaign-item create-request from labelled ad fields, as an inactive (paused) item (`is_active: false`). Dry-run builder: it returns the request JSON and does not call the Taboola Backstage API. Nothing is pushed live. It reuses `buildTaboolaRequest` from `../convex/adpush.ts`.

Input:

- `fields` (array, required): the ad fields as `{ label, value, limit }` objects (title, description).
- `finalUrl` (string, optional): the landing page URL. Defaults to `https://example.com`.

Returns the built item create-request as pretty-printed JSON text, plus a `followUp` note about attaching the thumbnail and submitting for review.

## Requirements

- [Bun](https://bun.sh) (the server runs with `bun`).
- A DeepSeek API key in the `DEEPSEEK_API_KEY` environment variable. The server calls DeepSeek's OpenAI-compatible endpoint (`https://api.deepseek.com/chat/completions`, model `deepseek-chat`).

## Install

From this directory:

```sh
bun install
```

The MCP TypeScript SDK (`@modelcontextprotocol/sdk`) is the only dependency and is already listed in this package's `package.json`.

## Run

The server speaks the MCP stdio transport, so it reads JSON-RPC on stdin and writes responses on stdout. Startup and error logs go to stderr, keeping the protocol channel clean.

```sh
DEEPSEEK_API_KEY=sk-your-key bun run index.ts
```

or, using the package script:

```sh
DEEPSEEK_API_KEY=sk-your-key bun start
```

You normally do not run it by hand. An MCP client launches it for you (see below). Running it directly is useful only to confirm it starts: it will print `Clario MCP server running on stdio.` to stderr and then wait for JSON-RPC input.

## Register it in an MCP client

Add an entry to your MCP client's server config. Use the absolute path to `index.ts` and pass your DeepSeek key through `env`.

```json
{
  "mcpServers": {
    "clario": {
      "command": "bun",
      "args": ["run", "/Users/hprincivil/Projects/itstodaymedia/clario/mcp/index.ts"],
      "env": {
        "DEEPSEEK_API_KEY": "sk-your-key"
      }
    }
  }
}
```

Notes:

- Replace the path with the absolute path on your machine if it differs, and replace `sk-your-key` with a real DeepSeek key.
- For Claude Code, this is the shape used in its MCP settings. Cursor and other clients use the same `command` / `args` / `env` fields, sometimes under a slightly different top-level key. Consult your client's MCP docs for exactly where the server list lives.

Once registered, the seven tools appear to the agent as `sequence_dna`, `recommend_channels`, `authenticity_score`, `humanize`, `push_to_google`, `push_to_meta`, and `push_to_taboola`.
