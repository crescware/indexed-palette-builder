import { formatHex, type Oklch } from "culori";

type ShadeValues = { l: number; c: number };

// 1. Pattern definitions (including 0 and 1000)
// ----------------------------------------------------------------

// Red, Orange, Rose (warm reds and oranges)
const warmRedPattern: Record<number, ShadeValues> = {
	0: { l: 1, c: 0 },
	50: { l: 0.971, c: 0.014 },
	100: { l: 0.941, c: 0.03 },
	200: { l: 0.892, c: 0.06 },
	300: { l: 0.81, c: 0.115 },
	400: { l: 0.712, c: 0.19 },
	500: { l: 0.645, c: 0.246 },
	600: { l: 0.586, c: 0.253 },
	700: { l: 0.514, c: 0.222 },
	800: { l: 0.455, c: 0.188 },
	900: { l: 0.41, c: 0.159 },
	950: { l: 0.271, c: 0.105 },
	1000: { l: 0, c: 0 },
};

// Blue, Indigo, Violet, Purple (cool purples and blues)
const coolBluePattern: Record<number, ShadeValues> = {
	0: { l: 1, c: 0 },
	50: { l: 0.969, c: 0.016 },
	100: { l: 0.932, c: 0.032 },
	200: { l: 0.887, c: 0.062 },
	300: { l: 0.808, c: 0.116 },
	400: { l: 0.698, c: 0.195 },
	500: { l: 0.607, c: 0.255 },
	600: { l: 0.534, c: 0.275 },
	700: { l: 0.481, c: 0.25 },
	800: { l: 0.413, c: 0.206 },
	900: { l: 0.373, c: 0.164 },
	950: { l: 0.27, c: 0.107 },
	1000: { l: 0, c: 0 },
};

// Green, Emerald, Teal, Cyan (greens and teals)
const greenTealPattern: Record<number, ShadeValues> = {
	0: { l: 1, c: 0 },
	50: { l: 0.98, c: 0.017 },
	100: { l: 0.954, c: 0.048 },
	200: { l: 0.911, c: 0.087 },
	300: { l: 0.857, c: 0.139 },
	400: { l: 0.778, c: 0.178 },
	500: { l: 0.707, c: 0.168 },
	600: { l: 0.609, c: 0.147 },
	700: { l: 0.515, c: 0.118 },
	800: { l: 0.445, c: 0.095 },
	900: { l: 0.388, c: 0.077 },
	950: { l: 0.277, c: 0.057 },
	1000: { l: 0, c: 0 },
};

// Sky, Pink, Fuchsia (light and bright colors)
const lightBrightPattern: Record<number, ShadeValues> = {
	0: { l: 1, c: 0 },
	50: { l: 0.974, c: 0.015 },
	100: { l: 0.948, c: 0.033 },
	200: { l: 0.901, c: 0.067 },
	300: { l: 0.827, c: 0.125 },
	400: { l: 0.733, c: 0.208 },
	500: { l: 0.669, c: 0.252 },
	600: { l: 0.591, c: 0.267 },
	700: { l: 0.518, c: 0.233 },
	800: { l: 0.452, c: 0.193 },
	900: { l: 0.404, c: 0.159 },
	950: { l: 0.293, c: 0.12 },
	1000: { l: 0, c: 0 },
};

// Low saturation colors (Slate, Gray, Zinc, Neutral, Stone)
const lowSaturationPattern: Record<number, ShadeValues> = {
	0: { l: 1, c: 0 },
	50: { l: 0.985, c: 0.002 },
	100: { l: 0.968, c: 0.003 },
	200: { l: 0.923, c: 0.007 },
	300: { l: 0.871, c: 0.011 },
	400: { l: 0.707, c: 0.024 },
	500: { l: 0.554, c: 0.026 },
	600: { l: 0.444, c: 0.025 },
	700: { l: 0.373, c: 0.025 },
	800: { l: 0.278, c: 0.022 },
	900: { l: 0.212, c: 0.022 },
	950: { l: 0.139, c: 0.019 },
	1000: { l: 0, c: 0 },
};

