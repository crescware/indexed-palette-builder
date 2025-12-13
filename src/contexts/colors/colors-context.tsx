import {
	type Accessor,
	createContext,
	createSignal,
	type ParentProps,
	type Setter,
} from "solid-js";
import { isServer } from "solid-js/web";

import { storageKeys } from "../../constants/storage";
import type { ColorState } from "../../models/color/color-state";
import { createRandomColorState } from "../../models/color/create-random-color-state/create-random-color-state";

type StoredPalette = { name: string; input: string };

const colorStatesToStoredPalettes = (
	colors: readonly ColorState[],
): readonly StoredPalette[] =>
	colors.map((c) => ({ name: c.name, input: c.input }));

export type ColorsContextValue = Readonly<{
	colors: Accessor<readonly ColorState[]>;
	setColors: Setter<readonly ColorState[]>;
	savePalettes: (colorStates: readonly ColorState[]) => void;
	getColor: (i: number) => ColorState;
	setColorAt: (i: number, given: ColorState) => void;
}>;

export const ColorsContext = createContext<ColorsContextValue>();

export function ColorsProvider(props: ParentProps) {
	const [colors, setColors] = createSignal<readonly ColorState[]>([
		createRandomColorState(),
	]);

	const savePalettes = (colorStates: readonly ColorState[]): void => {
		if (isServer) {
			return;
		}

		localStorage.setItem(
			storageKeys.palettes,
			JSON.stringify(colorStatesToStoredPalettes(colorStates)),
		);
	};

	const getColor = (i: number): ColorState => colors()[i];

	const setColorAt = (i: number, given: ColorState): void => {
		const newColors = colors().map((v, ii) => (ii === i ? given : v));
		setColors(newColors);
		savePalettes(newColors);
	};

	return (
		<ColorsContext.Provider
			value={{ colors, setColors, savePalettes, getColor, setColorAt }}
		>
			{props.children}
		</ColorsContext.Provider>
	);
}
