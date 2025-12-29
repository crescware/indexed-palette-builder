import type Big from "big.js";

import type { OklchBig } from "../models/color/oklch-big";

/**
 * Maximum decimal digits for CSS number serialization.
 *
 * The CSSOM specification limits serialized CSS numbers to 6 decimal digits.
 * @see https://drafts.csswg.org/cssom/#serializing-css-values
 */
const maxDecimals = 6;

/**
 * Formats a Big.js value with at most 6 decimal digits, without trailing zeros.
 */
function formatValue(value: Big): string {
	const fixed = value.toFixed(maxDecimals);
	if (!fixed.includes(".")) {
		return fixed;
	}
	return fixed.replace(/\.?0+$/, "");
}

export function formatOklch(color: OklchBig): string {
	const l = formatValue(color.l.times(100));
	const c = formatValue(color.c);
	const h = color.h !== undefined ? formatValue(color.h) : "0";

	return `oklch(${l}% ${c} ${h})`;
}
