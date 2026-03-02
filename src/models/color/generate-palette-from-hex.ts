import { generatePalette, type PaletteStep } from "./generate-palette";
import { toOklchBig } from "./to-oklch-big";

export function generatePaletteFromHex(
	hexInput: string,
): readonly PaletteStep[] {
	const oklchColor = toOklchBig(hexInput);
	if (!oklchColor) {
		throw new Error("Invalid hex color");
	}

	return generatePalette(oklchColor);
}
