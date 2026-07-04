import { v } from 'convex/values';
import { action, internalMutation } from './_generated/server';
import { internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import { deepseekJson } from './deepseek';
import {
	creativeSystem,
	creativeUser,
	authenticitySystem,
	authenticityUser,
	humanizerSystem,
	humanizerUser
} from './prompts';
import type { AuthScore, CreativeAsset } from './types';

export const insert = internalMutation({
	args: {
		projectId: v.id('projects'),
		channelKey: v.string(),
		kind: v.string(),
		data: v.any()
	},
	handler: (ctx, { projectId, channelKey, kind, data }) =>
		ctx.db.insert('assets', {
			projectId,
			channelKey,
			kind,
			status: 'generating',
			data,
			createdAt: Date.now()
		})
});

export const update = internalMutation({
	args: { id: v.id('assets'), status: v.string(), data: v.any() },
	handler: (ctx, { id, status, data }) => ctx.db.patch(id, { status, data })
});

/**
 * Generate one creative asset and run it through the humanize-and-score loop:
 *   draft -> authenticity score -> humanize to brand voice -> re-score.
 */
export const generate = action({
	args: {
		projectId: v.id('projects'),
		channelKey: v.string(),
		channelName: v.string(),
		kind: v.string(),
		angle: v.string()
	},
	handler: async (ctx, { projectId, channelKey, channelName, kind, angle }): Promise<Id<'assets'>> => {
		const assetId: Id<'assets'> = await ctx.runMutation(internal.assets.insert, {
			projectId,
			channelKey,
			kind,
			data: { channelKey, channelName, kind, title: kind }
		});

		try {
			const dnaDoc = await ctx.runQuery(internal.projects.getDna, { projectId });
			if (!dnaDoc) throw new Error('Company DNA is not ready yet.');
			const dna = dnaDoc.data;
			const styleGuide: string = dnaDoc.styleGuide || JSON.stringify(dna?.voice ?? {});

			// 1. Draft a generic first pass. The draft stage sees only the facts,
			// not the brand voice, so it reads neutral, like any AI copy tool.
			// The humanize step below is what injects the Company DNA voice.
			const facts = {
				companyName: dna?.companyName,
				oneLine: dna?.oneLine,
				category: dna?.identity?.category,
				valueProposition: dna?.identity?.valueProposition,
				differentiators: dna?.identity?.differentiators,
				audience: dna?.identity?.audience
			};
			const draft = await deepseekJson<{ title: string; kind: string; draft: string; steps: string[] }>(
				creativeSystem(facts),
				creativeUser(channelName, kind, angle),
				0.85
			);

			// 2. Score the raw draft.
			const scoreBefore = await deepseekJson<AuthScore>(
				authenticitySystem(),
				authenticityUser(draft.draft, styleGuide),
				0.3
			);

			// 3. Humanize to the brand voice, telling it exactly which tells to fix.
			const tells = (scoreBefore.flags ?? []).map((f) => `${f.pattern}: "${f.span}"`);
			const hz = await deepseekJson<{ humanized: string; changed: string[] }>(
				humanizerSystem(styleGuide),
				humanizerUser(draft.draft, tells),
				0.7
			);

			// 4. Re-score the humanized version.
			const scoreAfter = await deepseekJson<AuthScore>(
				authenticitySystem(),
				authenticityUser(hz.humanized, styleGuide),
				0.3
			);

			const asset: CreativeAsset = {
				channelKey,
				channelName,
				kind: draft.kind || kind,
				title: draft.title || kind,
				draft: draft.draft,
				scoreBefore,
				humanized: hz.humanized,
				scoreAfter,
				changed: hz.changed ?? [],
				steps: draft.steps ?? []
			};

			await ctx.runMutation(internal.assets.update, { id: assetId, status: 'ready', data: asset });
			return assetId;
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Creative generation failed.';
			await ctx.runMutation(internal.assets.update, {
				id: assetId,
				status: 'error',
				data: { channelKey, channelName, kind, error: message }
			});
			return assetId;
		}
	}
});
