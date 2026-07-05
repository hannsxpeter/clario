<script lang="ts">
	import '../app.css';
	import { setupConvex } from 'convex-svelte';
	import { env } from '$env/dynamic/public';
	import Icon from '$lib/components/Icon.svelte';

	// Dynamic public env reads at runtime, so a missing var never breaks the build.
	// Falls back to the project's Convex deployment so the app works with zero config.
	setupConvex(env.PUBLIC_CONVEX_URL || 'https://accurate-caribou-260.convex.cloud');

	let { children } = $props();
</script>

<svelte:head>
	<title>Clario - Marketing that sounds human</title>
	<meta
		name="description"
		content="Clario reads your business, sequences its Company DNA, and builds a channel-by-channel marketing plan where every asset is written in your voice and scored so it reads human, not AI." />
</svelte:head>

<div class="app-shell">
	<header class="site-head">
		<a href="/" class="brand">
			<span class="mark"><Icon name="dna" size={22} /></span>
			<span class="word font-display">Clario</span>
		</a>
		<nav class="nav">
			<a href="/check" class="nav-link">Slop check</a>
			<a href="/mcp" class="nav-link">MCP</a>
			<a href="/#how" class="nav-link">How it works</a>
			<a href="/new" class="btn btn-primary new-btn">
				<Icon name="sparkle" size={16} /> Sequence a brand
			</a>
		</nav>
	</header>

	<main>
		{@render children()}
	</main>

	<footer class="site-foot">
		<div class="foot-inner">
			<div class="foot-brand">
				<span class="font-display foot-word">Clario</span>
				<span class="foot-tag">Humanize marketing. Every asset written in your Company DNA.</span>
			</div>
			<nav class="foot-links">
				<a href="/new">Sequence a brand</a>
				<a href="/check">Slop meter</a>
				<a href="/mcp">MCP server</a>
			</nav>
		</div>
	</footer>
</div>

<style>
	.site-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: 1180px;
		margin: 0 auto;
		padding: 1.4rem clamp(1rem, 4vw, 2.5rem);
	}
	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		text-decoration: none;
		color: var(--color-ink);
	}
	.mark {
		display: grid;
		place-items: center;
		width: 38px;
		height: 38px;
		border-radius: 11px;
		background: var(--color-ink);
		color: var(--color-paper);
	}
	.word {
		font-size: 1.5rem;
		font-weight: 500;
		letter-spacing: -0.02em;
	}
	.nav {
		display: flex;
		align-items: center;
		gap: 1.4rem;
	}
	.nav-link {
		color: var(--color-ink-soft);
		text-decoration: none;
		font-size: 0.95rem;
	}
	.nav-link:hover {
		color: var(--color-accent);
	}
	.new-btn {
		padding: 0.6rem 1.1rem;
		font-size: 0.9rem;
	}
	main {
		min-height: 60vh;
	}
	.site-foot {
		border-top: 1px solid var(--color-line);
		margin-top: 5rem;
	}
	.foot-inner {
		max-width: 1180px;
		margin: 0 auto;
		padding: 2rem clamp(1rem, 4vw, 2.5rem);
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1.5rem;
		flex-wrap: wrap;
	}
	.foot-brand {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.foot-word {
		font-size: 1.2rem;
	}
	.foot-tag {
		color: var(--color-ink-muted);
		font-size: 0.9rem;
	}
	.foot-links {
		display: flex;
		gap: 1.2rem;
	}
	.foot-links a {
		color: var(--color-ink-soft);
		text-decoration: none;
		font-size: 0.9rem;
	}
	.foot-links a:hover {
		color: var(--color-accent);
	}
	@media (max-width: 620px) {
		.site-head {
			flex-wrap: wrap;
			gap: 0.7rem 1rem;
		}
		.nav {
			gap: 0.9rem;
		}
		.nav-link {
			font-size: 0.85rem;
		}
	}
</style>
