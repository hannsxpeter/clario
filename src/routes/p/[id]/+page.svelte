<script lang="ts">
	import { page } from '$app/state';
	import { useQuery, useConvexClient } from 'convex-svelte';
	import { api, type Id } from '$lib/api';
	import type { CompanyDna, Recommendations, ChannelRec } from '$lib/appTypes';
	import { exportMarkdownPlan, exportDeck } from '$lib/export';
	import Icon from '$lib/components/Icon.svelte';
	import DnaHelix from '$lib/components/DnaHelix.svelte';
	import DnaCard from '$lib/components/DnaCard.svelte';
	import ChannelCard from '$lib/components/ChannelCard.svelte';
	import AssetCard from '$lib/components/AssetCard.svelte';
	import Donut from '$lib/components/Donut.svelte';

	const id = $derived(page.params.id as Id<'projects'>);
	const client = useConvexClient();
	const q = useQuery(api.projects.get, () => ({ id }));

	const project = $derived(q.data?.project ?? null);
	const dna = $derived(q.data?.dna?.data as CompanyDna | undefined);
	const recs = $derived(q.data?.recommendations?.data as Recommendations | undefined);
	const assets = $derived(
		[...(q.data?.assets ?? [])].sort((a, b) => b.createdAt - a.createdAt)
	);
	const status = $derived(project?.status ?? 'created');
	const busy = $derived(!['ready', 'error'].includes(status));

	const budgetSegments = $derived(
		recs
			? recs.channels
					.filter((c) => c.budgetPct > 0)
					.sort((a, b) => b.budgetPct - a.budgetPct)
					.slice(0, 9)
					.map((c) => ({ label: c.name, value: c.budgetPct }))
			: []
	);
	const sortedChannels = $derived(
		recs ? [...recs.channels].sort((a, b) => Number(b.isTopPick) - Number(a.isTopPick) || b.budgetPct - a.budgetPct) : []
	);

	let generating = $state<Set<string>>(new Set());

	const stepStates = $derived([
		{ key: 'read', label: 'Reading your sources', done: !['created', 'ingesting'].includes(status), active: ['created', 'ingesting'].includes(status) },
		{ key: 'dna', label: 'Sequencing Company DNA', done: ['recommending', 'ready'].includes(status), active: status === 'sequencing' },
		{ key: 'plan', label: 'Building your channel plan', done: status === 'ready', active: status === 'recommending' }
	]);

	async function generate(channel: ChannelRec, kind: string) {
		if (generating.has(channel.key)) return;
		generating = new Set(generating).add(channel.key);
		try {
			await client.action(api.assets.generate, {
				projectId: id,
				channelKey: channel.key,
				channelName: channel.name,
				kind,
				angle: channel.messaging
			});
		} finally {
			const next = new Set(generating);
			next.delete(channel.key);
			generating = next;
		}
	}
</script>

