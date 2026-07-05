import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { api } from './_generated/api';

/** Pick a sensible default creative format for a channel (server-side mirror of the UI helper). */
function defaultKind(key: string, name: string): string {
	const h = `${key} ${name}`.toLowerCase();
	if (h.includes('tv') || h.includes('ctv') || h.includes('ott')) return '30s TV script';
	if (h.includes('radio') || h.includes('audio') || h.includes('podcast')) return '30s radio spot';
	if (h.includes('search') || h.includes('ppc') || h.includes('sem')) return 'responsive search ad';
	if (h.includes('social')) return 'paid social ad';
	if (h.includes('native') || h.includes('taboola') || h.includes('discovery')) return 'native headline + hook';
	if (h.includes('affiliate')) return 'affiliate angle brief';
	if (h.includes('influencer') || h.includes('creator')) return 'creator brief';
	if (h.includes('email')) return 'welcome email';
	if (h.includes('sms')) return 'SMS sequence';
	if (h.includes('landing') || h.includes('website') || h.includes('page')) return 'landing page hero';
	if (h.includes('seo')) return 'SEO content brief';
	if (h.includes('geo') || h.includes('aeo') || h.includes('answer')) return 'GEO answer block';
	if (h.includes('display') || h.includes('programmatic')) return 'display ad set';
	if (h.includes('community') || h.includes('dark social')) return 'community post';
	if (h.includes('pr')) return 'digital PR pitch';
	if (h.includes('review') || h.includes('ugc')) return 'review-request flow';
	return 'ad copy';
}

/**
 * Campaign agent: reads the project's own recommendations, selects the top
 * channels, and autonomously fans out the draft -> score -> humanize -> re-score
 * loop for each one. Returns immediately; the assets stream in as each completes.
 */
export const run = mutation({
	args: { projectId: v.id('projects') },
	handler: async (ctx, { projectId }) => {
		const rec = await ctx.db
			.query('recommendations')
			.withIndex('by_project', (q) => q.eq('projectId', projectId))
			.first();
		if (!rec) throw new Error('Recommendations are not ready yet.');

		const channels = (rec.data?.channels ?? []) as {
			key: string;
			name: string;
			messaging?: string;
			isTopPick?: boolean;
			budgetPct?: number;
		}[];

		const topPicks = channels.filter((c) => c.isTopPick);
		const chosen = (topPicks.length ? topPicks : channels)
			.slice()
			.sort((a, b) => (b.budgetPct ?? 0) - (a.budgetPct ?? 0))
			.slice(0, 5);

		for (const c of chosen) {
			await ctx.scheduler.runAfter(0, api.assets.generate, {
				projectId,
				channelKey: c.key,
				channelName: c.name,
				kind: defaultKind(c.key, c.name),
				angle: c.messaging ?? ''
			});
		}

		return chosen.length;
	}
});
