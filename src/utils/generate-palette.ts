import { formatHex, type Oklch } from "culori";
import { literal } from "valibot";
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
	oklch: Oklch;
	isClosest: boolean;
	needsStrongCorrection: boolean;
};

// Thresholds for detecting "non-Tailwind-like" colors
const correctionThresholds = {
	lightnessAmbiguity$: literal(0.02), // When closest and second-closest are within this range
	lightnessDistance$: literal(0.05), // When input is far from any standard shade
} as const;

function detectStrongCorrection(
	pattern: Pattern,
	inputL: number,
	closestShade: Shade,
): boolean {
	// Only detect for mid-range shades (300-700)
	if (closestShade < 300 || closestShade > 700) {
		return false;
	}

	const { closest, secondClosest } = calcClosest(pattern, inputL);

	// Check if input is far from any standard shade
	if (closest.diff > correctionThresholds.lightnessDistance$.literal) {
		return true;
	}

	// Check if input is ambiguously between two shades
	if (
		secondClosest !== null &&
		Math.abs(closest.diff - secondClosest.diff) <
			correctionThresholds.lightnessAmbiguity$.literal
	) {
		return true;
	}

	return false;
}

export function generatePalette(oklchColor: Oklch): PaletteStep[] {
	// Select the curve pattern
	const pattern = selectPattern(oklchColor);

	// Determine where the input color sits on the curve
	const inputL = oklchColor.l ?? 0;
	const inputC = oklchColor.c ?? 0;
	const inputH = oklchColor.h ?? 0;

	const closestShade = getClosestShade(inputL, inputH, pattern);

	// Detect if the input color needs strong correction
	const isInputAmbiguous = detectStrongCorrection(pattern, inputL, closestShade);

	// Calculate chroma scaling ratio
	const defaultC = pattern[closestShade].c;

	// If defaultC is 0 (shades 0/1000 or pure gray), use scale ratio of 1
	const chromaScale = 0.001 < defaultC ? inputC / defaultC : 1;

	// Get shade values as sorted array
	const shades = Object.keys(pattern)
		.map(Number)
		.sort((a, b) => a - b) as Shade[];

	// Define transition boundaries (50 on low end, 950 on high end)
	const lowerBoundary = 50;
	const upperBoundary = 950;

	// Calculate max transition distances from closest shade
	const shadesAbove = shades.filter(
		(s) => s > closestShade && s <= upperBoundary,
	);
	const shadesBelow = shades.filter(
		(s) => s < closestShade && s >= lowerBoundary,
	);
	const maxStepsAbove = shadesAbove.length;
	const maxStepsBelow = shadesBelow.length;

	// Generate palette
	return Object.entries(pattern)
		.map(([shadeStr, values]) => {
			const shade = Number(shadeStr) as Shade;

			const newColor: Oklch = (() => {
				if (shade === closestShade) {
					// Use exact input color for closest shade
					return {
						mode: "oklch" as const,
						l: inputL,
						c: inputC,
						h: inputH,
					};
				}

				// Calculate the scaled chroma (calculated)
				const calculatedC = values.c * chromaScale;

				const targetC = (() => {
					const blendRatio = (() => {
						if (shade === 0 || shade === 1000) {
							// Edge shades: use 100% calculated
							return 1.0;
						}
						if (shade > closestShade && maxStepsAbove > 0) {
							// Shades above closest: gradually transition from input to calculated
							const stepsFromClosest = shadesAbove.indexOf(shade) + 1;
							return stepsFromClosest / maxStepsAbove;
						}
						if (shade > closestShade && maxStepsAbove === 0) {
							return 1.0;
						}
						if (shade < closestShade && maxStepsBelow > 0) {
							// Shades below closest: gradually transition from input to calculated
							const reversedBelow = [...shadesBelow].reverse();
							const stepsFromClosest = reversedBelow.indexOf(shade) + 1;
							return stepsFromClosest / maxStepsBelow;
						}
						return 1.0;
					})();

					// Blend between input chroma and calculated chroma
					const blended = inputC * (1 - blendRatio) + calculatedC * blendRatio;

					// Cap at ~0.37 to respect P3 gamut limits
					return Math.min(blended, 0.37);
				})();

				return {
					mode: "oklch" as const,
					l: values.l, // Pattern lightness
					c: targetC,
					h: inputH, // Keep hue constant
				};
			})();

			return {
				shade,
				hex: formatHex(newColor),
				oklch: newColor,
				isClosest: shade === closestShade,
				needsStrongCorrection: shade === closestShade && isInputAmbiguous,
			};
		})
		.sort((a, b) => a.shade - b.shade);
}
