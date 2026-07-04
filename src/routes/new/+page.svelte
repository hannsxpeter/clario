<script lang="ts">
	import { useConvexClient } from 'convex-svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import Icon from '$lib/components/Icon.svelte';

	const client = useConvexClient();

	let urls = $state<string[]>(['']);
	let description = $state('');
	let docText = $state('');
	let docName = $state('');
	let docWarn = $state('');
	let goals = $state('');
	let monthlyBudget = $state<number | undefined>(undefined);
	let showAdvanced = $state(false);

	let submitting = $state(false);
	let error = $state('');

	const canSubmit = $derived(
		urls.some((u) => u.trim()) || description.trim().length > 20 || docText.trim().length > 0
	);

	function addUrl() {
		urls = [...urls, ''];
	}
	function removeUrl(i: number) {
		urls = urls.filter((_, idx) => idx !== i);
		if (urls.length === 0) urls = [''];
	}

	async function onFile(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		docName = file.name;
		docWarn = '';
		const lower = file.name.toLowerCase();
		if (lower.endsWith('.md') || lower.endsWith('.markdown') || lower.endsWith('.txt')) {
			docText = await file.text();
		} else {
			docText = '';
			docWarn = 'PDF and DOCX text extraction is coming soon. For now paste the key text into the description below.';
		}
	}

	async function submit() {
		if (!canSubmit || submitting) return;
		submitting = true;
		error = '';
		try {
			const id = await client.mutation(api.projects.create, {
				inputs: {
					urls: urls.map((u) => u.trim()).filter(Boolean),
					description: description.trim() || undefined,
					docText: docText.trim() || undefined,
					docName: docName || undefined,
					goals: goals.trim() || undefined,
					monthlyBudget: monthlyBudget && monthlyBudget > 0 ? monthlyBudget : undefined
				}
			});
			await goto(`/p/${id}`);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Something went wrong. Try again.';
			submitting = false;
		}
	}
</script>

