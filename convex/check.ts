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
