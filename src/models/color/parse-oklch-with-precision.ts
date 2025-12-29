import Big from "big.js";
import { type Oklch, parse } from "culori";

import { extractPreciseValue } from "./extract-precise-value";
import type { OklchBig } from "./oklch-big";

/**
 * Parses an OKLCH color string with precision preservation.
 *
 * Uses culori for syntax validation and parsing, then extracts precise values
 * from the original string using integer-anchored matching to avoid
 * floating-point artifacts.
 *
 * @param input - The OKLCH color string (e.g., "oklch(68.1% 0.162 75.834)")
 * @returns OklchBig with Big.js values, or null if parsing fails
 */
export function parseOklchWithPrecision(input: string): OklchBig | null {
	const parsed = parse(input);
	if (!parsed || parsed.mode !== "oklch") {
		return null;
	}
	const oklch = parsed as Oklch;

	const isLightnessPercentage = input.includes("%");
	const l = extractPreciseValue(input, oklch.l, isLightnessPercentage);
	const c = extractPreciseValue(input, oklch.c, false);
	const h =
		oklch.h !== undefined ? extractPreciseValue(input, oklch.h, false) : Big(0);

	if (oklch.alpha !== undefined) {
		const alpha = extractPreciseValue(input, oklch.alpha, false);
		return { mode: "oklch", l, c, h, alpha };
	}

	return { mode: "oklch", l, c, h };
}
