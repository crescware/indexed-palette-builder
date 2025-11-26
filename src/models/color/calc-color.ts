import type { Oklch } from "culori";

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
		const blendRatio = (() => {
			if (shade === 0 || shade === 1000) {
				// Edge shades: use 100% calculated
				return 1.0;
			}

			if (closestShade < shade && 0 < shadesAround.above.length) {
				// Shades above closest: gradually transition from input to calculated
				const stepsFromClosest = shadesAround.above.indexOf(shade) + 1;
				return stepsFromClosest / shadesAround.above.length;
			}

			if (closestShade < shade && shadesAround.above.length === 0) {
				return 1.0;
			}

			if (shade < closestShade && 0 < shadesAround.below.length) {
				// Shades below closest: gradually transition from input to calculated
				const reversedBelow = [...shadesAround.below].reverse();
				const stepsFromClosest = reversedBelow.indexOf(shade) + 1;
				return stepsFromClosest / shadesAround.below.length;
			}

			return 1.0;
		})();

		// Blend between input chroma and calculated chroma
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
