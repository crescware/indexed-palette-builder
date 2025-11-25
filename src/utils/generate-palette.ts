import { formatHex, type Oklch } from "culori";
import {
	type BaseIssue,
	type BaseSchema,
	literal,
	maxValue,
	minValue,
	number,
	pipe,
	safeParse,
} from "valibot";

type ShadeValues = { l: number; c: number };

// Constants for color classification
// ----------------------------------------------------------------

const chromaThresholds = {
	definitelyGray$: literal(0.005),
	veryLow$: literal(0.008),
	lowLightNeutral$: literal(0.014),
	warmNeutral$: literal(0.014),
	low$: literal(0.05),
} as const;

const lightnessThresholds = {
	veryLight$: literal(0.92),
} as const;

const hueBoundaries = {
	redOrange$: literal(38),
	orangeYellow$: literal(71),
	yellowGreen$: literal(135),
	greenCyan$: literal(215),
	cyanSky$: literal(230),
	skyBlue$: literal(250),
	bluePink$: literal(318),
} as const;

const hueRanges = {
	warmNeutralStart$: literal(30),
	warmNeutralEnd$: literal(120),
	neutralBlueStart$: literal(215),
	neutralBlueEnd$: literal(295),
} as const;

// Validation helper
function is<T>(
	schema: BaseSchema<unknown, T, BaseIssue<unknown>>,
	value: unknown,
): boolean {
	return safeParse(schema, value).success;
}

// Chroma validation schemas
const definitelyGray$ = pipe(
	number(),
	maxValue(chromaThresholds.definitelyGray$.literal),
);
const veryLowChroma$ = pipe(
	number(),
	maxValue(chromaThresholds.veryLow$.literal),
);
const lowChroma$ = pipe(number(), maxValue(chromaThresholds.low$.literal));

// Lightness validation schemas
const veryLight$ = pipe(
	number(),
	minValue(lightnessThresholds.veryLight$.literal),
);

// Hue range validation schemas
const neutralBlueHue$ = pipe(
	number(),
	minValue(hueRanges.neutralBlueStart$.literal),
	maxValue(hueRanges.neutralBlueEnd$.literal),
);
const warmNeutralHue$ = pipe(
	number(),
	minValue(hueRanges.warmNeutralStart$.literal),
	maxValue(hueRanges.warmNeutralEnd$.literal),
);

// Hue validation schemas
const red$ = pipe(
	number(),
	minValue(0),
	maxValue(hueBoundaries.redOrange$.literal),
);
const orange$ = pipe(
	number(),
	minValue(hueBoundaries.redOrange$.literal),
	maxValue(hueBoundaries.orangeYellow$.literal),
);
const yellow$ = pipe(
	number(),
	minValue(hueBoundaries.orangeYellow$.literal),
	maxValue(hueBoundaries.yellowGreen$.literal),
);
const green$ = pipe(
	number(),
	minValue(hueBoundaries.yellowGreen$.literal),
	maxValue(hueBoundaries.greenCyan$.literal),
);
const cyan$ = pipe(
	number(),
	minValue(hueBoundaries.greenCyan$.literal),
	maxValue(hueBoundaries.cyanSky$.literal),
);
const sky$ = pipe(
	number(),
	minValue(hueBoundaries.cyanSky$.literal),
	maxValue(hueBoundaries.skyBlue$.literal),
);
const blue$ = pipe(
	number(),
	minValue(hueBoundaries.skyBlue$.literal),
	maxValue(hueBoundaries.bluePink$.literal),
);
const pink$ = pipe(number(), minValue(hueBoundaries.bluePink$.literal));

// 1. Pattern definitions (including 0 and 1000)
// ----------------------------------------------------------------

