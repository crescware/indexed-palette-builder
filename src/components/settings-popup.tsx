import { X } from "lucide-solid";
import { Show } from "solid-js";
import { isServer } from "solid-js/web";

import { useColorFormat } from "../contexts/color-format/use-color-format";
import { useColors } from "../contexts/colors/use-colors";
import { useEditMode } from "../contexts/edit-mode/use-edit-mode";
import { useSettings } from "../contexts/settings/use-settings";
import { useShowEdgeShades } from "../contexts/show-edge-shades/use-show-edge-shades";
import { useTheme } from "../contexts/theme/use-theme";
import { clearStorage } from "../models/storage/clear-storage";

export function SettingsPopup() {
	const { theme, applyTheme, resetTheme } = useTheme();
	const { showEdgeShades, setShowEdgeShades, resetShowEdgeShades } =
		useShowEdgeShades();
	const { resetColorFormat } = useColorFormat();
	const { isSettingsOpen, closeSettings } = useSettings();
	const { resetColors } = useColors();
	const { exitEditMode } = useEditMode();

	const isShowEdgeShadesChecked = () => {
		const state = showEdgeShades();
		return !state.isLoading && state.value;
	};

	const handleResetSettings = (): void => {
		if (isServer) {
			return;
		}

		if (
			!confirm(
				[
					"Are you sure you want to reset all data?",
					"This will delete all palettes and settings.",
					"This action cannot be undone.",
				].join(" "),
			)
		) {
			return;
		}

		clearStorage();
		resetTheme();
		resetShowEdgeShades();
		resetColorFormat();
		resetColors();
		closeSettings();
		exitEditMode();
	};

	return (
		<Show when={isSettingsOpen()}>
			<div class="absolute top-[calc(100%+0.5rem)] right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-64 z-50 flex flex-col gap-3">
				<div class="flex justify-between items-center">
					<h2 class="text-base font-semibold text-gray-800 dark:text-gray-200">
						Settings
					</h2>
					<button
						type="button"
						onClick={closeSettings}
						class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
						aria-label="Close settings"
					>
						<X size={20} />
					</button>
				</div>
				<div class="space-y-4">
					<div class="flex flex-col gap-2">
						<div class="block text-sm font-medium text-gray-700 dark:text-gray-300">
							Color Theme
						</div>
						<div class="space-y-2">
							<label class="flex items-center gap-2 cursor-pointer">
								<input
									type="radio"
									name="theme"
									value="light"
									checked={theme() === "light"}
									onInput={() => applyTheme("light")}
									class="w-4 h-4 text-sky-600 border-gray-300 dark:border-gray-600 focus:ring-sky-500"
								/>
								<span class="text-sm text-gray-700 dark:text-gray-300">
									Light
								</span>
							</label>
							<label class="flex items-center gap-2 cursor-pointer">
								<input
									type="radio"
									name="theme"
									value="dark"
									checked={theme() === "dark"}
									onInput={() => applyTheme("dark")}
									class="w-4 h-4 text-sky-600 border-gray-300 dark:border-gray-600 focus:ring-sky-500"
								/>
								<span class="text-sm text-gray-700 dark:text-gray-300">
									Dark
								</span>
							</label>
							<label class="flex items-center gap-2 cursor-pointer">
								<input
									type="radio"
									name="theme"
									value="system"
									checked={theme() === "system"}
									onInput={() => applyTheme("system")}
									class="w-4 h-4 text-sky-600 border-gray-300 dark:border-gray-600 focus:ring-sky-500"
								/>
								<span class="text-sm text-gray-700 dark:text-gray-300">
									System
								</span>
							</label>
						</div>
					</div>
					<div>
						<label class="flex items-center gap-2 cursor-pointer">
							<input
								type="checkbox"
								checked={isShowEdgeShadesChecked()}
								disabled={showEdgeShades().isLoading}
								onInput={(e) => setShowEdgeShades(e.currentTarget.checked)}
								class="w-4 h-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 disabled:opacity-50"
							/>
							<span class="text-sm text-gray-700 dark:text-gray-300">
								Show edge shades (0/1000)
							</span>
						</label>
					</div>
				</div>
				<button
					type="button"
					onClick={handleResetSettings}
					class="w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-950 active:bg-red-100 dark:active:bg-red-900 rounded-md transition-colors"
				>
					Reset all data
				</button>
			</div>
		</Show>
	);
}
