<script lang="ts">
	interface Props {
		width?: number;
		height?: number;
		strands?: number; // number of rungs
		animated?: boolean;
		class?: string;
	}
	let { width = 520, height = 130, strands = 26, animated = true, class: cls = '' }: Props = $props();

	const amp = $derived(height * 0.32);
	const midY = $derived(height / 2);
	const k = $derived((Math.PI * 2 * 2.2) / width); // ~2.2 turns

	function strandPath(phase: number): string {
		const pts: string[] = [];
		const steps = 90;
		for (let i = 0; i <= steps; i++) {
			const x = (i / steps) * width;
			const y = midY + amp * Math.sin(k * x + phase);
			pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
		}
		return pts.join(' ');
	}

	const rungs = $derived.by(() => {
		const out: { x: number; y1: number; y2: number; lead: boolean }[] = [];
		for (let i = 0; i < strands; i++) {
			const x = (i / (strands - 1)) * width;
			const y1 = midY + amp * Math.sin(k * x);
			const y2 = midY + amp * Math.sin(k * x + Math.PI);
			out.push({ x, y1, y2, lead: y1 < y2 });
		}
		return out;
	});
</script>

<svg
	class={cls}
	viewBox="0 0 {width} {height}"
	width={width}
	height={height}
	fill="none"
	aria-hidden="true">
	<path d={strandPath(0)} stroke="var(--color-ink)" stroke-width="1.4" opacity="0.55" />
	<path d={strandPath(Math.PI)} stroke="var(--color-accent)" stroke-width="1.4" opacity="0.75" />
	{#each rungs as rg, i (i)}
		<line
			x1={rg.x}
			y1={rg.y1}
			x2={rg.x}
			y2={rg.y2}
			stroke={rg.lead ? 'var(--color-accent)' : 'var(--color-ink-muted)'}
			stroke-width="1.2"
			opacity="0.35"
			style={animated ? `animation: rungpulse 2.4s ${i * 0.06}s ease-in-out infinite` : ''} />
		<circle cx={rg.x} cy={rg.y1} r="2.1" fill="var(--color-ink)" opacity="0.6" />
		<circle cx={rg.x} cy={rg.y2} r="2.1" fill="var(--color-accent)" opacity="0.8" />
	{/each}
</svg>

<style>
	@keyframes rungpulse {
		0%,
		100% {
			opacity: 0.18;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>
