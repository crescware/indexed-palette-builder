import { X } from "lucide-solid";
import type { Accessor, Setter } from "solid-js";
import { Show } from "solid-js";

type Props = Readonly<{
	isOpen: Accessor<boolean>;
	setIsOpen: Setter<boolean>;
	theme: Accessor<"light" | "dark" | "system">;
	applyTheme: (theme: "light" | "dark" | "system") => void;
}>;

export function SettingsPopup(props: Props) {
	return (
		<Show when={props.isOpen()}>
			<div class="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-64 z-50">
				<div class="flex justify-between items-center mb-3">
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
					<div>
						<div class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Color Theme
						</div>
						<div class="space-y-2">
							<label class="flex items-center cursor-pointer">
								<input
									type="radio"
									name="theme"
									value="light"
									checked={props.theme() === "light"}
									onInput={() => props.applyTheme("light")}
									class="w-4 h-4 text-sky-600 border-gray-300 dark:border-gray-600 focus:ring-sky-500"
								/>
								<span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
									Light
								</span>
							</label>
							<label class="flex items-center cursor-pointer">
								<input
									type="radio"
									name="theme"
									value="dark"
									checked={props.theme() === "dark"}
									onInput={() => props.applyTheme("dark")}
									class="w-4 h-4 text-sky-600 border-gray-300 dark:border-gray-600 focus:ring-sky-500"
								/>
								<span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
									Dark
								</span>
							</label>
							<label class="flex items-center cursor-pointer">
								<input
									type="radio"
									name="theme"
									value="system"
									checked={props.theme() === "system"}
									onInput={() => props.applyTheme("system")}
									class="w-4 h-4 text-sky-600 border-gray-300 dark:border-gray-600 focus:ring-sky-500"
								/>
								<span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
									System
								</span>
							</label>
						</div>
					</div>
				</div>
			</div>
		</Show>
	);
}
