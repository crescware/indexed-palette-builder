import type { PaletteStep } from "./generate-palette";

export type ColorState = {
	name: string;
	input: string;
	palette: readonly PaletteStep[];
};
