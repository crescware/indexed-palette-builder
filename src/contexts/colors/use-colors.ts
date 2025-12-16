import { useContext } from "solid-js";

import { ColorsContext, type ColorsContextValue } from "./colors-context";

export function useColors(): ColorsContextValue {
	const context = useContext(ColorsContext);
	if (!context) {
		throw new Error("useColors must be used within a ColorsProvider");
	}
	return context;
}
