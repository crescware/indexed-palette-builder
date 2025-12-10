import { X } from "lucide-solid";
import type { Accessor, Setter } from "solid-js";
import { Show } from "solid-js";

import type { ShowEdgeShadesState } from "../models/show-edge-shades-state";
import type { Theme } from "../models/theme";

type Props = Readonly<{
	isOpen: Accessor<boolean>;
	setIsOpen: Setter<boolean>;
	theme: Accessor<Theme>;
	applyTheme: (theme: Theme) => void;
	showEdgeShades: Accessor<ShowEdgeShadesState>;
	onChangeShowEdgeShades: (value: boolean) => void;
	onResetSettings: () => void;
}>;

export function SettingsPopup(props: Props) {
	const isShowEdgeShadesChecked = () => {
		const state = props.showEdgeShades();
		return !state.isLoading && state.value;
	};

	return (
		<Show when={props.isOpen()}>
			<div class="absolute top-[calc(100%+0.5rem)] right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-64 z-50 flex flex-col gap-3">
				<div class="flex justify-between items-center">
					<h2 class="text-base font-semibold text-gray-800 dark:text-gray-200">
						Settings
					</h2>
					<button
						type="button"
						onClick={() => props.setIsOpen(false)}
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
									checked={props.theme() === "light"}
									onInput={() => props.applyTheme("light")}
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
									checked={props.theme() === "dark"}
									onInput={() => props.applyTheme("dark")}
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
									checked={props.theme() === "system"}
									onInput={() => props.applyTheme("system")}
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
								disabled={props.showEdgeShades().isLoading}
								onInput={(e) =>
									props.onChangeShowEdgeShades(e.currentTarget.checked)
								}
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
					onClick={props.onResetSettings}
					class="w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-950 active:bg-red-100 dark:active:bg-red-900 rounded-md transition-colors"
				>
					Reset to defaults
				</button>
			</div>
		</Show>
	);
}
