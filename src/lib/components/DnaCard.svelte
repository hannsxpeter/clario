<script lang="ts">
	import type { CompanyDna } from '$lib/appTypes';
	import Icon from './Icon.svelte';

	interface Props {
		dna: CompanyDna;
	}
	let { dna }: Props = $props();

	const confColor: Record<string, string> = {
		high: 'var(--color-human)',
		medium: 'var(--color-mixed)',
		low: 'var(--color-ai)'
	};
</script>

<article class="dna card reveal">
	<header class="head">
		<div class="head-top">
			<span class="eyebrow">Company DNA</span>
			<span class="chip" style="border-color:{confColor[dna.confidence]}; color:{confColor[dna.confidence]}">
				{dna.confidence} confidence
			</span>
		</div>
		<h2 class="font-display name">{dna.companyName}</h2>
		<p class="one-line prose-serif">{dna.oneLine}</p>
		<div class="archetype">
			<Icon name="compass" size={18} />
			<span><strong>{dna.archetype.name}</strong> {dna.archetype.why}</span>
		</div>
	</header>

	<div class="grid">
		<section class="block">
			<h3 class="blk-title"><Icon name="feather" size={15} /> Voice</h3>
			<dl class="rows">
				<div><dt>Register</dt><dd>{dna.voice.register}</dd></div>
				<div><dt>Cadence</dt><dd>{dna.voice.cadence}</dd></div>
				<div><dt>Vocabulary</dt><dd>{dna.voice.vocabulary}</dd></div>
				<div><dt>Sentence shape</dt><dd>{dna.voice.sentenceShape}</dd></div>
				<div><dt>Figurative</dt><dd>{dna.voice.figurativeDensity}</dd></div>
				<div><dt>Humor</dt><dd>{dna.voice.humor}</dd></div>
			</dl>
			{#if dna.voice.signaturePhrases?.length}
				<div class="phrases">
					{#each dna.voice.signaturePhrases as p (p)}
						<span class="phrase"><Icon name="quote" size={13} />{p}</span>
					{/each}
				</div>
			{/if}
		</section>

		<section class="block">
			<h3 class="blk-title"><Icon name="target" size={15} /> Identity</h3>
			<dl class="rows">
				<div><dt>Mission</dt><dd>{dna.identity.mission}</dd></div>
				<div><dt>Category</dt><dd>{dna.identity.category}</dd></div>
				<div><dt>Value</dt><dd>{dna.identity.valueProposition}</dd></div>
				<div><dt>Audience</dt><dd>{dna.identity.audience}</dd></div>
			</dl>
			{#if dna.identity.differentiators?.length}
				<ul class="pills">
					{#each dna.identity.differentiators as d (d)}<li>{d}</li>{/each}
				</ul>
			{/if}
		</section>

		<section class="block story">
			<h3 class="blk-title"><Icon name="dna" size={15} /> Story</h3>
			<div class="story-flow">
				<div class="beat"><span class="beat-k">Origin</span><p>{dna.story.origin}</p></div>
				<div class="beat"><span class="beat-k">The villain</span><p>{dna.story.villain}</p></div>
				<div class="beat"><span class="beat-k">Transformation</span><p>{dna.story.transformation}</p></div>
			</div>
			{#if dna.story.motifs?.length}
				<div class="phrases">
					{#each dna.story.motifs as m (m)}<span class="phrase">{m}</span>{/each}
				</div>
			{/if}
		</section>

		<section class="block">
			<h3 class="blk-title"><Icon name="shield" size={15} /> Voice rules</h3>
			<div class="rules">
				<div class="rule always">
					<span class="rk">Always</span>
					<ul>{#each dna.rules.always as r (r)}<li>{r}</li>{/each}</ul>
				</div>
				<div class="rule never">
					<span class="rk">Never</span>
					<ul>{#each dna.rules.never as r (r)}<li>{r}</li>{/each}</ul>
				</div>
			</div>
		</section>
	</div>
</article>

<style>
	.dna {
		padding: clamp(1.4rem, 3vw, 2.4rem);
		overflow: hidden;
	}
	.head {
		padding-bottom: 1.4rem;
		margin-bottom: 1.5rem;
		border-bottom: 1px solid var(--color-line);
	}
	.head-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.name {
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 420;
		margin: 0.5rem 0 0.3rem;
		line-height: 1;
	}
	.one-line {
		font-size: 1.2rem;
		color: var(--color-ink-soft);
		max-width: 60ch;
		margin-bottom: 1rem;
	}
	.archetype {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		font-size: 0.95rem;
		color: var(--color-ink-soft);
		background: var(--color-paper-sunken);
		padding: 0.55rem 0.9rem;
		border-radius: 999px;
	}
	.archetype strong {
		color: var(--color-accent);
		font-weight: 600;
	}
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem 2.2rem;
	}
	.blk-title {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--color-accent-deep);
		margin-bottom: 0.9rem;
	}
	.rows {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}
	.rows div {
		display: grid;
		grid-template-columns: 92px 1fr;
		gap: 0.7rem;
		align-items: baseline;
	}
	.rows dt {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-ink-muted);
		font-family: var(--font-mono);
	}
	.rows dd {
		margin: 0;
		font-size: 0.96rem;
		color: var(--color-ink);
		line-height: 1.4;
	}
	.phrases {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		margin-top: 0.9rem;
	}
	.phrase {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.85rem;
		font-style: italic;
		font-family: var(--font-display);
		color: var(--color-ink-soft);
		background: var(--color-paper-sunken);
		padding: 0.3rem 0.65rem;
		border-radius: var(--radius-sm);
	}
	.pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 0.85rem;
		list-style: none;
		padding: 0;
	}
	.pills li {
		font-size: 0.82rem;
		padding: 0.28rem 0.6rem;
		border: 1px solid var(--color-line-strong);
		border-radius: 999px;
		color: var(--color-ink-soft);
	}
	.story-flow {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.beat {
		border-left: 2px solid var(--color-accent);
		padding-left: 0.85rem;
	}
	.beat-k {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-accent-deep);
	}
	.beat p {
		margin: 0.15rem 0 0;
		font-size: 0.96rem;
		color: var(--color-ink);
		line-height: 1.45;
	}
	.rules {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}
	.rk {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 600;
	}
	.rule.always .rk {
		color: var(--color-human);
	}
	.rule.never .rk {
		color: var(--color-ai);
	}
	.rule ul {
		margin: 0.35rem 0 0;
		padding-left: 1.05rem;
		display: flex;
		flex-direction: column;
		gap: 0.28rem;
	}
	.rule li {
		font-size: 0.9rem;
		color: var(--color-ink-soft);
		line-height: 1.4;
	}
	@media (max-width: 720px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
