import { type Oklch, parse } from "culori";

import { generatePalette, type PaletteStep } from "./generate-palette";

export function generatePaletteFromOklchString(
	oklchString: string,
): readonly PaletteStep[] {
	const oklchColor = parse(oklchString);
	if (!oklchColor || oklchColor.mode !== "oklch") {
		throw new Error("Invalid OKLCH color string");
	}

	return generatePalette(oklchColor as Oklch);
}
