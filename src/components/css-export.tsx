import { Copy } from "lucide-solid";
import { createMemo, createSignal } from "solid-js";

import { useColors } from "../contexts/colors/use-colors";
import { getColorName } from "../models/color/get-color-name";

export function CssExport() {
	const { colors } = useColors();
	const [showCopied, setShowCopied] = createSignal(false);

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
		setShowCopied(true);
		setTimeout(() => setShowCopied(false), 1500);
	};

	return (
		<div class="flex flex-col min-h-0 gap-3 lg:pl-6 lg:border-l border-gray-200 dark:border-gray-800">
			<div class="flex justify-between items-center">
				<label
					for="css-output"
					class="block text-xs font-medium text-gray-700 dark:text-gray-300"
				>
					CSS Variables
				</label>
				<div class="relative">
					<button
						type="button"
						onClick={copyToClipboard}
						class="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
						aria-label="Copy CSS"
					>
						<Copy size={16} />
					</button>
					<span
						role="status"
						aria-live="polite"
						class="absolute right-0 top-full mt-1 px-2 py-1 text-xs text-white bg-gray-800 dark:bg-gray-700 rounded whitespace-nowrap transition-opacity duration-300"
						style={{ opacity: showCopied() ? 1 : 0, "pointer-events": "none" }}
					>
						Copied
					</span>
				</div>
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