<div class="wrap">
	<div class="intro reveal">
		<span class="eyebrow">Step one / intake</span>
		<h1 class="display-lg">Tell Clario who you are.</h1>
		<p class="sub">Give it anything that reveals your voice. Links, a document, a description, or all three. The more it reads, the sharper the DNA.</p>
	</div>

	<div class="form card reveal">
		<section class="fsec">
			<div class="fsec-head">
				<span class="fnum font-mono">01</span>
				<div>
					<h2 class="fh"><Icon name="link" size={16} /> Your links</h2>
					<p class="fhint">Website, X, LinkedIn, a landing page, anything public.</p>
				</div>
			</div>
			<div class="urls">
				{#each urls as url, i (i)}
					<div class="urow">
						<input class="field" placeholder="itstoday.media" bind:value={urls[i]} spellcheck="false" />
						{#if urls.length > 1}
							<button class="icon-btn" onclick={() => removeUrl(i)} aria-label="Remove"><Icon name="minus" size={16} /></button>
						{/if}
					</div>
				{/each}
				<button class="add" onclick={addUrl}><Icon name="plus" size={15} /> Add another link</button>
			</div>
		</section>

		<div class="or"><span>or</span></div>

		<section class="fsec">
			<div class="fsec-head">
				<span class="fnum font-mono">02</span>
				<div>
					<h2 class="fh"><Icon name="upload" size={16} /> Upload a document</h2>
					<p class="fhint">A business plan, marketing plan, or brand doc. Markdown or text (.md, .txt).</p>
				</div>
			</div>
			<label class="drop">
				<input type="file" accept=".md,.markdown,.txt,.pdf,.docx" onchange={onFile} hidden />
				<Icon name="upload" size={20} />
				<span>{docName || 'Choose a file'}</span>
			</label>
			{#if docText}<div class="ok"><Icon name="check" size={14} /> Loaded {docText.length.toLocaleString()} characters</div>{/if}
			{#if docWarn}<div class="warn"><Icon name="alert" size={14} /> {docWarn}</div>{/if}
		</section>

		<div class="or"><span>and</span></div>

		<section class="fsec">
			<div class="fsec-head">
				<span class="fnum font-mono">03</span>
				<div>
					<h2 class="fh"><Icon name="feather" size={16} /> Describe the company</h2>
					<p class="fhint">In your own words. What you do, who for, and how you sound. This helps most.</p>
				</div>
			</div>
			<textarea
				class="field ta"
				rows="4"
				placeholder="We help ... Our customers are ... We sound like ..."
				bind:value={description}></textarea>
		</section>

		<button class="adv-toggle" onclick={() => (showAdvanced = !showAdvanced)}>
			<Icon name={showAdvanced ? 'minus' : 'plus'} size={14} /> Goals and budget (optional)
		</button>
		{#if showAdvanced}
			<div class="adv">
				<label class="afield">
					<span>Primary goal</span>
					<input class="field" placeholder="Grow email + SMS list, ROI-positive" bind:value={goals} />
				</label>
				<label class="afield">
					<span>Monthly budget (USD)</span>
					<input class="field" type="number" min="0" placeholder="25000" bind:value={monthlyBudget} />
				</label>
			</div>
		{/if}

		{#if error}<div class="err"><Icon name="alert" size={15} /> {error}</div>{/if}

		<button class="btn btn-accent submit" disabled={!canSubmit || submitting} onclick={submit}>
			{#if submitting}
				<Icon name="refresh" size={18} class="spin" /> Sequencing...
			{:else}
				<Icon name="dna" size={18} /> Sequence my Company DNA
			{/if}
		</button>
		<p class="privacy">Clario reads only what you give it. Best-effort scraping for social links.</p>
	</div>
</div>

<style>
	.wrap {
		max-width: 760px;
		margin: 0 auto;
		padding: clamp(1.5rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2rem) 3rem;
	}
	.intro {
		margin-bottom: 2rem;
	}
	.intro h1 {
		margin: 0.6rem 0 0.7rem;
	}
	.sub {
		color: var(--color-ink-soft);
		font-size: 1.1rem;
		max-width: 52ch;
	}
	.form {
		padding: clamp(1.4rem, 3vw, 2.2rem);
		display: flex;
		flex-direction: column;
		gap: 1.4rem;
	}
	.fsec-head {
		display: flex;
		gap: 0.85rem;
		margin-bottom: 0.9rem;
	}
	.fnum {
		color: var(--color-accent);
		font-size: 0.85rem;
		font-weight: 600;
		padding-top: 0.15rem;
	}
	.fh {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		font-size: 1.1rem;
		font-weight: 600;
	}
	.fhint {
		color: var(--color-ink-muted);
		font-size: 0.9rem;
		margin-top: 0.15rem;
	}
	.urls {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}
	.urow {
		display: flex;
		gap: 0.5rem;
	}
	.icon-btn {
		flex-shrink: 0;
		width: 44px;
		border: 1px solid var(--color-line-strong);
		border-radius: var(--radius-md);
		background: var(--color-paper);
		color: var(--color-ink-soft);
		cursor: pointer;
	}
	.icon-btn:hover {
		background: var(--color-paper-sunken);
		color: var(--color-accent);
	}
	.add {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-accent-deep);
		font-family: var(--font-mono);
		font-size: 0.8rem;
		padding: 0.3rem 0;
	}
	.add:hover {
		text-decoration: underline;
	}
	.or {
		display: flex;
		align-items: center;
		text-align: center;
	}
	.or::before,
	.or::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--color-line);
	}
	.or span {
		padding: 0 0.9rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-ink-muted);
	}
	.drop {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		padding: 1rem 1.1rem;
		border: 1.5px dashed var(--color-line-strong);
		border-radius: var(--radius-md);
		cursor: pointer;
		color: var(--color-ink-soft);
		transition: border-color 0.15s ease, background 0.15s ease;
	}
	.drop:hover {
		border-color: var(--color-accent);
		background: var(--color-accent-soft);
	}
	.ta {
		resize: vertical;
		font-family: var(--font-sans);
		line-height: 1.5;
	}
	.ok,
	.warn {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.85rem;
		margin-top: 0.6rem;
	}
	.ok {
		color: var(--color-human);
	}
	.warn {
		color: var(--color-mixed);
	}
	.adv-toggle {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-ink-soft);
		font-family: var(--font-mono);
		font-size: 0.78rem;
	}
	.adv {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	.afield {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.afield span {
		font-size: 0.8rem;
		color: var(--color-ink-muted);
		font-family: var(--font-mono);
	}
	.err {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-ai);
		font-size: 0.9rem;
		background: #f6e4de;
		padding: 0.7rem 0.9rem;
		border-radius: var(--radius-md);
	}
	.submit {
		margin-top: 0.4rem;
		padding: 0.95rem;
		font-size: 1.02rem;
	}
	.privacy {
		text-align: center;
		font-size: 0.78rem;
		color: var(--color-ink-muted);
	}
	:global(.spin) {
		animation: spin 0.9s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	@media (max-width: 560px) {
		.adv {
			grid-template-columns: 1fr;
		}
	}
</style>
