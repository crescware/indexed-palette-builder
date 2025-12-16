import { createMemo } from "solid-js";

import { useColors } from "../contexts/colors/use-colors";
import { getColorName } from "../models/color/get-color-name";

export function CssExport() {
	const { colors } = useColors();

	const cssOutput = createMemo(() => {
		return colors()
			.map((c) => {
				const colorName = getColorName(c).replace("#", "");
				return c.palette
					.filter((item) => item.shade !== 0 && item.shade !== 1000)
					.map((item) => `--color-${colorName}-${item.shade}: ${item.hex};`)
					.join("\n");
			})
			.join("\n\n");
	});

	const copyToClipboard = () => {
		navigator.clipboard.writeText(cssOutput());
	};

	return (
		<div class="flex flex-col min-h-0 gap-2">
			<div class="flex justify-between items-center">
				<label
					for="css-output"
					class="block text-xs font-medium text-gray-700 dark:text-gray-300"
				>
					CSS Variables
				</label>
				<button
					type="button"
					onClick={copyToClipboard}
					class="px-2 py-1 text-xs bg-sky-600 dark:bg-sky-700 text-white rounded hover:bg-sky-700 dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
				>
					Copy CSS
				</button>
			</div>
			<textarea
				id="css-output"
				readonly
				textContent={cssOutput()}
				class="w-full flex-1 min-h-0 p-3 font-mono text-xs border border-gray-300 dark:border-gray-700 rounded-md focus:ring-sky-500 focus:border-sky-500 shadow-sm resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
			/>
		</div>
	);
}
