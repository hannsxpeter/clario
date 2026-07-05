import { v } from 'convex/values';
import { action } from './_generated/server';
import { deepseekJson } from './deepseek';

/**
 * Reformat approved, humanized copy into the exact field structure a media buyer
 * pastes into an ad platform, respecting each platform's character limits.
 */
const SPECS: Record<string, string> = {
	google:
		'Google Responsive Search Ad. Provide up to 8 "headlines" (each 30 characters MAX) and up to 4 "descriptions" (each 90 characters MAX). Each headline and description is one field.',
	meta:
		'Meta (Facebook and Instagram) single-image ad. Provide exactly these fields: "Primary text" (aim under 125 characters), "Headline" (40 characters MAX), "Description" (30 characters MAX).',
	taboola:
		'Taboola native ad. Provide these fields: "Title" (about 60 characters MAX, no clickbait punctuation), "Description" (about 120 characters MAX), and "Thumbnail brief" (one line describing the ideal image).'
};

export const forPlatform = action({
	args: { text: v.string(), platform: v.string(), voice: v.optional(v.string()) },
	handler: async (ctx, { text, platform, voice }) => {
		const spec = SPECS[platform] ?? SPECS.google;
		const voiceLine = voice && voice.trim() ? `\nKeep the brand voice: ${voice.trim()}` : '';
		const system = `You reformat approved marketing copy into the exact ad-platform fields a media buyer pastes in. Keep the meaning, the facts, and the voice. Only reshape and trim to fit. Respect every character limit strictly, if a limit is given, no field may exceed it. Never use em dashes or en dashes. Never use emojis.${voiceLine}

Target format: ${spec}

Respond with a single JSON object, no prose:
{ "platform": string, "fields": [{ "label": string, "value": string, "limit": number }], "notes": string }`;
		const user = `Reformat this approved copy for the platform. Do not invent new claims:\n---\n${text}\n---`;
		return deepseekJson<{
			platform: string;
			fields: { label: string; value: string; limit: number }[];
			notes: string;
		}>(system, user, 0.5);
	}
});
