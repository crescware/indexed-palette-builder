import {
	type Accessor,
	createContext,
	createSignal,
	type ParentProps,
	type Setter,
} from "solid-js";

import type { ColorState } from "../../models/color/color-state";
import { createRandomColorState } from "../../models/color/create-random-color-state/create-random-color-state";

export type ColorsContextValue = Readonly<{
	colors: Accessor<readonly ColorState[]>;
	setColors: Setter<readonly ColorState[]>;
}>;

export const ColorsContext = createContext<ColorsContextValue>();

export function ColorsProvider(props: ParentProps) {
	const [colors, setColors] = createSignal<readonly ColorState[]>([
		createRandomColorState(),
	]);

	return (
		<ColorsContext.Provider value={{ colors, setColors }}>
			{props.children}
		</ColorsContext.Provider>
	);
}
