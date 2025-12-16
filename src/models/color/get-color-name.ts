import type { ColorState } from "./color-state";

export const getColorName = (color: ColorState) =>
	color.name.trim() || color.input;
