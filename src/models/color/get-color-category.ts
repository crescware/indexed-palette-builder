import type { ColorCategory } from "./color-names";

export function getColorCategory(hue: number): ColorCategory {
	const normalizedHue = ((hue % 360) + 360) % 360;

	if (0 <= normalizedHue && normalizedHue < 35) {
		return "red";
	}
	if (35 <= normalizedHue && normalizedHue < 70) {
		return "orange";
	}
	if (70 <= normalizedHue && normalizedHue < 100) {
		return "yellow";
	}
	if (100 <= normalizedHue && normalizedHue < 160) {
		return "green";
	}
	if (160 <= normalizedHue && normalizedHue < 220) {
		return "cyan";
	}
	if (220 <= normalizedHue && normalizedHue < 280) {
		return "blue";
	}
	if (280 <= normalizedHue && normalizedHue < 330) {
		return "purple";
	}
	if (330 <= normalizedHue && normalizedHue < 360) {
		return "pink";
	}

	throw new Error(`Invalid hue value: ${hue} (normalized: ${normalizedHue})`);
}
