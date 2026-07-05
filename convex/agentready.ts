import { v } from 'convex/values';
import { action } from './_generated/server';
import { internal } from './_generated/api';
import { deepseekJson } from './deepseek';

/**
 * Agent-readiness pack: the machine-facing end of the barbell. Given a brand's
 * Company DNA, generate assets that AI shopping agents, chat assistants, and
 * answer engines can parse, cite, and act on (GEO / AEO / agentic commerce).
 */
export const run = action({
	args: { projectId: v.id('projects') },
	handler: async (
		ctx,
		{ projectId }
	): Promise<{ schema: string; faq: { q: string; a: string }[]; offerFeed: string; notes: string[] }> => {
		const dnaDoc = await ctx.runQuery(internal.projects.getDna, { projectId });
		if (!dnaDoc) throw new Error('Company DNA is not ready yet.');
		const dna = dnaDoc.data;

		const system = `You make a brand legible to AI agents and answer engines (GEO and AEO), the machine-facing end of modern marketing. Given a brand's Company DNA, produce agent-ready assets that AI shopping agents, chat assistants, and answer engines can parse, cite, and act on. Be accurate to the DNA and do not invent facts, prices, or claims it does not support. Never use em dashes or en dashes. Never use emojis.

Produce:
1. schema: a valid JSON-LD block (as a string) using schema.org, an Organization plus a relevant Product or Service, and an Offer if applicable, filled from the DNA. It must be valid JSON-LD.
2. faq: 5 to 7 question and answer pairs, phrased the way a real customer would ask an AI assistant, answered concisely and citably in the brand voice. This is the content answer engines quote.
3. offerFeed: a compact machine-readable JSON string describing the core offer or offers: name, category, value proposition, audience, key differentiators, and a plain-language reason to choose. This is what an agent reads to pre-qualify the brand.
4. notes: 2 to 4 short, concrete steps to become more agent-ready (structured data, entity clarity, machine-readable pricing and terms, presence in communities that answer engines cite).

Respond with a single JSON object, no prose:
{ "schema": string, "faq": [{ "q": string, "a": string }], "offerFeed": string, "notes": string[] }`;
		const user = `Company DNA:\n${JSON.stringify(dna)}\n\nProduce the agent-readiness pack as JSON.`;

		return deepseekJson<{
			schema: string;
			faq: { q: string; a: string }[];
			offerFeed: string;
			notes: string[];
		}>(system, user, 0.5);
	}
});
