import { createSignal, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

import { CssExport } from "../components/css-export";
import { Header } from "../components/header";
import { Loading } from "../components/loading";
import { PaletteBuilder } from "../components/palette-builder";
import { storageKeys, storagePrefix } from "../constants/storage";
import { useColors } from "../contexts/colors/use-colors";
import { useTheme } from "../contexts/theme/use-theme";
import { createRandomColorState } from "../models/color/create-random-color-state/create-random-color-state";
import type { ShowEdgeShadesState } from "../models/show-edge-shades-state";

const defaultShowEdgeShades = {
	isLoading: false,
	value: false,
} as const satisfies ShowEdgeShadesState;

export default function Home() {
	const { setColors, loadPalettes } = useColors();
	const { resetTheme } = useTheme();

	const [isSettingsOpen, setIsSettingsOpen] = createSignal(false);

	const [showEdgeShades, setShowEdgeShades] = createSignal<ShowEdgeShadesState>(
		{ isLoading: true },
	);

	const [isEditMode, setIsEditMode] = createSignal(false);
	let settingsContainerRef: HTMLDivElement | undefined;

	const handleChangeShowEdgeShades = (value: boolean): void => {
		setShowEdgeShades({ isLoading: false, value });
		if (!isServer) {
			localStorage.setItem(storageKeys.showEdgeShades, JSON.stringify(value));
		}
	};

	const handleResetSettings = (): void => {
		if (isServer) {
			return;
		}

		if (
			!confirm(
				"Are you sure you want to reset all data? This will delete all palettes and settings. This action cannot be undone.",
			)
		) {
			return;
		}

		const keysToRemove: string[] = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key?.startsWith(storagePrefix)) {
				keysToRemove.push(key);
			}
		}
		for (const key of keysToRemove) {
			localStorage.removeItem(key);
		}

		resetTheme();
		setShowEdgeShades(defaultShowEdgeShades);
		setColors([createRandomColorState()]);
		setIsSettingsOpen(false);
		setIsEditMode(false);
	};

	onMount(() => {
		const savedShowEdgeShades = localStorage.getItem(
			storageKeys.showEdgeShades,
		);

		setShowEdgeShades({
			isLoading: false,
			value:
				savedShowEdgeShades !== null
					? JSON.parse(savedShowEdgeShades)
					: defaultShowEdgeShades.value,
		});

		loadPalettes();

		const handleClickOutside = (event: MouseEvent) => {
			if (
				isSettingsOpen() &&
				settingsContainerRef &&
				!settingsContainerRef.contains(event.target as Node)
			) {
				setIsSettingsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		onCleanup(() => {
			document.removeEventListener("mousedown", handleClickOutside);
		});
	});

	const handleOnClickSettingsButton = () => {
		setIsSettingsOpen(!isSettingsOpen());
	};

	const isLoading = () => showEdgeShades().isLoading;

	return (
		<div class="flex justify-center h-screen bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300">
			<Loading enabled={isLoading()}>
				<main class="text-center h-full flex flex-col max-w-7xl w-full animate-fade-in">
					<Header
						settingsContainerRef={(el) => {
							settingsContainerRef = el;
						}}
						isSettingsOpen={isSettingsOpen}
						setIsSettingsOpen={setIsSettingsOpen}
						onClickSettingsButton={handleOnClickSettingsButton}
						showEdgeShades={showEdgeShades}
						onChangeShowEdgeShades={handleChangeShowEdgeShades}
						onResetSettings={handleResetSettings}
						isEditMode={isEditMode}
						onClickEditButton={() => setIsEditMode(!isEditMode())}
					/>

					<div class="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-4 w-full flex-1 min-h-0 px-4 pb-4">
						<PaletteBuilder
							isEditMode={isEditMode}
							showEdgeShades={showEdgeShades}
						/>
						<CssExport />
					</div>
				</main>
			</Loading>
		</div>
	);
}
