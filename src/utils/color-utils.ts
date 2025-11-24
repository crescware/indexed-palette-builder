import { converter, formatHex, type Oklch } from "culori";

const toOklch = converter("oklch");

// Approximate lightness values for Tailwind shades
const tailwindLightness = {
	0: 1,
	50: 0.9778,
	100: 0.9356,
	200: 0.8811,
	300: 0.8045,
	400: 0.7016,
	500: 0.5878,
	600: 0.4849,
	700: 0.3938,
	800: 0.3172,
	900: 0.2523,
	950: 0.1652,
	1000: 0,
};

export type Palette = {
	shade: number;
	hex: string;
	isClosest: boolean;
};

export function getClosestTailwindShade(l: number): number {
	let closestShade = 500;
	let minDiff = Number.MAX_VALUE;

	for (const [shade, lightness] of Object.entries(tailwindLightness)) {
		const diff = Math.abs(l - lightness);
		if (diff < minDiff) {
			minDiff = diff;
			closestShade = Number(shade);
		}
	}

	return closestShade;
}

export function generatePalette(hex: string): Palette[] {
	const oklch = toOklch(hex);
	if (!oklch) {
		return [];
	}

	const closestShade = getClosestTailwindShade(oklch.l);

	return Object.entries(tailwindLightness)
		.map(([shadeStr, lightness]) => {
			const shade = Number(shadeStr);
			const newColor: Oklch = {
				...oklch,
				l: lightness,
				mode: "oklch",
			};
			return {
				shade,
				hex: formatHex(newColor),
				isClosest: shade === closestShade,
			};
		})
		.sort((a, b) => b.shade - a.shade); // Descending order as requested
}

export function isValidHex(hex: string): boolean {
	return /^#[0-9A-F]{6}$/i.test(hex);
}
