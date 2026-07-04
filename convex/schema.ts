import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

/**
 * Clario data model.
 *
 * The large AI outputs (DNA, recommendations, creative) are stored under a
 * `data` field typed as v.any() on purpose: the shapes are rich and evolve
 * quickly, and the authoritative TypeScript types live in `convex/types.ts`.
 * Status transitions on `projects` drive the live, reactive UI.
 */
export default defineSchema({
	projects: defineTable({
		// created | ingesting | sequencing | recommending | ready | error
		status: v.string(),
		inputs: v.object({
			urls: v.array(v.string()),
			docName: v.optional(v.string()),
			docText: v.optional(v.string()),
			description: v.optional(v.string()),
			goals: v.optional(v.string()),
			monthlyBudget: v.optional(v.number())
		}),
		sourceText: v.optional(v.string()),
		sources: v.optional(v.array(v.object({ label: v.string(), ok: v.boolean() }))),
		error: v.optional(v.string()),
		createdAt: v.number()
	}),

	dna: defineTable({
		projectId: v.id('projects'),
		data: v.any(),
		styleGuide: v.string(),
		createdAt: v.number()
	}).index('by_project', ['projectId']),

	recommendations: defineTable({
		projectId: v.id('projects'),
		data: v.any(),
		createdAt: v.number()
	}).index('by_project', ['projectId']),

	assets: defineTable({
		projectId: v.id('projects'),
		channelKey: v.string(),
		kind: v.string(),
		status: v.string(), // generating | ready | error
		data: v.any(),
		createdAt: v.number()
	}).index('by_project', ['projectId'])
});
