import type { Oklch } from "culori";

export function formatOklch(color: Oklch): string {
	const l = (color.l * 100).toFixed(1);
	const c = color.c.toFixed(3);
	const h =
		color.h !== undefined && !Number.isNaN(color.h) ? color.h.toFixed(1) : "0";

	return `oklch(${l}% ${c} ${h})`;
}
