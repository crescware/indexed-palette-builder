import { useContext } from "solid-js";
import { SettingsContext, type SettingsContextValue } from "./settings-context";

export function useSettings(): SettingsContextValue {
	const context = useContext(SettingsContext);
	if (!context) {
		throw new Error("useSettings must be used within a SettingsProvider");
	}
	return context;
}
