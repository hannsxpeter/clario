import { v } from 'convex/values';
import { internalAction } from './_generated/server';
import { internal } from './_generated/api';
import { deepseekJson } from './deepseek';
import { dnaSystem, dnaUser, recommendSystem, recommendUser } from './prompts';
import { MARKETING_KNOWLEDGE } from './knowledge';
import type { CompanyDna, Recommendations } from './types';

/** Fetch a URL and reduce it to readable text. Best-effort: failures are skipped. */
async function scrape(url: string): Promise<string | null> {
	try {
		const withProto = /^https?:\/\//i.test(url) ? url : `https://${url}`;
		const res = await fetch(withProto, {
			headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ClarioBot/1.0)' }
		});
		if (!res.ok) return null;
		const html = await res.text();
		return htmlToText(html).slice(0, 4500);
	} catch {
		return null;
	}
}

function htmlToText(html: string): string {
	return html
		.replace(/<script[\s\S]*?<\/script>/gi, ' ')
		.replace(/<style[\s\S]*?<\/style>/gi, ' ')
		.replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
		.replace(/<!--[\s\S]*?-->/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/gi, ' ')
		.replace(/&amp;/gi, '&')
		.replace(/&#39;|&rsquo;|&lsquo;/gi, "'")
		.replace(/&quot;|&ldquo;|&rdquo;/gi, '"')
		.replace(/\s+/g, ' ')
		.trim();
}

export const run = internalAction({
	args: { projectId: v.id('projects') },
	handler: async (ctx, { projectId }) => {
		try {
			const project = await ctx.runQuery(internal.projects.getRaw, { id: projectId });
			if (!project) return;
			const inputs = project.inputs;

			// 1. Ingest --------------------------------------------------------
			await ctx.runMutation(internal.projects.setStatus, { id: projectId, status: 'ingesting' });
			const parts: string[] = [];
			const sources: { label: string; ok: boolean }[] = [];

			if (inputs.description?.trim()) {
				parts.push(`FOUNDER DESCRIPTION:\n${inputs.description.trim()}`);
				sources.push({ label: 'Description', ok: true });
			}
			if (inputs.docText?.trim()) {
				parts.push(`UPLOADED DOCUMENT (${inputs.docName ?? 'document'}):\n${inputs.docText.slice(0, 6000)}`);
				sources.push({ label: inputs.docName ?? 'Document', ok: true });
			}
			for (const url of inputs.urls.filter((u) => u.trim())) {
				const text = await scrape(url);
				sources.push({ label: url, ok: Boolean(text) });
				if (text) parts.push(`SOURCE ${url}:\n${text}`);
			}

			const sourceText = parts.join('\n\n---\n\n').slice(0, 16000);
			if (!sourceText.trim()) {
				throw new Error(
					'Could not read any usable content from the inputs. Add a description, a document, or a reachable URL.'
				);
			}
			await ctx.runMutation(internal.projects.saveSource, { id: projectId, sourceText, sources });

			// 2. Sequence the DNA ---------------------------------------------
			await ctx.runMutation(internal.projects.setStatus, { id: projectId, status: 'sequencing' });
			const dnaOut = await deepseekJson<CompanyDna & { styleGuide: string }>(
				dnaSystem(),
				dnaUser(sourceText),
				0.5
			);
			const { styleGuide, ...dna } = dnaOut;
			await ctx.runMutation(internal.projects.saveDna, {
				projectId,
				data: dna,
				styleGuide: styleGuide ?? ''
			});

			// 3. Recommend channels -------------------------------------------
			await ctx.runMutation(internal.projects.setStatus, { id: projectId, status: 'recommending' });
			const recs = await deepseekJson<Recommendations>(
				recommendSystem(),
				recommendUser(dna, MARKETING_KNOWLEDGE, {
					goals: inputs.goals,
					monthlyBudget: inputs.monthlyBudget
				}),
				0.6
			);
			await ctx.runMutation(internal.projects.saveRecommendations, { projectId, data: recs });

			await ctx.runMutation(internal.projects.setStatus, { id: projectId, status: 'ready' });
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Unknown error during sequencing.';
			await ctx.runMutation(internal.projects.setError, { id: projectId, error: message });
		}
	}
});
