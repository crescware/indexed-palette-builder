import { ChevronDown } from "lucide-solid";

import { useColorFormat } from "../contexts/color-format/use-color-format";
import type { ColorFormat } from "../models/color-format-state";

const formatLabels: Record<ColorFormat, string> = {
	hex: "HEX",
	oklch: "OKLCH",
};

export function ColorFormatSelect() {
	const { colorFormat, setColorFormat } = useColorFormat();

	const currentValue = () => {
		const state = colorFormat();
		return state.isLoading ? "hex" : state.value;
	};

	const handleChange = (e: Event) => {
		const target = e.target as HTMLSelectElement;
		setColorFormat(target.value as ColorFormat);
	};

	return (
		<div class="relative flex items-center">
			<select
				value={currentValue()}
				disabled={colorFormat().isLoading}
				onChange={handleChange}
				class="appearance-none px-3 py-1.5 pr-7 text-sm rounded-lg bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 active:bg-gray-300 dark:active:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50"
			>
				{Object.entries(formatLabels).map(([value, label]) => (
					<option value={value}>{label}</option>
				))}
			</select>
			<ChevronDown
				size={14}
				class="absolute right-2 pointer-events-none text-gray-500 dark:text-gray-400"
			/>
		</div>
	);
}
