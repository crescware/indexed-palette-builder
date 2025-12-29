import type { OklchBig } from "../models/color/oklch-big";

export function formatOklch(color: OklchBig): string {
	const l = color.l.times(100).toString();
	const c = color.c.toString();
	const h = color.h !== undefined ? color.h.toString() : "0";

	return `oklch(${l}% ${c} ${h})`;
}
