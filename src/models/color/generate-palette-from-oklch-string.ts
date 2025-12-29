import { generatePalette, type PaletteStep } from "./generate-palette";
import { parseOklchWithPrecision } from "./parse-oklch-with-precision";

export function generatePaletteFromOklchString(
	oklchString: string,
): readonly PaletteStep[] {
	const oklchColor = parseOklchWithPrecision(oklchString);
	if (!oklchColor) {
		throw new Error("Invalid OKLCH color string");
	}

	return generatePalette(oklchColor);
}
