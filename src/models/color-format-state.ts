export type ColorFormat = "hex" | "oklch";

export type ColorFormatState =
	| { isLoading: true }
	| { isLoading: false; value: ColorFormat };