// Red, Orange, Rose (warm reds and oranges)
const redPattern: Record<number, ShadeValues> = {
	0: { l: 1, c: 0 },
	50: { l: 0.971, c: 0.013 },
	100: { l: 0.936, c: 0.032 },
	200: { l: 0.885, c: 0.062 },
	300: { l: 0.808, c: 0.114 },
	400: { l: 0.704, c: 0.191 },
	500: { l: 0.637, c: 0.237 },
	600: { l: 0.577, c: 0.245 },
	700: { l: 0.505, c: 0.213 },
	800: { l: 0.444, c: 0.177 },
	900: { l: 0.396, c: 0.141 },
	950: { l: 0.258, c: 0.092 },
	1000: { l: 0, c: 0 },
};

// Blue, Indigo, Violet, Purple (cool purples and blues)
const bluePattern: Record<number, ShadeValues> = {
	0: { l: 1, c: 0 },
	50: { l: 0.967, c: 0.016 },
	100: { l: 0.935, c: 0.032 },
	200: { l: 0.876, c: 0.062 },
	300: { l: 0.797, c: 0.11 },
	400: { l: 0.69, c: 0.174 },
	500: { l: 0.604, c: 0.224 },
	600: { l: 0.529, c: 0.254 },
	700: { l: 0.473, c: 0.242 },
	800: { l: 0.411, c: 0.197 },
	900: { l: 0.369, c: 0.145 },
	950: { l: 0.27, c: 0.091 },
	1000: { l: 0, c: 0 },
};

// Green, Emerald, Teal (greens and teals)
const greenPattern: Record<number, ShadeValues> = {
	0: { l: 1, c: 0 },
	50: { l: 0.984, c: 0.014 },
	100: { l: 0.953, c: 0.051 },
	200: { l: 0.91, c: 0.096 },
	300: { l: 0.855, c: 0.138 },
	400: { l: 0.777, c: 0.152 },
	500: { l: 0.704, c: 0.14 },
	600: { l: 0.6, c: 0.118 },
	700: { l: 0.511, c: 0.096 },
	800: { l: 0.437, c: 0.078 },
	900: { l: 0.386, c: 0.063 },
	950: { l: 0.277, c: 0.046 },
	1000: { l: 0, c: 0 },
};

// Cyan (bright blue-greens)
const cyanPattern: Record<number, ShadeValues> = {
	0: { l: 1, c: 0 },
	50: { l: 0.984, c: 0.019 },
	100: { l: 0.956, c: 0.045 },
	200: { l: 0.917, c: 0.08 },
	300: { l: 0.865, c: 0.127 },
	400: { l: 0.789, c: 0.154 },
	500: { l: 0.715, c: 0.143 },
	600: { l: 0.609, c: 0.126 },
	700: { l: 0.52, c: 0.105 },
	800: { l: 0.45, c: 0.085 },
	900: { l: 0.398, c: 0.07 },
	950: { l: 0.302, c: 0.056 },
	1000: { l: 0, c: 0 },
};

// Sky (light blues)
const skyPattern: Record<number, ShadeValues> = {
	0: { l: 1, c: 0 },
	50: { l: 0.977, c: 0.013 },
	100: { l: 0.951, c: 0.026 },
	200: { l: 0.901, c: 0.058 },
	300: { l: 0.828, c: 0.111 },
	400: { l: 0.746, c: 0.16 },
	500: { l: 0.685, c: 0.169 },
	600: { l: 0.588, c: 0.158 },
	700: { l: 0.5, c: 0.134 },
	800: { l: 0.443, c: 0.11 },
	900: { l: 0.391, c: 0.09 },
	950: { l: 0.293, c: 0.066 },
	1000: { l: 0, c: 0 },
};

// Pink, Fuchsia (bright pinks and magentas)
const pinkPattern: Record<number, ShadeValues> = {
	0: { l: 1, c: 0 },
	50: { l: 0.974, c: 0.016 },
	100: { l: 0.95, c: 0.033 },
	200: { l: 0.901, c: 0.069 },
	300: { l: 0.828, c: 0.133 },
	400: { l: 0.729, c: 0.22 },
	500: { l: 0.662, c: 0.268 },
	600: { l: 0.592, c: 0.271 },
	700: { l: 0.522, c: 0.238 },
	800: { l: 0.456, c: 0.199 },
	900: { l: 0.405, c: 0.162 },
	950: { l: 0.289, c: 0.123 },
	1000: { l: 0, c: 0 },
};

