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
import { generatePaletteFromHex } from "../../models/color/generate-palette-from-hex";
import { parseColorToPalette } from "../../models/color/parse-color-to-palette";

type StoredPalette = { name: string; input: string };

const fallbackPalette = generatePaletteFromHex("#f00");

const colorStatesToStoredPalettes = (
	colors: readonly ColorState[],
): readonly StoredPalette[] =>
	colors.map((c) => ({ name: c.name, input: c.input }));

const storedPalettesToColorStates = (
	palettes: readonly StoredPalette[],
): readonly ColorState[] =>
	palettes.map((p) => {
		const palette = parseColorToPalette(p.input);
		return {
			name: p.name,
			input: p.input,
			palette: palette ?? fallbackPalette,
			errorType: palette ? null : "ParseError",
		};
	});

export type ColorsContextValue = Readonly<{
	colors: Accessor<readonly ColorState[]>;
	setColors: Setter<readonly ColorState[]>;
	savePalettes: (colorStates: readonly ColorState[]) => void;
	loadPalettes: () => void;
	getColor: (i: number) => ColorState;
	setColorNameAt: (i: number, name: string) => void;
	setColorValueAt: (i: number, value: string) => void;
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

	const loadPalettes = (): void => {
		if (isServer) {
			return;
		}

		const savedPalettes = localStorage.getItem(storageKeys.palettes);
		if (savedPalettes !== null) {
			const parsed = JSON.parse(savedPalettes) as StoredPalette[];
			if (parsed.length > 0) {
				setColors(storedPalettesToColorStates(parsed));
			}
		}
	};

	const getColor = (i: number): ColorState => colors()[i];

	const setColorAt = (i: number, given: ColorState): void => {
		const newColors = colors().map((v, ii) => (ii === i ? given : v));
		setColors(newColors);
		savePalettes(newColors);
	};

	const setColorNameAt = (i: number, name: string): void => {
		setColorAt(i, { ...getColor(i), name });
	};

	const setColorValueAt = (i: number, value: string): void => {
		const color = getColor(i);
		const palette = parseColorToPalette(value);
		setColorAt(i, {
			...color,
			input: value,
			palette: palette ?? color.palette,
			errorType: palette ? null : "ParseError",
		});
	};

	return (
		<ColorsContext.Provider
			value={{
				colors,
				setColors,
				savePalettes,
				loadPalettes,
				getColor,
				setColorNameAt,
				setColorValueAt,
			}}
		>
			{props.children}
		</ColorsContext.Provider>
	);
}
