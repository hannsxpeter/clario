<script lang="ts" module>
	export const bandColor: Record<string, string> = {
		human: 'var(--color-human)',
		mixed: 'var(--color-mixed)',
		ai: 'var(--color-ai)',
		ready: 'var(--color-human)',
		partial: 'var(--color-mixed)',
		weak: 'var(--color-ai)'
	};
	export const bandLabel: Record<string, string> = {
		human: 'Reads human',
		mixed: 'Mixed signals',
		ai: 'Reads AI',
		ready: 'Agent-ready',
		partial: 'Partly ready',
		weak: 'Not agent-ready'
	};
</script>

<script lang="ts">
	import type { Band } from '$lib/appTypes';
	interface Props {
		score: number;
		band: Band | string;
		size?: number;
		label?: string;
	}
	let { score, band, size = 96, label }: Props = $props();

	const r = 42;
	const circ = 2 * Math.PI * r;
	const clamped = $derived(Math.max(0, Math.min(100, Math.round(score))));
	const offset = $derived(circ * (1 - clamped / 100));
	const color = $derived(bandColor[band] ?? 'var(--color-ink-soft)');
</script>

<div class="gauge">
	<div class="ring" style="width:{size}px; height:{size}px">
		<svg viewBox="0 0 100 100" width={size} height={size}>
			<circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-line)" stroke-width="7.5" />
			<circle
				cx="50"
				cy="50"
				r={r}
				fill="none"
				stroke={color}
				stroke-width="7.5"
				stroke-linecap="round"
				stroke-dasharray={circ}
				stroke-dashoffset={offset}
				transform="rotate(-90 50 50)"
				style="transition: stroke-dashoffset 1s cubic-bezier(.2,.7,.2,1)" />
		</svg>
		<span class="score font-mono" style="color:{color}">{clamped}</span>
	</div>
	<div class="band font-mono" style="color:{color}">{bandLabel[band] ?? band}</div>
	{#if label}<div class="lab eyebrow">{label}</div>{/if}
</div>

<style>
	.gauge {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.3rem;
	}
	.ring {
		position: relative;
	}
	.ring svg {
		display: block;
		overflow: visible;
	}
	.score {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.55rem;
		font-weight: 600;
	}
	.band {
		font-size: 0.72rem;
		font-weight: 600;
	}
	.lab {
		font-size: 0.6rem;
	}
</style>