// Low saturation colors (Slate, Gray, Zinc, Neutral, Stone)
const lowSaturationPattern: Record<number, ShadeValues> = {
	0: { l: 1, c: 0 },
	50: { l: 0.985, c: 0.001 },
	100: { l: 0.968, c: 0.002 },
	200: { l: 0.922, c: 0.006 },
	300: { l: 0.871, c: 0.009 },
	400: { l: 0.706, c: 0.018 },
	500: { l: 0.553, c: 0.019 },
	600: { l: 0.443, c: 0.019 },
	700: { l: 0.372, c: 0.019 },
	800: { l: 0.276, c: 0.014 },
	900: { l: 0.211, c: 0.014 },
	950: { l: 0.14, c: 0.012 },
	1000: { l: 0, c: 0 },
};

// Yellow, Lime, Amber (bright yellows)
const yellowPattern: Record<number, ShadeValues> = {
	0: { l: 1, c: 0 },
	50: { l: 0.987, c: 0.024 },
	100: { l: 0.965, c: 0.063 },
	200: { l: 0.931, c: 0.123 },
	300: { l: 0.888, c: 0.175 },
	400: { l: 0.836, c: 0.197 },
	500: { l: 0.776, c: 0.19 },
	600: { l: 0.671, c: 0.174 },
	700: { l: 0.555, c: 0.154 },
	800: { l: 0.473, c: 0.13 },
	900: { l: 0.415, c: 0.107 },
	950: { l: 0.281, c: 0.074 },
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
	500: { l: 0.737, c: 0.213 },
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
	const l = oklch.l ?? 0;

	if (is(lowChroma$, c)) {
		if (is(definitelyGray$, c)) {
			return lowSaturationPattern;
		}

		const isWarmNeutral =
			is(warmNeutralHue$, h) && c < chromaThresholds.warmNeutral$.literal;
		const isInNeutralRange = is(neutralBlueHue$, h) || isWarmNeutral;

		if (is(veryLight$, l)) {
			const isLowLightNeutral =
				isInNeutralRange && c < chromaThresholds.lowLightNeutral$.literal;
			if (is(veryLowChroma$, c) || isLowLightNeutral) {
				return lowSaturationPattern;
			}
		} else {
			if (isInNeutralRange) {
				return lowSaturationPattern;
			}
		}
	}

	if (is(orange$, h)) {
		return orangePattern;
	}

	if (is(yellow$, h)) {
		return yellowPattern;
	}

	if (is(green$, h)) {
		return greenPattern;
	}

	if (is(cyan$, h)) {
		return cyanPattern;
	}

	if (is(sky$, h)) {
		return skyPattern;
	}

	if (is(blue$, h)) {
		return bluePattern;
	}

	if (is(pink$, h)) {
		return pinkPattern;
	}

	if (is(red$, h)) {
		return redPattern;
	}

	throw new Error("never reached");
}

function calcClosest(
	pattern: Record<number, ShadeValues>,
	l: number,
): {
	closest: { shade: number; diff: number };
	secondClosest: { shade: number; diff: number } | null;
} {
	const sortedCandidates = Object.entries(pattern)
		.reduce<{ shade: number; diff: number }[]>((acc, [shadeStr, values]) => {
			const diff = Math.abs(l - values.l);
			acc.push({ shade: Number(shadeStr), diff });
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

function getClosestShade(
	l: number,
	h: number,
	pattern: Record<number, ShadeValues>,
): number {
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

	const closestShade = getClosestShade(inputL, inputH, pattern);

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
