import { Settings } from "lucide-solid";

import { useEditMode } from "../contexts/edit-mode/use-edit-mode";
import { useSettings } from "../contexts/settings/use-settings";
import { Button } from "./button";
import { ColorFormatSelect } from "./color-format-select";
import { SettingsPopup } from "./settings-popup";

export function Header() {
	const { toggleSettings, setSettingsContainerRef } = useSettings();
	const { isEditMode, toggleEditMode } = useEditMode();

	return (
		<header class="flex items-center justify-between p-6">
			<h1 class="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-widest">
				Indexed Palette Builder
			</h1>

			<div
				class="relative flex items-center gap-2"
				ref={setSettingsContainerRef}
			>
				<ColorFormatSelect />
				<Button onClick={toggleEditMode} class="px-3 py-1.5 text-sm min-w-16">
					{isEditMode() ? "Done" : "Edit"}
				</Button>
				<Button onClick={toggleSettings} class="p-2" aria-label="Settings">
					<Settings size={20} />
				</Button>

				<SettingsPopup />
			</div>
		</header>
	);
}
