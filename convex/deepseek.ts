/**
 * Minimal DeepSeek client. DeepSeek exposes an OpenAI-compatible endpoint, so
 * we call it with plain fetch (works in Convex's default runtime, no Node deps).
 *
 * Set the key once with:  npx convex env set DEEPSEEK_API_KEY sk-...
 */

declare const process: { env: Record<string, string | undefined> };

const ENDPOINT = 'https://api.deepseek.com/chat/completions';
const MODEL = 'deepseek-chat';

interface Msg {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

function key(): string {
	const k = process.env.DEEPSEEK_API_KEY;
	if (!k) {
		throw new Error(
			'DEEPSEEK_API_KEY is not set. Run: npx convex env set DEEPSEEK_API_KEY <your-key>'
		);
	}
	return k;
}

async function call(messages: Msg[], opts: { json?: boolean; temperature?: number }): Promise<string> {
	const body: Record<string, unknown> = {
		model: MODEL,
		messages,
		temperature: opts.temperature ?? 0.7,
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
					Authorization: `Bearer ${key()}`
				},
				body: JSON.stringify(body)
			});
			if (!res.ok) {
				const text = await res.text();
				// Retry transient server / rate-limit errors.
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

function sleep(ms: number) {
	return new Promise((r) => setTimeout(r, ms));
}

/** Strip accidental code fences and parse JSON, tolerating minor model noise. */
function parseJson<T>(raw: string): T {
	let s = raw.trim();
	if (s.startsWith('```')) {
		s = s.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
	}
	const first = s.indexOf('{');
	const last = s.lastIndexOf('}');
	if (first > 0 || last < s.length - 1) {
		if (first !== -1 && last !== -1) s = s.slice(first, last + 1);
	}
	return JSON.parse(s) as T;
}

/** Ask DeepSeek for a JSON object and parse it into T. */
export async function deepseekJson<T>(
	system: string,
	user: string,
	temperature = 0.6
): Promise<T> {
	const raw = await call(
		[
			{ role: 'system', content: system },
			{ role: 'user', content: user }
		],
		{ json: true, temperature }
	);
	return parseJson<T>(raw);
}

/** Ask DeepSeek for freeform text. */
export async function deepseekText(
	system: string,
	user: string,
	temperature = 0.8
): Promise<string> {
	return call(
		[
			{ role: 'system', content: system },
			{ role: 'user', content: user }
		],
		{ temperature }
	);
}
