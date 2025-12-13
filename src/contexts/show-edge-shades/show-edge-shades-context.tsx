import {
	type Accessor,
	createContext,
	createSignal,
	onMount,
	type ParentProps,
} from "solid-js";
import { isServer } from "solid-js/web";

import { storageKeys } from "../../constants/storage";
import type { ShowEdgeShadesState } from "../../models/show-edge-shades-state";

const defaultShowEdgeShades = {
	isLoading: false,
	value: false,
} as const satisfies ShowEdgeShadesState;

export type ShowEdgeShadesContextValue = Readonly<{
	showEdgeShades: Accessor<ShowEdgeShadesState>;
	setShowEdgeShades: (value: boolean) => void;
	resetShowEdgeShades: () => void;
}>;

export const ShowEdgeShadesContext =
	createContext<ShowEdgeShadesContextValue>();

export function ShowEdgeShadesProvider(props: ParentProps) {
	const [showEdgeShades, setShowEdgeShadesSignal] =
		createSignal<ShowEdgeShadesState>({ isLoading: true });

	const setShowEdgeShades = (value: boolean): void => {
		setShowEdgeShadesSignal({ isLoading: false, value });
		if (!isServer) {
			localStorage.setItem(storageKeys.showEdgeShades, JSON.stringify(value));
		}
	};

	const resetShowEdgeShades = () => {
		setShowEdgeShadesSignal(defaultShowEdgeShades);
	};

	onMount(() => {
		const savedShowEdgeShades = localStorage.getItem(
			storageKeys.showEdgeShades,
		);

		setShowEdgeShadesSignal({
			isLoading: false,
			value:
				savedShowEdgeShades !== null
					? JSON.parse(savedShowEdgeShades)
					: defaultShowEdgeShades.value,
		});
	});

	return (
		<ShowEdgeShadesContext.Provider
			value={{ showEdgeShades, setShowEdgeShades, resetShowEdgeShades }}
		>
			{props.children}
		</ShowEdgeShadesContext.Provider>
	);
}