// Yellow, Lime, Amber (bright yellows)
const yellowPattern: Record<number, ShadeValues> = {
	0: { l: 1, c: 0 },
	50: { l: 0.987, c: 0.026 },
	100: { l: 0.967, c: 0.066 },
	200: { l: 0.937, c: 0.126 },
	300: { l: 0.897, c: 0.181 },
	400: { l: 0.844, c: 0.205 },
	500: { l: 0.782, c: 0.191 },
	600: { l: 0.676, c: 0.168 },
	700: { l: 0.554, c: 0.144 },
	800: { l: 0.473, c: 0.122 },
	900: { l: 0.415, c: 0.102 },
	950: { l: 0.283, c: 0.071 },
	1000: { l: 0, c: 0 },
};

// Orange (warm orange transitioning from yellow to red)
const orangePattern: Record<number, ShadeValues> = {
	0: { l: 1, c: 0 },
	50: { l: 0.98, c: 0.016 },
	100: { l: 0.954, c: 0.038 },
	200: { l: 0.901, c: 0.076 },
	300: { l: 0.837, c: 0.128 },
	400: { l: 0.75, c: 0.183 },
	500: { l: 0.705, c: 0.213 },
	600: { l: 0.646, c: 0.222 },
	700: { l: 0.553, c: 0.195 },
	800: { l: 0.47, c: 0.157 },
	900: { l: 0.408, c: 0.123 },
	950: { l: 0.266, c: 0.079 },
	1000: { l: 0, c: 0 },
};

// 2. Logic functions
// ----------------------------------------------------------------

function selectPattern(oklch: Oklch): Record<number, ShadeValues> {
	const c = oklch.c ?? 0;
	const h = oklch.h ?? 0;

	// Grays: chroma less than 0.05
	// But also check that we're not in a strongly colored hue range
	// True grays will have hue anywhere, but we want to catch slate/gray/zinc colors
	if (c < 0.05) {
		// If chroma is very low (< 0.01), definitely a gray
		if (c < 0.01) {
			return lowSaturationPattern;
		}
		// For moderate low chroma (0.01-0.05), only treat as gray if
		// not strongly associated with a color hue
		// Avoid mis-classifying light shades of saturated colors
		const isInNeutralRange =
			(h >= 180 && h <= 280) || // Blue-ish grays (slate)
			c < 0.015; // Very low chroma regardless of hue
		if (isInNeutralRange) {
			return lowSaturationPattern;
		}
	}

	// Orange (warm orange): 50-85 degrees
	if (h >= 50 && h <= 85) {
		return orangePattern;
	}

	// Yellow/Lime/Amber (bright yellows): 85-135 degrees
	if (h >= 85 && h <= 135) {
		return yellowPattern;
	}

	// Green/Teal/Cyan: 135-220 degrees
	if (h >= 135 && h <= 220) {
		return greenTealPattern;
	}

	// Blue/Indigo/Violet/Purple: 220-320 degrees
	if (h >= 220 && h <= 320) {
		return coolBluePattern;
	}

	// Pink/Fuchsia/Sky (pink side): 320-360 degrees or special cases
	if (h >= 320 || (h >= 230 && h <= 245 && c > 0.15)) {
		return lightBrightPattern;
	}

	// Red/Rose (warm reds): 0-50 degrees
	return warmRedPattern;
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

export function generatePalette(oklchColor: Oklch): PaletteStep[] {
	// 1. Select the curve pattern
	const pattern = selectPattern(oklchColor);

	// 2. Determine where the input color sits on the curve
	const inputL = oklchColor.l ?? 0;
	const inputC = oklchColor.c ?? 0;
	const inputH = oklchColor.h ?? 0;

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
