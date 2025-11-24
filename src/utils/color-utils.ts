import { converter, formatHex, type Oklch } from "culori";

const toOklch = converter("oklch");

type ShadeValues = { l: number; c: number };

// 1. Pattern definitions (including 0 and 1000)
// ----------------------------------------------------------------

// High saturation colors (Red, Blue, Emerald, Violet, etc.)
const highSaturationPattern: Record<number, ShadeValues> = {
	0: { l: 1, c: 0 },
	50: { l: 0.975, c: 0.015 },
	100: { l: 0.94, c: 0.035 },
	200: { l: 0.89, c: 0.065 },
	300: { l: 0.81, c: 0.115 },
	400: { l: 0.71, c: 0.17 },
	500: { l: 0.63, c: 0.22 }, // Reference
	600: { l: 0.55, c: 0.25 }, // Peak
	700: { l: 0.49, c: 0.23 },
	800: { l: 0.42, c: 0.19 },
	900: { l: 0.37, c: 0.15 },
	950: { l: 0.27, c: 0.1 },
	1000: { l: 0, c: 0 },
};

// Low saturation colors (Slate, Gray, Zinc, Neutral, Stone)
const lowSaturationPattern: Record<number, ShadeValues> = {
	0: { l: 1, c: 0 },
	50: { l: 0.985, c: 0.002 },
	100: { l: 0.965, c: 0.005 },
	200: { l: 0.925, c: 0.01 },
	300: { l: 0.87, c: 0.015 },
	400: { l: 0.705, c: 0.025 },
	500: { l: 0.555, c: 0.03 },
	600: { l: 0.445, c: 0.03 },
	700: { l: 0.375, c: 0.03 },
	800: { l: 0.28, c: 0.025 },
	900: { l: 0.21, c: 0.02 },
	950: { l: 0.14, c: 0.015 },
	1000: { l: 0, c: 0 },
};

// Bright hues (Yellow, Lime, Amber)
const brightHuePattern: Record<number, ShadeValues> = {
	0: { l: 1, c: 0 },
	50: { l: 0.985, c: 0.025 },
	100: { l: 0.965, c: 0.065 },
	200: { l: 0.935, c: 0.125 },
	300: { l: 0.89, c: 0.18 },
	400: { l: 0.84, c: 0.21 },
	500: { l: 0.78, c: 0.2 },
	600: { l: 0.68, c: 0.17 },
	700: { l: 0.55, c: 0.14 },
	800: { l: 0.47, c: 0.12 },
	900: { l: 0.41, c: 0.1 },
	950: { l: 0.29, c: 0.07 },
	1000: { l: 0, c: 0 },
};

// 2. Logic functions
// ----------------------------------------------------------------

function selectPattern(oklch: Oklch): Record<number, ShadeValues> {
	const c = oklch.c ?? 0;
	const h = oklch.h ?? 0;

	// A. Grays: extremely low chroma
	if (c < 0.04) {
		return lowSaturationPattern;
	}

	// B. Bright hues (Yellow/Lime/Amber)
	// Prioritize hue range (85-135) to prevent dark yellows from becoming muddy with normal curve
	const isYellowishHue = h >= 85 && h <= 135;
	if (isYellowishHue) {
		return brightHuePattern;
	}

	// C. Default high saturation pattern
	return highSaturationPattern;
}

function getClosestShade(
	l: number,
	pattern: Record<number, ShadeValues>,
): number {
	let closestShade = 500;
	let minDiff = Number.MAX_VALUE;

	for (const [shadeStr, values] of Object.entries(pattern)) {
		const diff = Math.abs(l - values.l);
		if (diff < minDiff) {
			minDiff = diff;
			closestShade = Number(shadeStr);
		}
	}
	return closestShade;
}

export type PaletteStep = {
	shade: number;
	hex: string;
	isClosest: boolean;
};

export function generatePalette(hexInput: string): PaletteStep[] {
	const originalColor = toOklch(hexInput);
	if (!originalColor) return [];

	// 1. Select the curve pattern
	const pattern = selectPattern(originalColor);

	// 2. Determine where the input color sits on the curve
	const inputL = originalColor.l ?? 0;
	const inputC = originalColor.c ?? 0;
	const inputH = originalColor.h ?? 0;

	const closestShade = getClosestShade(inputL, pattern);

	// 3. Calculate chroma scaling ratio
	const defaultC = pattern[closestShade].c;

	// If defaultC is 0 (shades 0/1000 or pure gray), use scale ratio of 1
	const chromaScale = 0.001 < defaultC ? inputC / defaultC : 1;

	// 4. Generate palette
	return Object.entries(pattern)
		.map(([shadeStr, values]) => {
			const shade = Number(shadeStr);

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

export function isValidHex(hex: string): boolean {
	return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
}
