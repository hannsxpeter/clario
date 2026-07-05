import { v } from 'convex/values';
import { action } from './_generated/server';
import { deepseekJson } from './deepseek';
import {
	authenticitySystem,
	authenticityUser,
	humanizerSystem,
	humanizerUser
} from './prompts';
import type { AuthScore } from './types';

/**
 * Standalone "slop meter": paste any marketing copy, get an authenticity score,
 * a humanized rewrite, and a re-score. No project or DNA required. Reuses the
 * same authenticity and humanizer prompts as the main pipeline.
 */
export const run = action({
	args: { text: v.string(), voice: v.optional(v.string()) },
	handler: async (ctx, { text, voice }) => {
		const styleGuide =
			voice && voice.trim()
				? voice.trim()
				: 'A clear, human, specific voice. Plain words, concrete details, strong point of view, no corporate filler and no AI-tell vocabulary.';

		const scoreBefore = await deepseekJson<AuthScore>(
			authenticitySystem(),
			authenticityUser(text, voice),
			0.3
		);
		const tells = (scoreBefore.flags ?? []).map((f) => `${f.pattern}: "${f.span}"`);
		const hz = await deepseekJson<{ humanized: string; changed: string[] }>(
			humanizerSystem(styleGuide),
			humanizerUser(text, tells),
			0.7
		);
		const scoreAfter = await deepseekJson<AuthScore>(
			authenticitySystem(),
			authenticityUser(hz.humanized, voice),
			0.3
		);

		return {
			scoreBefore,
			humanized: hz.humanized,
			changed: hz.changed ?? [],
			scoreAfter
		};
	}
});

/** Score how ready a piece of copy is for AI agents and answer engines to parse, cite, and act on. */
export const agentScore = action({
	args: { text: v.string() },
	handler: async (ctx, { text }) => {
		const system = `You score how ready a piece of marketing copy or a page is for AI agents and answer engines to parse, cite, and act on (GEO and AEO, agentic commerce readiness). Score 0 to 100. High means concrete verifiable facts, clear named entities and offers, unambiguous claims, structured and skimmable, and machine-parseable specifics (what, who, and price or terms where relevant). Low means vague, hype-driven, no concrete entity or offer, ambiguous, nothing an agent could quote or act on. Never use em dashes or en dashes. Never use emojis.

Respond with a single JSON object, no prose:
{ "score": number, "band": "ready" | "partial" | "weak", "issues": [{ "span": string, "note": string }], "fixes": string[], "basis": string }`;
		const user = `Score this copy for AI-agent readiness:\n---\n${text}\n---`;
		return deepseekJson<{
			score: number;
			band: string;
			issues: { span: string; note: string }[];
			fixes: string[];
			basis: string;
		}>(system, user, 0.3);
	}
});
