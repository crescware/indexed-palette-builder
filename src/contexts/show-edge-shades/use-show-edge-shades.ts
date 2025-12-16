import { useContext } from "solid-js";

import {
	ShowEdgeShadesContext,
	type ShowEdgeShadesContextValue,
} from "./show-edge-shades-context";

export function useShowEdgeShades(): ShowEdgeShadesContextValue {
	const context = useContext(ShowEdgeShadesContext);
	if (!context) {
		throw new Error(
			"useShowEdgeShades must be used within a ShowEdgeShadesProvider",
		);
	}
	return context;
}
