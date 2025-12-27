import Big from "big.js";
import type { Oklch } from "culori";

import { calcBlendRatio } from "./calc-blend-ratio";
import type { calcShadesAroundClosest } from "./calc-shades-around-closest";
import type { Shade, ShadeDefinition } from "./select-pattern";

export function calcColor(
	shade: Shade,
	closestShade: Shade,
	oklch: Oklch,
	shadeDef: ShadeDefinition,
	chromaScale: Big,
	shadesAround: ReturnType<typeof calcShadesAroundClosest>,
): Oklch {
	if (shade === closestShade) {
		return oklch;
	}

	// Calculate the scaled chroma (calculated)
	const calculatedC = Big(shadeDef.c).times(chromaScale);

	const targetC = (() => {
		const blendRatio = calcBlendRatio(shade, closestShade, shadesAround);
		const oneMinusBlendRatio = Big(1).minus(blendRatio);
		const blended = Big(oklch.c)
			.times(oneMinusBlendRatio)
			.plus(calculatedC.times(blendRatio));

		// Cap at ~0.37 to respect P3 gamut limits
		const maxChroma = Big(0.37);
		return blended.gt(maxChroma) ? maxChroma.toNumber() : blended.toNumber();
	})();

	return {
		mode: "oklch" as const,
		l: shadeDef.l,
		c: targetC,
		h: oklch.h ?? 0,
	};
}
