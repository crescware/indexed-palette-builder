import Big from "big.js";

import type { calcShadesAroundClosest } from "./calc-shades-around-closest";
import type { Shade } from "./select-pattern";

export function calcBlendRatio(
	shade: Shade,
	closestShade: Shade,
	shadesAround: ReturnType<typeof calcShadesAroundClosest>,
): Big {
	if (shade === 0 || shade === 1000) {
		// Edge shades: use 100% calculated
		return Big(1);
	}

	if (closestShade < shade && 0 < shadesAround.above.length) {
		// Shades above closest: gradually transition from input to calculated
		const stepsFromClosest = shadesAround.above.indexOf(shade) + 1;
		return Big(stepsFromClosest).div(shadesAround.above.length);
	}

	if (closestShade < shade && shadesAround.above.length === 0) {
		return Big(1);
	}

	if (shade < closestShade && 0 < shadesAround.below.length) {
		// Shades below closest: gradually transition from input to calculated
		const reversedBelow = [...shadesAround.below].reverse();
		const stepsFromClosest = reversedBelow.indexOf(shade) + 1;
		return Big(stepsFromClosest).div(shadesAround.below.length);
	}

	return Big(1);
}
