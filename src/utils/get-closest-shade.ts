import type { Oklch } from "culori";

import { calcClosest } from "./calc-closest";
import { hasCompetingMidShades } from "./has-competing-mid-shades";
import { orangePattern, type Pattern, type Shade } from "./select-pattern";

export function getClosestShade(oklchColor: Oklch, pattern: Pattern): Shade {
	const l = oklchColor.l;
	const h = oklchColor.h ?? 0;
	const { closest, secondClosest } = calcClosest(pattern, l);

	// Special handling for edge case: amber 500 with orangePattern
	// When a color is near a hue boundary and has close competitors,
	// prefer the shade that better represents the boundary position
	if (
		pattern === orangePattern &&
		h > 65 && // Close to orange/yellow boundary
		l > 0.75 && // In the 500 range lightness
		hasCompetingMidShades(closest, secondClosest)
	) {
		return 500; // Prefer 500 for boundary colors
	}

	return closest.shade;
}
