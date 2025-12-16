import { isValidHex } from "../../utils/is-valid-hex";
import type { PaletteStep } from "./generate-palette";
import { generatePaletteFromHex } from "./generate-palette-from-hex";
import { generatePaletteFromOklchString } from "./generate-palette-from-oklch-string";

export function parseColorToPalette(
	input: string,
): readonly PaletteStep[] | null {
	if (isValidHex(input)) {
		return generatePaletteFromHex(input);
	}

	if (
		(input.length === 3 || input.length === 6) &&
		/^[0-9a-fA-F]+$/.test(input)
	) {
		return generatePaletteFromHex(`#${input}`);
	}

	if (input.startsWith("oklch(")) {
		try {
			return generatePaletteFromOklchString(input);
		} catch {
			return null;
		}
	}

	return null;
}
