import type { Oklch } from "culori";

import { calcBlendRatio } from "./calc-blend-ratio";
import type { calcShadesAroundClosest } from "./calc-shades-around-closest";
import type { Shade, ShadeDefinition } from "./select-pattern";

export function calcColor(
	shade: Shade,
	closestShade: Shade,
	oklch: Oklch,
	shadeDef: ShadeDefinition,
	chromaScale: number,
	shadesAround: ReturnType<typeof calcShadesAroundClosest>,
): Oklch {
	if (shade === closestShade) {
		return oklch;
	}

	// Calculate the scaled chroma (calculated)
	const calculatedC = shadeDef.c * chromaScale;

	const targetC = (() => {
		const blendRatio = calcBlendRatio(shade, closestShade, shadesAround);
		const blended = oklch.c * (1 - blendRatio) + calculatedC * blendRatio;

		// Cap at ~0.37 to respect P3 gamut limits
		return Math.min(blended, 0.37);
	})();

	return {
		mode: "oklch" as const,
		l: shadeDef.l,
		c: targetC,
		h: oklch.h ?? 0,
	};
}
