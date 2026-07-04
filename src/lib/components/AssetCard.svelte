<script lang="ts">
	import type { CreativeAsset } from '$lib/appTypes';
	import Gauge from './Gauge.svelte';
	import Icon from './Icon.svelte';

	interface Props {
		asset: { status: string; data: Record<string, unknown> };
	}
	let { asset }: Props = $props();

	let showOriginal = $state(false);
	let copied = $state(false);

	const d = $derived(asset.data as unknown as CreativeAsset);
	const delta = $derived(
		asset.status === 'ready' && d?.scoreAfter && d?.scoreBefore
			? Math.round(d.scoreAfter.score - d.scoreBefore.score)
			: 0
	);

	async function copy() {
		try {
			await navigator.clipboard.writeText(d.humanized);
			copied = true;
			setTimeout(() => (copied = false), 1600);
		} catch {
			/* clipboard unavailable */
		}
	}
</script>

<div class="asset card reveal">
	{#if asset.status === 'generating'}
		<div class="gen-state">
			<Icon name="feather" size={18} class="pulse-soft" />
			<div>
				<div class="gs-title">{(asset.data.channelName as string) ?? 'Channel'}</div>
				<div class="gs-sub shimmer-text">Drafting, scoring, and humanizing to your voice...</div>
			</div>
		</div>
		<div class="skeleton">
			<span class="shimmer"></span><span class="shimmer"></span><span class="shimmer" style="width:70%"></span>
		</div>
	{:else if asset.status === 'error'}
		<div class="err">
			<Icon name="alert" size={18} />
			<span>{(asset.data.error as string) ?? 'Generation failed.'}</span>
		</div>
	{:else}
		<header class="a-head">
			<div>
				<span class="eyebrow">{d.channelName} / {d.kind}</span>
				<h4 class="a-title font-display">{d.title}</h4>
			</div>
			<button class="btn btn-ghost copy" onclick={copy}>
				<Icon name={copied ? 'check' : 'copy'} size={15} />
				{copied ? 'Copied' : 'Copy'}
			</button>
		</header>

		<div class="score-row">
			<Gauge score={d.scoreBefore.score} band={d.scoreBefore.band} size={78} label="Raw draft" />
			<div class="delta">
				<Icon name="arrowRight" size={20} />
				{#if delta > 0}<span class="delta-num">+{delta}</span>{/if}
				<span class="delta-lab">humanized</span>
			</div>
			<Gauge score={d.scoreAfter.score} band={d.scoreAfter.band} size={78} label="In your voice" />
		</div>

		<div class="copy-block">
			<pre class="creative">{showOriginal ? d.draft : d.humanized}</pre>
		</div>

		<div class="toggles">
			<button class="linkish" onclick={() => (showOriginal = !showOriginal)}>
				<Icon name="refresh" size={13} />
				{showOriginal ? 'Show humanized version' : 'Show raw AI draft'}
			</button>
		</div>

		{#if d.changed?.length}
			<details class="detail">
				<summary>What the humanizer changed</summary>
				<ul>{#each d.changed as c (c)}<li>{c}</li>{/each}</ul>
			</details>
		{/if}
		{#if d.steps?.length}
			<details class="detail">
				<summary>Playbook to run this</summary>
				<ol>{#each d.steps as s (s)}<li>{s}</li>{/each}</ol>
			</details>
		{/if}
	{/if}
</div>

<style>
	.asset {
		padding: 1.3rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.gen-state {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		color: var(--color-accent-deep);
	}
	.gs-title {
		font-weight: 600;
	}
	.gs-sub {
		font-size: 0.85rem;
		color: var(--color-ink-muted);
	}
	.skeleton {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}
	.skeleton span {
		height: 12px;
		border-radius: 999px;
		display: block;
	}
	.err {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-ai);
		font-size: 0.9rem;
	}
	.a-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}
	.a-title {
		font-size: 1.25rem;
		margin: 0.2rem 0 0;
		line-height: 1.1;
	}
	.copy {
		padding: 0.4rem 0.8rem;
		font-size: 0.8rem;
		flex-shrink: 0;
	}
	.score-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.4rem;
		padding: 0.6rem 0;
		background: var(--color-paper-sunken);
		border-radius: var(--radius-md);
	}
	.delta {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: var(--color-human);
		gap: 0.1rem;
	}
	.delta-num {
		font-family: var(--font-mono);
		font-weight: 600;
		font-size: 1.05rem;
	}
	.delta-lab {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-ink-muted);
	}
	.copy-block {
		border: 1px solid var(--color-line);
		border-radius: var(--radius-md);
		background: var(--color-paper);
		max-height: 340px;
		overflow: auto;
	}
	.creative {
		margin: 0;
		padding: 1rem 1.1rem;
		font-family: var(--font-sans);
		font-size: 0.95rem;
		line-height: 1.55;
		white-space: pre-wrap;
		word-wrap: break-word;
		color: var(--color-ink);
	}
	.toggles {
		display: flex;
	}
	.linkish {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-mono);
		font-size: 0.74rem;
		color: var(--color-accent-deep);
		padding: 0;
	}
	.linkish:hover {
		text-decoration: underline;
	}
	.detail summary {
		cursor: pointer;
		font-family: var(--font-mono);
		font-size: 0.76rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-ink-muted);
		padding: 0.3rem 0;
	}
	.detail ul,
	.detail ol {
		margin: 0.4rem 0 0.6rem;
		padding-left: 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.detail li {
		font-size: 0.88rem;
		color: var(--color-ink-soft);
		line-height: 1.4;
	}
	.shimmer-text {
		animation: pulse-soft 1.6s ease-in-out infinite;
	}
</style>
