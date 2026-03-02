import Big from "big.js";

import { calcClosest } from "./calc-closest";
import { hasCompetingMidShades } from "./has-competing-mid-shades";
import type { OklchBig } from "./oklch-big";
import { orangePattern, type Pattern, type Shade } from "./select-pattern";

export function getClosestShade(oklch: OklchBig, pattern: Pattern): Shade {
	const h = oklch.h ?? Big(0);
	const { closest, secondClosest } = calcClosest(pattern, oklch.l);

	// Special handling for edge case: amber 500 with orangePattern
	// When a color is near a hue boundary and has close competitors,
	// prefer the shade that better represents the boundary position
	if (
		pattern === orangePattern &&
		Big(65).lt(h) && // Close to orange/yellow boundary
		Big(0.75).lt(oklch.l) && // In the 500 range lightness
		hasCompetingMidShades(closest, secondClosest)
	) {
		return 500; // Prefer 500 for boundary colors
	}

	return closest.shade;
}
