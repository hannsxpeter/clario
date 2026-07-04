<script lang="ts" module>
	// Lucide-style 24x24 stroke icons. Add to this map as needed.
	export const paths: Record<string, string> = {
		plus: '<path d="M12 5v14M5 12h14"/>',
		minus: '<path d="M5 12h14"/>',
		link: '<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
		upload: '<path d="M12 3v13"/><path d="m7 8 5-5 5 5"/><path d="M5 21h14"/>',
		arrowRight: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
		arrowLeft: '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
		arrowUpRight: '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
		download: '<path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M5 21h14"/>',
		check: '<path d="m5 12 5 5 9-11"/>',
		x: '<path d="M6 6l12 12M18 6 6 18"/>',
		alert: '<path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>',
		refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
		target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5" fill="currentColor"/>',
		users: '<path d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="8" r="3.5"/><path d="M22 20v-2a4 4 0 0 0-3-3.9"/><path d="M16 4.1a4 4 0 0 1 0 7.8"/>',
		chart: '<path d="M4 4v16h16"/><path d="M8 16v-4"/><path d="M12 16V8"/><path d="M16 16v-6"/>',
		sparkle: '<path d="M12 3v6M12 15v6M3 12h6M15 12h6"/><path d="M6.3 6.3 9 9M15 15l2.7 2.7M17.7 6.3 15 9M9 15l-2.7 2.7"/>',
		dna: '<path d="M8 3c0 4 8 6 8 10s-8 4-8 8"/><path d="M16 3c0 4-8 6-8 10s8 4 8 8"/><path d="M8.5 6h7M8.5 12h7M8.5 18h7"/>',
		compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
		feather: '<path d="M20 4a7 7 0 0 0-10 0L4 10v6h6l6-6a7 7 0 0 0 4-6Z"/><path d="M16 8 4 20"/>',
		shield: '<path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6Z"/><path d="m9 12 2 2 4-4"/>',
		bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
		quote: '<path d="M7 7H4v6h5V9c0-1.5.5-2 2-2V4c-2 0-4 1-4 3Z"/><path d="M17 7h-3v6h5V9c0-1.5.5-2 2-2V4c-2 0-4 1-4 3Z"/>',
		layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
		copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>'
	};
</script>

<script lang="ts">
	interface Props {
		name: keyof typeof paths | string;
		size?: number;
		stroke?: number;
		class?: string;
	}
	let { name, size = 20, stroke = 1.75, class: cls = '' }: Props = $props();
	const d = $derived(paths[name] ?? paths.sparkle);
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={stroke}
	stroke-linecap="round"
	stroke-linejoin="round"
	class={cls}
	aria-hidden="true">
	{@html d}
</svg>
