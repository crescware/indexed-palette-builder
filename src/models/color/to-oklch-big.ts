import Big from "big.js";
import { converter } from "culori";

import type { OklchBig } from "./oklch-big";

const toOklch = converter("oklch");

/**
 * Converts a hex color string to OklchBig.
 */
export function toOklchBig(hex: string): OklchBig | null {
	const oklch = toOklch(hex);
	if (!oklch) {
		return null;
	}

	return {
		mode: "oklch",
		l: Big(oklch.l),
		c: Big(oklch.c),
		...(oklch.h !== undefined && { h: Big(oklch.h) }),
	};
}
