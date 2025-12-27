import {
	type Accessor,
	createContext,
	createSignal,
	onMount,
	type ParentProps,
} from "solid-js";
import { isServer } from "solid-js/web";
import type {
	ColorFormat,
	ColorFormatState,
} from "../../models/color-format-state";
import { storageKeys } from "../../models/storage/storage";

const defaultColorFormat: ColorFormat = "hex";

export type ColorFormatContextValue = Readonly<{
	colorFormat: Accessor<ColorFormatState>;
	setColorFormat: (value: ColorFormat) => void;
	resetColorFormat: () => void;
}>;

export const ColorFormatContext = createContext<ColorFormatContextValue>();

export function ColorFormatProvider(props: ParentProps) {
	const [colorFormat, setColorFormatSignal] = createSignal<ColorFormatState>({
		isLoading: true,
	});

	const setColorFormat = (value: ColorFormat): void => {
		setColorFormatSignal({ isLoading: false, value });
		if (!isServer) {
			localStorage.setItem(storageKeys.colorFormat, value);
		}
	};

	const resetColorFormat = (): void => {
		setColorFormatSignal({ isLoading: false, value: defaultColorFormat });
		if (!isServer) {
			localStorage.removeItem(storageKeys.colorFormat);
		}
	};

	onMount(() => {
		const saved = localStorage.getItem(
			storageKeys.colorFormat,
		) as ColorFormat | null;

		setColorFormatSignal({
			isLoading: false,
			value: saved === "hex" || saved === "oklch" ? saved : defaultColorFormat,
		});
	});

	return (
		<ColorFormatContext.Provider
			value={{
				colorFormat,
				setColorFormat,
				resetColorFormat,
			}}
		>
			{props.children}
		</ColorFormatContext.Provider>
	);
}
