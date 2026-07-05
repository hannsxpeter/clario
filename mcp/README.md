# Clario MCP server

A small, self-contained [Model Context Protocol](https://modelcontextprotocol.io) server that exposes Clario's two core copy capabilities as MCP tools. Any MCP-capable AI coding agent (Claude Code, Cursor, and others) can connect to it to score and humanize marketing copy.

It reuses the exact prompt builders the Clario app uses (`../convex/prompts.ts`) and calls the same DeepSeek model, so the behavior is identical to the product. The house rules carry over: sound like a person, never like AI. No em dashes, no emojis, honest ranges over false precision.

This package is fully isolated. It has its own `package.json` and `node_modules` and does not touch the app's root dependencies.

## Tools

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

Once registered, the two tools appear to the agent as `authenticity_score` and `humanize`.
