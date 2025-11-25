import { converter } from "culori";
import { generatePalette, type PaletteStep } from "./generate-palette";

const toOklch = converter("oklch");

export function generatePaletteFromHex(hexInput: string): PaletteStep[] {
	const oklchColor = toOklch(hexInput);
	if (!oklchColor) {
		throw new Error("Invalid hex color");
	}
	return generatePalette(oklchColor);
}
