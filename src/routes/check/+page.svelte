<script lang="ts">
	import { useConvexClient } from 'convex-svelte';
	import { api } from '$lib/api';
	import type { AuthScore } from '$lib/appTypes';
	import Icon from '$lib/components/Icon.svelte';
	import Gauge from '$lib/components/Gauge.svelte';

	const client = useConvexClient();

	let text = $state('');
	let voice = $state('');
	let showVoice = $state(false);
	let loading = $state(false);
	let error = $state('');
	let copied = $state(false);
	let result = $state<{
		scoreBefore: AuthScore;
		humanized: string;
		changed: string[];
		scoreAfter: AuthScore;
	} | null>(null);

	const delta = $derived(
		result ? Math.round(result.scoreAfter.score - result.scoreBefore.score) : 0
	);
	const canRun = $derived(text.trim().length > 15);

	async function run() {
		if (!canRun || loading) return;
		loading = true;
		error = '';
		result = null;
		try {
			result = await client.action(api.check.run, {
				text: text.trim(),
				voice: voice.trim() || undefined
			});
		} catch (e) {
			error = e instanceof Error ? e.message : 'Something went wrong.';
		} finally {
			loading = false;
		}
	}

	async function copy() {
		if (!result) return;
		try {
			await navigator.clipboard.writeText(result.humanized);
			copied = true;
			setTimeout(() => (copied = false), 1600);
		} catch {
			/* clipboard unavailable */
		}
	}
</script>

<div class="wrap">
	<div class="intro reveal">
		<span class="eyebrow">Slop meter</span>
		<h1 class="display-lg">Does your copy read like a human, or like AI?</h1>
		<p class="sub">Paste any ad, email, or landing copy. Clario scores it for authenticity, then rewrites it to read human, using the same engine that powers the full tool.</p>
	</div>

	<div class="grid">
		<div class="input-col card reveal">
			<label class="lbl" for="ad">Your copy</label>
			<textarea
				id="ad"
				class="field ta"
				rows="9"
				placeholder="Paste the ad, email, or landing copy you want to check..."
				bind:value={text}></textarea>

			<button class="voice-toggle" onclick={() => (showVoice = !showVoice)}>
				<Icon name={showVoice ? 'minus' : 'plus'} size={14} /> Match a brand voice (optional)
			</button>
			{#if showVoice}
				<textarea
					class="field ta"
					rows="3"
					placeholder="Describe the voice to match, or paste a sample the brand actually wrote."
					bind:value={voice}></textarea>
			{/if}

			{#if error}<div class="err"><Icon name="alert" size={15} /> {error}</div>{/if}

			<button class="btn btn-accent runbtn" disabled={!canRun || loading} onclick={run}>
				{#if loading}
					<Icon name="refresh" size={18} class="spin" /> Scoring and humanizing...
				{:else}
					<Icon name="shield" size={18} /> Score and humanize
				{/if}
			</button>
		</div>

		<div class="output-col">
			{#if !result && !loading}
				<div class="empty card-flat">
					<Icon name="shield" size={30} />
					<p>Your authenticity score and a humanized rewrite will appear here.</p>
				</div>
			{:else if loading}
				<div class="empty card-flat">
					<Icon name="refresh" size={30} class="spin" />
					<p>Reading the tells, then re-voicing it...</p>
				</div>
			{:else if result}
				<div class="res card reveal">
					<div class="score-row">
						<Gauge score={result.scoreBefore.score} band={result.scoreBefore.band} size={84} label="As pasted" />
						<div class="delta">
							<Icon name="arrowRight" size={22} />
							{#if delta > 0}<span class="delta-num">+{delta}</span>{/if}
							<span class="delta-lab">humanized</span>
						</div>
						<Gauge score={result.scoreAfter.score} band={result.scoreAfter.band} size={84} label="Rewritten" />
					</div>

					{#if result.scoreBefore.flags?.length}
						<div class="flags">
							<span class="flags-h">Tells found</span>
							{#each result.scoreBefore.flags.slice(0, 8) as f (f.span + f.pattern)}
								<div class="flag">
									<span class="flag-span">"{f.span}"</span>
									<span class="flag-pat">{f.pattern}</span>
								</div>
							{/each}
						</div>
					{/if}

					<div class="human">
						<div class="human-head">
							<span class="human-h">Humanized</span>
							<button class="btn btn-ghost copy" onclick={copy}>
								<Icon name={copied ? 'check' : 'copy'} size={14} /> {copied ? 'Copied' : 'Copy'}
							</button>
						</div>
						<pre class="human-text">{result.humanized}</pre>
					</div>

					{#if result.changed?.length}
						<details class="detail">
							<summary>What changed</summary>
							<ul>{#each result.changed as c (c)}<li>{c}</li>{/each}</ul>
						</details>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.wrap {
		max-width: 1100px;
		margin: 0 auto;
		padding: clamp(1.5rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2rem) 3rem;
	}
	.intro {
		max-width: 60ch;
		margin-bottom: 2rem;
	}
	.intro h1 {
		margin: 0.6rem 0 0.7rem;
	}
	.sub {
		color: var(--color-ink-soft);
		font-size: 1.1rem;
	}
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		align-items: start;
	}
	.input-col {
		padding: 1.4rem;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}
	.lbl {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-ink-muted);
	}
	.ta {
		resize: vertical;
		line-height: 1.5;
		font-family: var(--font-sans);
	}
	.voice-toggle {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-ink-soft);
		font-family: var(--font-mono);
		font-size: 0.76rem;
	}
	.runbtn {
		margin-top: 0.3rem;
		padding: 0.85rem;
		font-size: 1rem;
	}
	.err {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-ai);
		font-size: 0.9rem;
	}
	.empty {
		padding: 3rem 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		text-align: center;
		color: var(--color-ink-muted);
		min-height: 260px;
		justify-content: center;
	}
	.res {
		padding: 1.4rem;
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}
	.score-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		padding: 0.4rem 0;
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
		font-size: 1.1rem;
	}
	.delta-lab {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-ink-muted);
	}
	.flags {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		background: var(--color-paper-sunken);
		border-radius: var(--radius-md);
		padding: 0.9rem;
	}
	.flags-h,
	.human-h {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-ink-muted);
	}
	.flag {
		display: flex;
		justify-content: space-between;
		gap: 0.8rem;
		font-size: 0.85rem;
		align-items: baseline;
	}
	.flag-span {
		color: var(--color-ai);
		font-style: italic;
	}
	.flag-pat {
		color: var(--color-ink-muted);
		font-size: 0.76rem;
		text-align: right;
		flex-shrink: 0;
	}
	.human-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}
	.copy {
		padding: 0.35rem 0.7rem;
		font-size: 0.78rem;
	}
	.human-text {
		margin: 0;
		padding: 1rem;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		border-radius: var(--radius-md);
		font-family: var(--font-sans);
		font-size: 0.95rem;
		line-height: 1.55;
		white-space: pre-wrap;
		word-wrap: break-word;
		color: var(--color-ink);
	}
	.detail summary {
		cursor: pointer;
		font-family: var(--font-mono);
		font-size: 0.74rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-ink-muted);
	}
	.detail ul {
		margin: 0.5rem 0 0;
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
	:global(.spin) {
		animation: spin 0.9s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	@media (max-width: 780px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
