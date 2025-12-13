import {
	type Accessor,
	createContext,
	createSignal,
	type ParentProps,
} from "solid-js";
import { isServer } from "solid-js/web";
import type { ColorState } from "../../models/color/color-state";
import { createRandomColorState } from "../../models/color/create-random-color-state/create-random-color-state";
import { extractHue } from "../../models/color/create-random-color-state/extract-hue";
import { generatePaletteFromHex } from "../../models/color/generate-palette-from-hex";
import { getColorName } from "../../models/color/get-color-name";
import { parseColorToPalette } from "../../models/color/parse-color-to-palette";
import { storageKeys } from "../../models/storage/storage";

type StoredPalette = { name: string; input: string };

export type ColorsContextValue = Readonly<{
	colors: Accessor<readonly ColorState[]>;
	loadPalettes: () => void;
	resetColors: () => void;
	addColor: () => void;
	deleteColor: (index: number) => void;
	reorderColors: (fromIndex: number, toIndex: number) => void;
	getColor: (i: number) => ColorState;
	setColorNameAt: (i: number, name: string) => void;
	setColorValueAt: (i: number, value: string) => void;
}>;

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

	const resetColors = (): void => {
		setColors([createRandomColorState()]);
	};

	const addColor = (): void => {
		const currentColors = colors();
		const existingNames = currentColors.map((c) => c.name);
		const lastColor = currentColors[currentColors.length - 1];
		const lastHue = lastColor ? extractHue(lastColor.input) : null;

		const newColors = [
			...currentColors,
			createRandomColorState(existingNames, lastHue),
		];
		setColors(newColors);
		savePalettes(newColors);
	};

	const deleteColor = (index: number): void => {
		if (colors().length === 1) {
			throw new Error("Cannot delete the last palette");
		}
		const name = getColorName(getColor(index));
		if (confirm(`Are you sure you want to delete "${name}"?`)) {
			const newColors = colors().filter((_, i) => i !== index);
			setColors(newColors);
			savePalettes(newColors);
		}
	};

	const reorderColors = (fromIndex: number, toIndex: number): void => {
		const newColors = [...colors()];
		const [removed] = newColors.splice(fromIndex, 1);
		newColors.splice(toIndex, 0, removed);
		setColors(newColors);
		savePalettes(newColors);
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
				loadPalettes,
				resetColors,
				addColor,
				deleteColor,
				reorderColors,
				getColor,
				setColorNameAt,
				setColorValueAt,
			}}
		>
			{props.children}
		</ColorsContext.Provider>
	);
}
