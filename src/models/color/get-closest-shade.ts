import type { Oklch } from "culori";

import { calcClosest } from "./calc-closest";
import { hasCompetingMidShades } from "./has-competing-mid-shades";
import { orangePattern, type Pattern, type Shade } from "./select-pattern";

export function getClosestShade(oklch: Oklch, pattern: Pattern): Shade {
	const h = oklch.h ?? 0;
	const { closest, secondClosest } = calcClosest(pattern, oklch.l);

	// Special handling for edge case: amber 500 with orangePattern
	// When a color is near a hue boundary and has close competitors,
	// prefer the shade that better represents the boundary position
	if (
		pattern === orangePattern &&
		65 < h && // Close to orange/yellow boundary
		0.75 < oklch.l && // In the 500 range lightness
		hasCompetingMidShades(closest, secondClosest)
	) {
		return 500; // Prefer 500 for boundary colors
	}

	return closest.shade;
}
