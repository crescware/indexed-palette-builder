import type { Oklch } from "culori";
import { literal } from "valibot";

import { calcClosest } from "./calc-closest";
import type { Pattern, Shade } from "./select-pattern";

const correctionThresholds = {
	lightnessAmbiguity$: literal(0.02), // When closest and second-closest are within this range
	lightnessDistance$: literal(0.05), // When input is far from any standard shade
} as const;

export function detectStrongCorrection(
	oklchColor: Oklch,
	pattern: Pattern,
	closestShade: Shade,
): boolean {
	if (closestShade < 300 || closestShade > 700) {
		return false;
	}

	const { closest, secondClosest } = calcClosest(pattern, oklchColor.l);

	if (closest.diff > correctionThresholds.lightnessDistance$.literal) {
		return true;
	}

	if (
		secondClosest !== null &&
		Math.abs(closest.diff - secondClosest.diff) <
			correctionThresholds.lightnessAmbiguity$.literal
	) {
		return true;
	}

	return false;
}
