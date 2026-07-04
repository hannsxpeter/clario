<script lang="ts" module>
	export const donutPalette = [
		'#c8492b',
		'#2f7a55',
		'#bd882a',
		'#8f3016',
		'#4b6a8a',
		'#a8622f',
		'#5c7a52',
		'#7c5a3a',
		'#9c3b2a',
		'#c99a4a',
		'#6b6152',
		'#7a4b6a'
	];
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	interface Seg {
		label: string;
		value: number;
		color?: string;
	}
	interface Props {
		segments: Seg[];
		size?: number;
		thickness?: number;
		children?: Snippet;
	}
	let { segments, size = 210, thickness = 20, children }: Props = $props();

	const r = 42;
	const circ = 2 * Math.PI * r;
	const total = $derived(segments.reduce((s, x) => s + Math.max(0, x.value), 0) || 1);

	const arcs = $derived.by(() => {
		let cum = 0;
		return segments.map((s, i) => {
			const frac = Math.max(0, s.value) / total;
			const len = frac * circ;
			const offset = -cum * circ;
			cum += frac;
			return {
				len,
				gap: circ - len,
				offset,
				color: s.color ?? donutPalette[i % donutPalette.length]
			};
		});
	});
</script>

<div class="donut" style="width:{size}px; height:{size}px">
	<svg viewBox="0 0 100 100" width={size} height={size}>
		<circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-line)" stroke-width={thickness / 10} />
		{#each arcs as a, i (i)}
			<circle
				cx="50"
				cy="50"
				r={r}
				fill="none"
				stroke={a.color}
				stroke-width={thickness / 10}
				stroke-dasharray="{a.len} {a.gap}"
				stroke-dashoffset={a.offset}
				transform="rotate(-90 50 50)"
				style="transition: stroke-dasharray .8s cubic-bezier(.2,.7,.2,1); animation: fade .5s {i * 0.05}s both">
			</circle>
		{/each}
	</svg>
	{#if children}
		<div class="center">{@render children()}</div>
	{/if}
</div>

<style>
	.donut {
		position: relative;
	}
	.donut svg {
		display: block;
	}
	.center {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
