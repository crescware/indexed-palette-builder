import { useContext } from "solid-js";
import {
	EditModeContext,
	type EditModeContextValue,
} from "./edit-mode-context";

export function useEditMode(): EditModeContextValue {
	const context = useContext(EditModeContext);
	if (!context) {
		throw new Error("useEditMode must be used within an EditModeProvider");
	}
	return context;
}