{#if q.isLoading && !q.data}
	<div class="center-state"><Icon name="refresh" size={22} class="spin" /> Loading...</div>
{:else if !project}
	<div class="center-state">
		<p>That project could not be found.</p>
		<a href="/new" class="btn btn-primary">Start a new one</a>
	</div>
{:else if status === 'error'}
	<div class="wrap">
		<div class="err-card card">
			<Icon name="alert" size={28} />
			<h1 class="display-lg">Sequencing hit a snag</h1>
			<p>{project.error}</p>
			<a href="/new" class="btn btn-primary"><Icon name="arrowLeft" size={16} /> Try again</a>
		</div>
	</div>
{:else if busy || !dna}
	<div class="wrap seq">
		<div class="seq-helix" aria-hidden="true"><DnaHelix width={460} height={180} strands={26} /></div>
		<span class="eyebrow">Sequencing</span>
		<h1 class="display-lg">Reading the signal, finding the voice.</h1>
		<div class="seq-steps">
			{#each stepStates as s (s.key)}
				<div class="seq-step" class:done={s.done} class:active={s.active}>
					<span class="dot">
						{#if s.done}<Icon name="check" size={13} />{:else if s.active}<Icon name="refresh" size={13} class="spin" />{/if}
					</span>
					<span>{s.label}</span>
				</div>
			{/each}
		</div>
		{#if project.sources?.length}
			<div class="sources">
				{#each project.sources as src (src.label)}
					<span class="src" class:bad={!src.ok}>
						<Icon name={src.ok ? 'check' : 'x'} size={12} />{src.label}
					</span>
				{/each}
			</div>
		{/if}
	</div>
{:else}
	<div class="wrap ready">
		<!-- DNA -->
		<DnaCard {dna} />

		{#if recs}
			<!-- Overview + budget -->
			<section class="over">
				<div class="over-copy">
					<span class="eyebrow">The plan</span>
					<h2 class="display-lg">Where to invest, and what to say.</h2>
					<p class="over-sum prose-serif">{recs.summary}</p>
					<div class="exports">
						<button class="btn btn-primary" onclick={() => exportMarkdownPlan(dna, recs!)}>
							<Icon name="download" size={16} /> Marketing plan
						</button>
						<button class="btn btn-ghost" onclick={() => exportDeck(dna, recs!)}>
							<Icon name="layers" size={16} /> Pitch deck
						</button>
					</div>
				</div>
				{#if budgetSegments.length}
					<div class="budget card-flat">
						<span class="eyebrow">Budget split</span>
						<Donut segments={budgetSegments} size={200}>
							<span class="bud-c-num font-display">{recs.budget?.total ? `$${recs.budget.total.toLocaleString()}` : `${recs.channels.length}`}</span>
							<span class="bud-c-lab">{recs.budget?.total ? 'per month' : 'channels'}</span>
						</Donut>
						<p class="bud-note">{recs.budget?.notes}</p>
					</div>
				{/if}
			</section>

			<!-- Personas -->
			{#if recs.personas?.length}
				<section class="personas">
					<h3 class="sec-h"><Icon name="users" size={18} /> Who you are talking to</h3>
					<div class="persona-grid">
						{#each recs.personas as p (p.name)}
							<div class="persona card-flat">
								<h4 class="font-display">{p.name}</h4>
								<p class="p-snap">{p.snapshot}</p>
								<div class="p-row"><span>Demographics</span>{p.demographics}</div>
								<div class="p-row"><span>Psychographics</span>{p.psychographics}</div>
								<div class="p-angle"><Icon name="target" size={13} /> {p.messageAngle}</div>
							</div>
						{/each}
					</div>
				</section>
			{/if}

			<!-- Channels -->
			<section class="channels">
				<h3 class="sec-h"><Icon name="compass" size={18} /> Channel recommendations</h3>
				<p class="sec-note">Honest ranges, not guarantees. Forecasts are labeled. Generate creative on any channel, it is drafted, scored, then humanized into your voice.</p>
				<div class="channel-grid">
					{#each sortedChannels as channel (channel.key)}
						<ChannelCard {channel} generating={generating.has(channel.key)} onGenerate={generate} />
					{/each}
				</div>
			</section>

			<!-- Generated assets -->
			{#if assets.length}
				<section class="assets">
					<h3 class="sec-h"><Icon name="feather" size={18} /> Your humanized creative</h3>
					<div class="asset-grid">
						{#each assets as a (a._id)}
							<AssetCard asset={a} />
						{/each}
					</div>
				</section>
			{/if}
		{/if}
	</div>
{/if}

<style>
	.wrap {
		max-width: 1180px;
		margin: 0 auto;
		padding: clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 2.5rem) 3rem;
	}
	.center-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 6rem 1rem;
		color: var(--color-ink-soft);
	}
	.err-card {
		text-align: center;
		padding: 3rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		color: var(--color-ai);
	}
	.err-card p {
		color: var(--color-ink-soft);
		max-width: 50ch;
	}
	/* Sequencing */
	.seq {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 3rem;
	}
	.seq-helix {
		margin-bottom: 1.5rem;
	}
	.seq h1 {
		margin: 0.6rem 0 2rem;
		max-width: 20ch;
	}
	.seq-steps {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		align-items: flex-start;
	}
	.seq-step {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		font-size: 1.05rem;
		color: var(--color-ink-muted);
		opacity: 0.6;
	}
	.seq-step.active {
		color: var(--color-accent-deep);
		opacity: 1;
		font-weight: 500;
	}
	.seq-step.done {
		color: var(--color-ink);
		opacity: 1;
	}
	.dot {
		width: 24px;
		height: 24px;
		border-radius: 999px;
		border: 1.5px solid currentColor;
		display: grid;
		place-items: center;
	}
	.seq-step.done .dot {
		background: var(--color-human);
		border-color: var(--color-human);
		color: #fff;
	}
	.sources {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		justify-content: center;
		margin-top: 2rem;
		max-width: 40ch;
	}
	.src {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--color-human);
	}
	.src.bad {
		color: var(--color-ink-muted);
	}
	/* Ready */
	.ready {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}
	.over {
		display: grid;
		grid-template-columns: 1fr 280px;
		gap: 2rem;
		align-items: center;
	}
	.over-sum {
		font-size: 1.2rem;
		color: var(--color-ink-soft);
		margin: 0.8rem 0 1.4rem;
		max-width: 54ch;
	}
	.exports {
		display: flex;
		gap: 0.7rem;
		flex-wrap: wrap;
	}
	.budget {
		padding: 1.4rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
	}
	.bud-c-num {
		font-size: 1.6rem;
	}
	.bud-c-lab {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-ink-muted);
	}
	.bud-note {
		font-size: 0.8rem;
		color: var(--color-ink-muted);
		text-align: center;
		line-height: 1.4;
	}
	.sec-h {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-display);
		font-size: 1.6rem;
		margin-bottom: 0.4rem;
	}
	.sec-note {
		color: var(--color-ink-soft);
		font-size: 0.98rem;
		margin-bottom: 1.4rem;
		max-width: 70ch;
	}
	.persona-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.2rem;
		margin-top: 1rem;
	}
	.persona {
		padding: 1.2rem;
	}
	.persona h4 {
		font-size: 1.2rem;
	}
	.p-snap {
		color: var(--color-ink-soft);
		font-size: 0.95rem;
		margin: 0.4rem 0 0.9rem;
		line-height: 1.45;
	}
	.p-row {
		font-size: 0.86rem;
		color: var(--color-ink-soft);
		margin-bottom: 0.4rem;
		line-height: 1.4;
	}
	.p-row span {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.64rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-ink-muted);
	}
	.p-angle {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.7rem;
		font-size: 0.9rem;
		color: var(--color-accent-deep);
		font-style: italic;
		font-family: var(--font-display);
	}
	.channel-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.2rem;
	}
	.asset-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
		gap: 1.4rem;
		margin-top: 1rem;
	}
	:global(.spin) {
		animation: spin 0.9s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	@media (max-width: 820px) {
		.over {
			grid-template-columns: 1fr;
		}
	}
</style>
