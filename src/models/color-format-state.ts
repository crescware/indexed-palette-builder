export type ColorFormat = "hex" | "oklch";

export const defaultColorFormat: ColorFormat = "hex";

export type ColorFormatState =
	| { isLoading: true }
	| { isLoading: false; value: ColorFormat };
