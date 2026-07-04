import { v } from 'convex/values';
import { mutation, query, internalMutation, internalQuery } from './_generated/server';
import { internal } from './_generated/api';

const inputsValidator = v.object({
	urls: v.array(v.string()),
	docName: v.optional(v.string()),
	docText: v.optional(v.string()),
	description: v.optional(v.string()),
	goals: v.optional(v.string()),
	monthlyBudget: v.optional(v.number())
});

/** Create a project and kick off the async DNA + recommendations pipeline. */
export const create = mutation({
	args: { inputs: inputsValidator },
	handler: async (ctx, { inputs }) => {
		const id = await ctx.db.insert('projects', {
			status: 'created',
			inputs,
			createdAt: Date.now()
		});
		await ctx.scheduler.runAfter(0, internal.pipeline.run, { projectId: id });
		return id;
	}
});

/** Everything the project page needs, in one reactive query. */
export const get = query({
	args: { id: v.id('projects') },
	handler: async (ctx, { id }) => {
		const project = await ctx.db.get(id);
		if (!project) return null;
		const dna = await ctx.db
			.query('dna')
			.withIndex('by_project', (q) => q.eq('projectId', id))
			.first();
		const recommendations = await ctx.db
			.query('recommendations')
			.withIndex('by_project', (q) => q.eq('projectId', id))
			.first();
		const assets = await ctx.db
			.query('assets')
			.withIndex('by_project', (q) => q.eq('projectId', id))
			.collect();
		return { project, dna, recommendations, assets };
	}
});

/* ----------------------- internal helpers ----------------------- */

export const getRaw = internalQuery({
	args: { id: v.id('projects') },
	handler: (ctx, { id }) => ctx.db.get(id)
});

export const getDna = internalQuery({
	args: { projectId: v.id('projects') },
	handler: (ctx, { projectId }) =>
		ctx.db
			.query('dna')
			.withIndex('by_project', (q) => q.eq('projectId', projectId))
			.first()
});

export const setStatus = internalMutation({
	args: { id: v.id('projects'), status: v.string() },
	handler: (ctx, { id, status }) => ctx.db.patch(id, { status })
});

export const setError = internalMutation({
	args: { id: v.id('projects'), error: v.string() },
	handler: (ctx, { id, error }) => ctx.db.patch(id, { status: 'error', error })
});

export const saveSource = internalMutation({
	args: {
		id: v.id('projects'),
		sourceText: v.string(),
		sources: v.array(v.object({ label: v.string(), ok: v.boolean() }))
	},
	handler: (ctx, { id, sourceText, sources }) => ctx.db.patch(id, { sourceText, sources })
});

export const saveDna = internalMutation({
	args: { projectId: v.id('projects'), data: v.any(), styleGuide: v.string() },
	handler: (ctx, { projectId, data, styleGuide }) =>
		ctx.db.insert('dna', { projectId, data, styleGuide, createdAt: Date.now() })
});

export const saveRecommendations = internalMutation({
	args: { projectId: v.id('projects'), data: v.any() },
	handler: (ctx, { projectId, data }) =>
		ctx.db.insert('recommendations', { projectId, data, createdAt: Date.now() })
});
