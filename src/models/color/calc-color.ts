import Big from "big.js";

import { calcBlendRatio } from "./calc-blend-ratio";
import type { calcShadesAroundClosest } from "./calc-shades-around-closest";
import type { OklchBig } from "./oklch-big";
import type { Shade, ShadeDefinition } from "./select-pattern";

export function calcColor(
	shade: Shade,
	closestShade: Shade,
	oklch: OklchBig,
	shadeDef: ShadeDefinition,
	chromaScale: Big,
	shadesAround: ReturnType<typeof calcShadesAroundClosest>,
): OklchBig {
	if (shade === closestShade) {
		return oklch;
	}

	const calculatedC = Big(shadeDef.c).times(chromaScale);

	const targetC = ((): Big => {
		const blendRatio = calcBlendRatio(shade, closestShade, shadesAround);
		const oneMinusBlendRatio = Big(1).minus(blendRatio);
		const blended = oklch.c
			.times(oneMinusBlendRatio)
			.plus(calculatedC.times(blendRatio));

		const maxChroma = Big(0.37);
		return blended.gt(maxChroma) ? maxChroma : blended;
	})();

	return {
		mode: "oklch" as const,
		l: Big(shadeDef.l),
		c: targetC,
		h: oklch.h,
	};
}
