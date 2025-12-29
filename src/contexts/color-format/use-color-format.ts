import { useContext } from "solid-js";

import {
	ColorFormatContext,
	type ColorFormatContextValue,
} from "./color-format-context";

export function useColorFormat(): ColorFormatContextValue {
	const context = useContext(ColorFormatContext);
	if (!context) {
		throw new Error("useColorFormat must be used within a ColorFormatProvider");
	}
	return context;
}
