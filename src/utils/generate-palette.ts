import { formatHex, type Oklch } from "culori";
import {
	orangePattern,
	type Pattern,
	type Shade,
	selectPattern,
} from "./select-pattern";

function calcClosest(
	pattern: Pattern,
	l: number,
): {
	closest: { shade: Shade; diff: number };
	secondClosest: { shade: Shade; diff: number } | null;
} {
	const sortedCandidates = Object.entries(pattern)
		.reduce<{ shade: Shade; diff: number }[]>((acc, [shadeStr, values]) => {
			const diff = Math.abs(l - values.l);
			acc.push({ shade: Number(shadeStr) as Shade, diff });
			return acc;
		}, [])
		.sort((a, b) => a.diff - b.diff);

	const [closest, secondClosest] = sortedCandidates;

	return { closest, secondClosest: secondClosest ?? null };
}

function hasCompetingMidShades(
	closest: ReturnType<typeof calcClosest>["closest"],
	secondClosest: ReturnType<typeof calcClosest>["secondClosest"],
): boolean {
	return (
		secondClosest !== null &&
		closest.shade === 400 &&
		secondClosest.shade === 500 &&
		Math.abs(closest.diff - secondClosest.diff) < 0.015
	);
}

function getClosestShade(l: number, h: number, pattern: Pattern): Shade {
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

export type PaletteStep = {
	shade: Shade;
	hex: string;
	isClosest: boolean;
};

export function generatePalette(oklchColor: Oklch): PaletteStep[] {
	// 1. Select the curve pattern
	const pattern = selectPattern(oklchColor);

	// 2. Determine where the input color sits on the curve
	const inputL = oklchColor.l ?? 0;
	const inputC = oklchColor.c ?? 0;
	const inputH = oklchColor.h ?? 0;

	const closestShade = getClosestShade(inputL, inputH, pattern);

	// 3. Calculate chroma scaling ratio
	const defaultC = pattern[closestShade].c;

	// If defaultC is 0 (shades 0/1000 or pure gray), use scale ratio of 1
	const chromaScale = 0.001 < defaultC ? inputC / defaultC : 1;

	// 4. Generate palette
	return Object.entries(pattern)
		.map(([shadeStr, values]) => {
			const shade = Number(shadeStr) as Shade;

			// Apply constant lightness (L) to maintain Tailwind's rhythm
			const targetL = values.l;

			// Scale chroma (C) by ratio
			// Cap at ~0.37 to respect P3 gamut limits
			const targetC = Math.min(values.c * chromaScale, 0.37);

			const newColor: Oklch = {
				mode: "oklch",
				l: targetL,
				c: targetC,
				h: inputH, // Keep hue constant
			};

			return {
				shade,
				hex: formatHex(newColor),
				isClosest: shade === closestShade,
			};
		})
		.sort((a, b) => a.shade - b.shade);
}
