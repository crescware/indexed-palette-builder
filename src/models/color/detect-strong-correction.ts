import Big from "big.js";
import { literal } from "valibot";

import { calcClosest } from "./calc-closest";
import type { OklchBig } from "./oklch-big";
import type { Pattern, Shade } from "./select-pattern";

const correctionThresholds = {
	lightnessAmbiguity$: literal(0.02), // When closest and second-closest are within this range
	lightnessDistance$: literal(0.05), // When input is far from any standard shade
} as const;

export function detectStrongCorrection(
	oklchColor: OklchBig,
	pattern: Pattern,
	closestShade: Shade,
): boolean {
	if (closestShade < 300 || 700 < closestShade) {
		return false;
	}

	const { closest, secondClosest } = calcClosest(pattern, oklchColor.l);

	if (Big(correctionThresholds.lightnessDistance$.literal).lt(closest.diff)) {
		return true;
	}

	if (
		secondClosest !== null &&
		closest.diff
			.minus(secondClosest.diff)
			.abs()
			.lt(correctionThresholds.lightnessAmbiguity$.literal)
	) {
		return true;
	}

	return false;
}
