import { Check, Copy } from "lucide-solid";
import { createMemo, createSignal } from "solid-js";

import { useColors } from "../contexts/colors/use-colors";
import { getColorName } from "../models/color/get-color-name";

export function CssExport() {
	const { colors } = useColors();
	const [showCopied, setShowCopied] = createSignal(false);
	const [isReturning, setIsReturning] = createSignal(false);

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
		setIsReturning(false);
		setShowCopied(true);
		setTimeout(() => {
			setIsReturning(true);
			setShowCopied(false);
		}, 1500);
	};

	return (
		<div class="flex flex-col min-h-0 gap-3 lg:border-l border-gray-200 dark:border-gray-800 pl-2 pr-6">
			<div class="flex justify-between items-center pl-4">
				<label
					for="css-output"
					class="block text-xs font-medium text-gray-700 dark:text-gray-300"
				>
					CSS Variables
				</label>
				<button
					type="button"
					onClick={copyToClipboard}
					class={`p-1.5 relative w-7 h-7 text-gray-500 dark:text-gray-400 rounded transition-colors ${showCopied() ? "" : "hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
					aria-label="Copy CSS"
				>
					<span
						class={`absolute inset-0 flex items-center justify-center ${isReturning() ? "transition-opacity duration-200" : ""}`}
						style={{ opacity: showCopied() ? 0 : 1 }}
					>
						<Copy size={16} />
					</span>
					<span
						class={`absolute inset-0 flex items-center justify-center ${isReturning() ? "transition-opacity duration-200" : ""}`}
						style={{ opacity: showCopied() ? 1 : 0 }}
					>
						<Check size={16} />
					</span>
				</button>
			</div>
			<textarea
				id="css-output"
				readonly
				textContent={cssOutput()}
				class="w-full flex-1 min-h-0 px-4 py-1 font-mono text-xs rounded-md outline-1 outline-transparent focus:outline-blue-500 resize-none bg-[var(--app-bg)] focus:bg-white dark:focus:bg-gray-900 text-gray-500 dark:text-gray-400 focus:text-gray-900 dark:focus:text-gray-100 transition-colors"
			/>
		</div>
	);
}
