import { useContext } from "solid-js";

import { ThemeContext, type ThemeContextValue } from "./theme-context";

export function useTheme(): ThemeContextValue {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
