import { isServer } from "solid-js/web";

import { CssExport } from "../components/css-export";
import { Header } from "../components/header";
import { Loading } from "../components/loading";
import { PaletteBuilder } from "../components/palette-builder";
import { useColors } from "../contexts/colors/use-colors";
import { useEditMode } from "../contexts/edit-mode/use-edit-mode";
import { useSettings } from "../contexts/settings/use-settings";
import { useShowEdgeShades } from "../contexts/show-edge-shades/use-show-edge-shades";
import { useTheme } from "../contexts/theme/use-theme";
import { clearStorage } from "../models/storage/clear-storage";

export default function Home() {
	const { resetColors } = useColors();
	const { resetTheme } = useTheme();
	const { showEdgeShades, resetShowEdgeShades } = useShowEdgeShades();
	const { closeSettings } = useSettings();
	const { exitEditMode } = useEditMode();

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
		resetColors();
		closeSettings();
		exitEditMode();
	};

	const isLoading = () => showEdgeShades().isLoading;

	return (
		<div class="flex justify-center h-screen bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300">
			<Loading enabled={isLoading()}>
				<main class="text-center h-full flex flex-col max-w-7xl w-full animate-fade-in">
					<Header onResetSettings={handleResetSettings} />

					<div class="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-4 w-full flex-1 min-h-0 px-4 pb-4">
						<PaletteBuilder />
						<CssExport />
					</div>
				</main>
			</Loading>
		</div>
	);
}
