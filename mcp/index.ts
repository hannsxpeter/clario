/**
 * Clario MCP server.
 *
 * Exposes Clario's two core copy capabilities as Model Context Protocol tools
 * over a stdio transport, so any MCP-capable AI coding agent (Claude Code,
 * Cursor, and others) can score and humanize marketing copy:
 *
 *   - authenticity_score: rate how human a piece of copy reads (0-100, banded)
 *     and flag the spans that give it away as machine-written.
 *   - humanize: rewrite copy so it reads as genuinely human, optionally in a
 *     given brand voice, with notes on what changed.
 *
 * The behavior is identical to the Clario app because both tools reuse the same
 * prompt builders from ../convex/prompts.ts (pure functions, no Convex deps) and
 * call the same DeepSeek endpoint the app uses.
 *
 * House rules from those prompts hold here too: sound like a person, never like
 * AI. No em dashes, no emojis, honest ranges over false precision.
 *
 * Run it with bun:  bun run index.ts   (or: bun start)
 * Requires the DEEPSEEK_API_KEY environment variable.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import {
	authenticitySystem,
	authenticityUser,
	humanizerSystem,
	humanizerUser
} from '../convex/prompts.ts';

/* ------------------------------------------------------------------ *
 * DeepSeek client (OpenAI-compatible endpoint, called with plain fetch).
 * Mirrors convex/deepseek.ts so the MCP tools behave like the app.
 * ------------------------------------------------------------------ */

const ENDPOINT = 'https://api.deepseek.com/chat/completions';
const MODEL = 'deepseek-chat';

interface Msg {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

function apiKey(): string {
	const k = process.env.DEEPSEEK_API_KEY;
	if (!k) {
		throw new Error(
			'DEEPSEEK_API_KEY is not set. Set it in the environment before starting the server, ' +
				'for example: DEEPSEEK_API_KEY=sk-... bun run index.ts'
		);
	}
	return k;
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Call DeepSeek and return the raw completion text. Retries transient
 * rate-limit and server errors a couple of times with a short backoff.
 */
async function callDeepSeek(
	messages: Msg[],
	opts: { json?: boolean; temperature?: number }
): Promise<string> {
	const body: Record<string, unknown> = {
		model: MODEL,
		messages,
		temperature: opts.temperature ?? 0.6,
		max_tokens: 4000
	};
	if (opts.json) body.response_format = { type: 'json_object' };

	let lastErr: unknown;
	for (let attempt = 0; attempt < 3; attempt++) {
		try {
			const res = await fetch(ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${apiKey()}`
				},
				body: JSON.stringify(body)
			});
			if (!res.ok) {
				const text = await res.text();
				if (res.status === 429 || res.status >= 500) {
					lastErr = new Error(`DeepSeek ${res.status}: ${text.slice(0, 200)}`);
					await sleep(600 * (attempt + 1));
					continue;
				}
				throw new Error(`DeepSeek ${res.status}: ${text.slice(0, 300)}`);
			}
			const json = (await res.json()) as {
				choices?: { message?: { content?: string } }[];
			};
			const content = json.choices?.[0]?.message?.content;
			if (!content) throw new Error('DeepSeek returned an empty completion.');
			return content;
		} catch (err) {
			lastErr = err;
			await sleep(500 * (attempt + 1));
		}
	}
	throw lastErr instanceof Error ? lastErr : new Error('DeepSeek request failed');
}

/** Strip accidental code fences and parse JSON, tolerating minor model noise. */
function parseJson(raw: string): unknown {
	let s = raw.trim();
	if (s.startsWith('```')) {
		s = s
			.replace(/^```(?:json)?/i, '')
			.replace(/```$/, '')
			.trim();
	}
	const first = s.indexOf('{');
	const last = s.lastIndexOf('}');
	if (first !== -1 && last !== -1 && (first > 0 || last < s.length - 1)) {
		s = s.slice(first, last + 1);
	}
	return JSON.parse(s);
}

/** Ask DeepSeek for a JSON object and parse it. */
async function deepseekJson(system: string, user: string, temperature: number): Promise<unknown> {
	const raw = await callDeepSeek(
		[
			{ role: 'system', content: system },
			{ role: 'user', content: user }
		],
		{ json: true, temperature }
	);
	return parseJson(raw);
}

/* ------------------------------------------------------------------ *
 * MCP server and tools.
 * ------------------------------------------------------------------ */

const server = new McpServer({
	name: 'clario',
	version: '0.1.0'
});

/**
 * authenticity_score
 * Scores how authentically human a piece of marketing copy reads and flags the
 * AI-tell spans. Read-only diagnostic; it does not rewrite.
 */
server.registerTool(
	'authenticity_score',
	{
		title: 'Authenticity score',
		description:
			'Score how authentically human a piece of marketing copy reads, from 0 to 100 with a band ' +
			'(human, mixed, or ai), and flag the spans that read as machine-written. Optionally compare ' +
			'against a target brand voice. Does not rewrite the copy.',
		inputSchema: {
			text: z.string().describe('The marketing copy to score.'),
			voice: z
				.string()
				.optional()
				.describe('Optional target brand voice or style guide to compare the copy against.')
		}
	},
	async ({ text, voice }) => {
		const result = await deepseekJson(authenticitySystem(), authenticityUser(text, voice), 0.4);
		return {
			content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
		};
	}
);

/**
 * humanize
 * Rewrites copy so it reads as genuinely human, in the given brand voice if one
 * is supplied, and reports what changed.
 */
server.registerTool(
	'humanize',
	{
		title: 'Humanize copy',
		description:
			'Rewrite marketing copy so it reads as genuinely human, stripping the machine tells. If a ' +
			'target brand voice is supplied, re-voice the copy into it. Preserves every fact, number, and ' +
			'name. Returns the rewritten copy plus notes on what changed.',
		inputSchema: {
			text: z.string().describe('The marketing copy to humanize.'),
			voice: z
				.string()
				.optional()
				.describe('Optional target brand voice or style guide to rewrite the copy into.')
		}
	},
	async ({ text, voice }) => {
		const result = await deepseekJson(
			humanizerSystem(voice ?? ''),
			humanizerUser(text),
			0.7
		);
		return {
			content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
		};
	}
);

/* ------------------------------------------------------------------ *
 * Start the stdio server.
 * ------------------------------------------------------------------ */

async function main(): Promise<void> {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	// Log to stderr so it never pollutes the stdio JSON-RPC channel on stdout.
	console.error('Clario MCP server running on stdio.');
}

main().catch((err) => {
	console.error('Fatal error starting Clario MCP server:', err);
	process.exit(1);
});
