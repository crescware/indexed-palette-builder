import type { PaletteStep } from "./generate-palette";

export type ErrorType = "ParseError";

export type ColorState = {
	name: string;
	input: string;
	palette: readonly PaletteStep[];
	errorType: ErrorType | null;
};
