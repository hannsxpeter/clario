<script lang="ts">
	import type { ChannelRec } from '$lib/appTypes';
	import { creativeKinds } from '$lib/channelKinds';
	import Icon from './Icon.svelte';

	interface Props {
		channel: ChannelRec;
		generating?: boolean;
		onGenerate: (channel: ChannelRec, kind: string) => void;
	}
	let { channel, generating = false, onGenerate }: Props = $props();

	const kinds = $derived(creativeKinds(channel));
	let kind = $state('');
	$effect(() => {
		if (!kind && kinds.length) kind = kinds[0];
	});

	const fitColor: Record<string, string> = {
		high: 'var(--color-human)',
		medium: 'var(--color-mixed)',
		low: 'var(--color-ink-muted)'
	};
</script>

<div class="ch card-flat" class:top={channel.isTopPick}>
	<div class="ch-head">
		<div class="ch-titles">
			<div class="ch-meta">
				<span class="eyebrow">{channel.group}</span>
				{#if channel.isTopPick}<span class="star"><Icon name="bolt" size={12} /> Top pick</span>{/if}
			</div>
			<h4 class="ch-name font-display">{channel.name}</h4>
		</div>
		<div class="ch-budget">
			<span class="bud-num font-mono">{Math.round(channel.budgetPct)}%</span>
			<span class="bud-lab">budget</span>
		</div>
	</div>

	<div class="bar"><span style="width:{Math.min(100, channel.budgetPct)}%"></span></div>

	<div class="stats">
		<div class="stat">
			<span class="stat-k">Fit</span>
			<span class="stat-v" style="color:{fitColor[channel.fit]}">{channel.fit}</span>
		</div>
		<div class="stat">
			<span class="stat-k">Est. ROI</span>
			<span class="stat-v">{channel.roiRange}</span>
		</div>
		<div class="stat">
			<span class="stat-k">Success</span>
			<span class="stat-v">{channel.successRange}</span>
		</div>
	</div>

	<p class="rationale">{channel.rationale}</p>

	{#if channel.kpis?.length}
		<div class="kpis">
			{#each channel.kpis as k (k)}<span class="kpi">{k}</span>{/each}
		</div>
	{/if}

	<div class="messaging">
		<Icon name="quote" size={14} />
		<p>{channel.messaging}</p>
	</div>

	<div class="gen">
		<select class="kind" bind:value={kind} disabled={generating}>
			{#each kinds as k (k)}<option value={k}>{k}</option>{/each}
		</select>
		<button class="btn btn-accent gen-btn" onclick={() => onGenerate(channel, kind)} disabled={generating}>
			{#if generating}
				<Icon name="refresh" size={16} class="spin" /> Writing
			{:else}
				<Icon name="feather" size={16} /> Generate + humanize
			{/if}
		</button>
	</div>
</div>

<style>
	.ch {
		padding: 1.3rem;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		height: 100%;
	}
	.ch.top {
		border-color: var(--color-accent);
		box-shadow: 0 0 0 1px var(--color-accent) inset;
	}
	.ch-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}
	.ch-meta {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}
	.star {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-accent);
		font-weight: 600;
	}
	.ch-name {
		font-size: 1.3rem;
		margin: 0.2rem 0 0;
		line-height: 1.05;
	}
	.ch-budget {
		text-align: right;
		flex-shrink: 0;
	}
	.bud-num {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-ink);
	}
	.bud-lab {
		display: block;
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-ink-muted);
		font-family: var(--font-mono);
	}
	.bar {
		height: 5px;
		border-radius: 999px;
		background: var(--color-paper-sunken);
		overflow: hidden;
	}
	.bar span {
		display: block;
		height: 100%;
		background: var(--color-accent);
		border-radius: 999px;
		transition: width 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.stats {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.5rem;
	}
	.stat {
		display: grid;
		grid-template-columns: 78px 1fr;
		gap: 0.6rem;
		align-items: baseline;
	}
	.stat-k {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-ink-muted);
	}
	.stat-v {
		font-size: 0.86rem;
		color: var(--color-ink-soft);
		line-height: 1.35;
	}
	.rationale {
		font-size: 0.92rem;
		color: var(--color-ink);
		line-height: 1.45;
	}
	.kpis {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}
	.kpi {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		padding: 0.2rem 0.5rem;
		border-radius: var(--radius-xs);
		background: var(--color-paper-sunken);
		color: var(--color-ink-soft);
	}
	.messaging {
		display: flex;
		gap: 0.5rem;
		padding: 0.75rem 0.85rem;
		background: var(--color-accent-soft);
		border-radius: var(--radius-md);
		color: var(--color-accent-deep);
	}
	.messaging :global(svg) {
		flex-shrink: 0;
		margin-top: 2px;
		opacity: 0.7;
	}
	.messaging p {
		margin: 0;
		font-family: var(--font-display);
		font-style: italic;
		font-size: 0.95rem;
		line-height: 1.4;
	}
	.gen {
		display: flex;
		gap: 0.5rem;
		margin-top: auto;
	}
	.kind {
		flex: 1;
		min-width: 0;
		font-family: var(--font-sans);
		font-size: 0.85rem;
		padding: 0.5rem 0.6rem;
		border: 1px solid var(--color-line-strong);
		border-radius: 999px;
		background: var(--color-paper-raised);
		color: var(--color-ink);
		cursor: pointer;
	}
	.gen-btn {
		flex-shrink: 0;
		padding: 0.55rem 1rem;
		font-size: 0.85rem;
	}
	:global(.spin) {
		animation: spin 0.9s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
