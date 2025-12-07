import { Settings } from "lucide-solid";
import type { ComponentProps } from "solid-js";

import { SettingsPopup } from "./settings-popup";

type Props = Readonly<{
	settingsContainerRef: (el: HTMLDivElement) => void;
	isSettingsOpen: ComponentProps<typeof SettingsPopup>["isOpen"];
	setIsSettingsOpen: ComponentProps<typeof SettingsPopup>["setIsOpen"];
	onClickSettingsButton: () => void;
}> &
	Pick<
		ComponentProps<typeof SettingsPopup>,
		"theme" | "applyTheme" | "showEdgeShades" | "setShowEdgeShades"
	>;

export function Header(props: Props) {
	return (
		<header class="flex items-center justify-between py-6 px-4">
			<h1 class="max-6-xs text-2xl text-gray-800 dark:text-gray-200 font-thin uppercase">
				Indexed Palette Builder
			</h1>

			<div ref={props.settingsContainerRef}>
				<button
					type="button"
					onClick={props.onClickSettingsButton}
					class="p-2 text-gray-600 dark:text-gray-400 hover:text-sky-700 dark:hover:text-sky-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
					aria-label="Settings"
				>
					<Settings size={20} />
				</button>

				<SettingsPopup
					isOpen={props.isSettingsOpen}
					setIsOpen={props.setIsSettingsOpen}
					theme={props.theme}
					applyTheme={props.applyTheme}
					showEdgeShades={props.showEdgeShades}
					setShowEdgeShades={props.setShowEdgeShades}
				/>
			</div>
		</header>
	);
}
