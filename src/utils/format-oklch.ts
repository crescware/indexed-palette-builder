import Big from "big.js";
import type { Oklch } from "culori";

export function formatOklch(color: Oklch): string {
	const l = Big(color.l).times(100).toString();
	const c = Big(color.c).toString();
	const h =
		color.h !== undefined && !Number.isNaN(color.h)
			? Big(color.h).toString()
			: "0";

	return `oklch(${l}% ${c} ${h})`;
}
