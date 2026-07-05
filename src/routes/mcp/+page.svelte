<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';

	const config = `{
  "mcpServers": {
    "clario": {
      "command": "bun",
      "args": ["run", "/path/to/clario/mcp/index.ts"],
      "env": { "DEEPSEEK_API_KEY": "sk-your-key" }
    }
  }
}`;

	let copied = $state(false);
	async function copy() {
		try {
			await navigator.clipboard.writeText(config);
			copied = true;
			setTimeout(() => (copied = false), 1600);
		} catch {
			/* clipboard unavailable */
		}
	}

	const tools = [
		{
			name: 'authenticity_score',
			desc: 'Scores any text 0 to 100 for how human it reads, with the AI tells flagged span by span. Optional voice to check against.',
			args: '{ text, voice? }'
		},
		{
			name: 'humanize',
			desc: 'Rewrites text so it reads human and, if you pass a voice, sounds like that brand. Returns the rewrite plus what changed.',
			args: '{ text, voice? }'
		}
	];
</script>

<div class="wrap">
	<div class="hero reveal">
		<span class="eyebrow">For AI-first teams</span>
		<h1 class="display-lg">Clario, right inside your editor.</h1>
		<p class="sub">The same humanize and authenticity engine that powers the app is also a Model Context Protocol server. Point Claude Code, Cursor, or any MCP client at it, and your agent can score and re-voice copy without leaving the terminal.</p>
	</div>

	<div class="tools">
		{#each tools as t (t.name)}
			<div class="tool card-flat">
				<div class="tool-top">
					<Icon name="bolt" size={16} />
					<code class="tool-name">{t.name}</code>
					<span class="tool-args font-mono">{t.args}</span>
				</div>
				<p>{t.desc}</p>
			</div>
		{/each}
	</div>

	<div class="config card reveal">
		<div class="config-head">
			<span class="eyebrow">Add to your MCP client</span>
			<button class="btn btn-ghost copy" onclick={copy}>
				<Icon name={copied ? 'check' : 'copy'} size={15} /> {copied ? 'Copied' : 'Copy config'}
			</button>
		</div>
		<pre class="code">{config}</pre>
		<ol class="steps">
			<li>Clone the repo and set your DeepSeek key in the config above.</li>
			<li>Drop the snippet into your MCP client settings (Claude Code, Cursor, and others).</li>
			<li>Ask your agent to "score this for AI slop" or "humanize this in our brand voice."</li>
		</ol>
	</div>

	<p class="footnote">Source lives in <code>mcp/</code> in the repo. It reuses the exact prompt builders behind the web app, so the terminal and the browser give the same result.</p>
</div>

<style>
	.wrap {
		max-width: 880px;
		margin: 0 auto;
		padding: clamp(1.5rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2rem) 3rem;
	}
	.hero {
		max-width: 60ch;
		margin-bottom: 2rem;
	}
	.hero h1 {
		margin: 0.6rem 0 0.7rem;
	}
	.sub {
		color: var(--color-ink-soft);
		font-size: 1.15rem;
		line-height: 1.5;
	}
	.tools {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.2rem;
		margin-bottom: 1.5rem;
	}
	.tool {
		padding: 1.2rem;
	}
	.tool-top {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.6rem;
		color: var(--color-accent-deep);
		flex-wrap: wrap;
	}
	.tool-name {
		font-family: var(--font-mono);
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--color-ink);
	}
	.tool-args {
		font-size: 0.78rem;
		color: var(--color-ink-muted);
	}
	.tool p {
		color: var(--color-ink-soft);
		font-size: 0.95rem;
		line-height: 1.45;
	}
	.config {
		padding: 1.4rem;
	}
	.config-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.9rem;
	}
	.copy {
		padding: 0.4rem 0.8rem;
		font-size: 0.82rem;
	}
	.code {
		margin: 0;
		padding: 1.1rem;
		background: var(--color-ink);
		color: #f0e9db;
		border-radius: var(--radius-md);
		font-family: var(--font-mono);
		font-size: 0.85rem;
		line-height: 1.5;
		overflow-x: auto;
	}
	.steps {
		margin: 1.2rem 0 0;
		padding-left: 1.2rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.steps li {
		color: var(--color-ink-soft);
		font-size: 0.95rem;
		line-height: 1.4;
	}
	.footnote {
		margin-top: 1.5rem;
		font-size: 0.88rem;
		color: var(--color-ink-muted);
	}
	.footnote code,
	.tool-name {
		background: var(--color-paper-sunken);
		padding: 0.05rem 0.3rem;
		border-radius: 4px;
	}
	.tool-name {
		background: none;
		padding: 0;
	}
	@media (max-width: 640px) {
		.tools {
			grid-template-columns: 1fr;
		}
	}
</style>
