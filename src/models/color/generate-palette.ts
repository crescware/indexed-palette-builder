import Big from "big.js";
import { formatHex, type Oklch } from "culori";

import { calcColor } from "./calc-color";
import { calcShadesAroundClosest } from "./calc-shades-around-closest";
import { detectStrongCorrection } from "./detect-strong-correction";
import { getClosestShade } from "./get-closest-shade";
import { type Shade, selectPattern } from "./select-pattern";

export type PaletteStep = Readonly<{
	shade: Shade;
	hex: string;
	oklch: Oklch;
	isClosest: boolean;
	needsStrongCorrection: boolean;
}>;

export function generatePalette(oklch: Oklch): readonly PaletteStep[] {
	const pattern = selectPattern(oklch);
	const closestShade = getClosestShade(oklch, pattern);
	const defaultC = pattern[closestShade].c;
	const chromaScale = 0.001 < defaultC ? Big(oklch.c).div(defaultC) : Big(1);

	const shades = Object.keys(pattern)
		.map((v) => parseInt(v, 10))
		.sort((a, b) => a - b) as Shade[];

	const shadesAround = calcShadesAroundClosest(shades, closestShade);
	const isInputAmbiguous = detectStrongCorrection(oklch, pattern, closestShade);

	return Object.entries(pattern)
		.map(([shadeStr, shadeDef]) => {
			const shade = parseInt(shadeStr, 10) as Shade;

			const isClosest = shade === closestShade;
			const newColor = calcColor(
				shade,
				closestShade,
				oklch,
				shadeDef,
				chromaScale,
				shadesAround,
			);

			return {
				shade,
				hex: formatHex(newColor),
				oklch: newColor,
				isClosest,
				needsStrongCorrection: isClosest && isInputAmbiguous,
			};
		})
		.sort((a, b) => a.shade - b.shade);
}
