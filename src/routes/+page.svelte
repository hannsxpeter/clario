<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import DnaHelix from '$lib/components/DnaHelix.svelte';

	// A pre-sequenced example so a first-time visitor can see the full output instantly.
	const DEMO_HREF = '/p/jh7czpvdbg62rn15x7vhvx1zd189z3fm';

	const steps = [
		{
			icon: 'layers',
			k: 'Feed it your signals',
			d: 'Drop in your website, your X or LinkedIn, an uploaded plan, or just describe the business. Any combination works.'
		},
		{
			icon: 'dna',
			k: 'Sequence the DNA',
			d: 'Clario distills your Company DNA: voice, identity, and the story you tell. Not a persona template, your actual character.'
		},
		{
			icon: 'compass',
			k: 'Get a humanized plan',
			d: 'A channel-by-channel plan with honest budget, ROI, and KPIs, plus creative written in your voice and scored so it reads human.'
		}
	];
</script>

<section class="hero">
	<div class="hero-copy reveal">
		<span class="eyebrow">Company DNA engine / for It's Today Media</span>
		<h1 class="display-xl">
			Marketing that sounds <em class="hl">human</em>, not like AI.
		</h1>
		<p class="lede prose-serif">
			Clario reads your business, sequences its Company DNA, and builds a full channel plan where
			every asset is written in your voice and scored for authenticity, so it never ships as slop.
		</p>
		<div class="cta">
			<a href="/new" class="btn btn-accent big"><Icon name="sparkle" size={18} /> Sequence your brand</a>
			<a href={DEMO_HREF} class="btn btn-ghost big"><Icon name="bolt" size={16} /> See a live example</a>
		</div>
		<a href="/check" class="minor-link"><Icon name="shield" size={14} /> Or paste any ad and score it for AI slop</a>
	</div>
	<div class="hero-helix" aria-hidden="true">
		<DnaHelix width={540} height={220} strands={30} />
	</div>
</section>

<section class="thesis">
	<div class="thesis-inner">
		<Icon name="quote" size={26} class="q" />
		<p class="thesis-quote font-display">
			63% of consumers are less likely to buy from a brand using AI-generated ads. Verified human
			trust is the moat.
		</p>
		<span class="thesis-src">Verified marketing research, 2026. It is exactly the problem Clario is built to solve.</span>
	</div>
</section>

<section id="how" class="how">
	<div class="how-head">
		<span class="eyebrow">How it works</span>
		<h2 class="display-lg">Three steps from a URL to a plan that sounds like you.</h2>
	</div>
	<div class="steps">
		{#each steps as s, i (s.k)}
			<div class="step reveal" style="animation-delay:{i * 0.08}s">
				<div class="step-num font-mono">0{i + 1}</div>
				<div class="step-icon"><Icon name={s.icon} size={22} /></div>
				<h3 class="step-k font-display">{s.k}</h3>
				<p class="step-d">{s.d}</p>
			</div>
		{/each}
	</div>
</section>

<section class="final">
	<div class="final-inner">
		<h2 class="display-lg">Every channel. Your voice. Scored for authenticity.</h2>
		<p>TV, radio, search, social, native, email, SMS, SEO, GEO, community, and more. Recommended budget, honest ROI ranges, KPIs, and three-plus humanized creative ideas per channel.</p>
		<a href="/new" class="btn btn-primary big"><Icon name="dna" size={18} /> Start sequencing</a>
		<a href="/mcp" class="minor-link" style="justify-content:center"><Icon name="bolt" size={14} /> Or add Clario to your editor as an MCP server</a>
	</div>
</section>

<style>
	.hero {
		max-width: 1180px;
		margin: 0 auto;
		padding: clamp(2rem, 6vw, 5rem) clamp(1rem, 4vw, 2.5rem) 2rem;
		display: grid;
		grid-template-columns: 1.15fr 0.85fr;
		gap: 2rem;
		align-items: center;
	}
	.hl {
		font-style: italic;
		color: var(--color-accent);
	}
	.lede {
		font-size: 1.3rem;
		color: var(--color-ink-soft);
		max-width: 46ch;
		margin: 1.4rem 0 2rem;
		line-height: 1.4;
	}
	.cta {
		display: flex;
		gap: 0.8rem;
		flex-wrap: wrap;
	}
	.minor-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 1rem;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--color-ink-soft);
		text-decoration: none;
	}
	.minor-link:hover {
		color: var(--color-accent);
	}
	.big {
		padding: 0.9rem 1.5rem;
		font-size: 1rem;
	}
	.hero-helix {
		display: flex;
		justify-content: center;
		opacity: 0.9;
	}
	.thesis {
		background: var(--color-ink);
		color: var(--color-paper);
		margin: 2rem 0;
	}
	.thesis-inner {
		max-width: 1000px;
		margin: 0 auto;
		padding: clamp(2.5rem, 6vw, 4.5rem) clamp(1.2rem, 4vw, 2.5rem);
		text-align: center;
	}
	.thesis :global(.q) {
		color: var(--color-accent);
		opacity: 0.9;
	}
	.thesis-quote {
		font-size: clamp(1.5rem, 3.6vw, 2.6rem);
		line-height: 1.18;
		font-weight: 380;
		max-width: 24ch;
		margin: 1rem auto 1.2rem;
		letter-spacing: -0.02em;
	}
	.thesis-src {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: #c9bfae;
		letter-spacing: 0.02em;
	}
	.how {
		max-width: 1180px;
		margin: 0 auto;
		padding: 3rem clamp(1rem, 4vw, 2.5rem);
	}
	.how-head {
		max-width: 40ch;
		margin-bottom: 2.5rem;
	}
	.how-head h2 {
		margin-top: 0.8rem;
	}
	.steps {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}
	.step {
		border-top: 2px solid var(--color-ink);
		padding-top: 1.2rem;
	}
	.step-num {
		color: var(--color-accent);
		font-size: 0.9rem;
		font-weight: 600;
	}
	.step-icon {
		margin: 1rem 0 0.9rem;
		width: 46px;
		height: 46px;
		display: grid;
		place-items: center;
		border-radius: 13px;
		background: var(--color-paper-sunken);
		color: var(--color-accent-deep);
	}
	.step-k {
		font-size: 1.35rem;
		margin-bottom: 0.5rem;
	}
	.step-d {
		color: var(--color-ink-soft);
		font-size: 0.98rem;
		line-height: 1.5;
	}
	.final {
		max-width: 1180px;
		margin: 0 auto;
		padding: 2rem clamp(1rem, 4vw, 2.5rem) 4rem;
	}
	.final-inner {
		background: var(--color-paper-raised);
		border: 1px solid var(--color-line);
		border-radius: var(--radius-xl);
		padding: clamp(2rem, 5vw, 3.5rem);
		text-align: center;
		box-shadow: var(--shadow-card);
	}
	.final-inner p {
		max-width: 60ch;
		margin: 1rem auto 1.8rem;
		color: var(--color-ink-soft);
		font-size: 1.05rem;
	}
	@media (max-width: 860px) {
		.hero {
			grid-template-columns: 1fr;
		}
		.hero-helix {
			order: -1;
		}
		.steps {
			grid-template-columns: 1fr;
		}
	}
</style>
