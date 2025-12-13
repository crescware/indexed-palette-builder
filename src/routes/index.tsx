import { Loader2, Plus } from "lucide-solid";
import { createSignal, Index, onCleanup, onMount, Show } from "solid-js";
import { isServer } from "solid-js/web";

import { CssExport } from "../components/css-export";
import { Header } from "../components/header";
import { PaletteRow } from "../components/palette-row";
import { storageKeys, storagePrefix } from "../constants/storage";
import { useColors } from "../contexts/colors/use-colors";
import { createRandomColorState } from "../models/color/create-random-color-state/create-random-color-state";
import { extractHue } from "../models/color/create-random-color-state/extract-hue";
import { getColorName } from "../models/color/get-color-name";
import type { ShowEdgeShadesState } from "../models/show-edge-shades-state";
import type { Theme } from "../models/theme";

const defaultTheme = "system" as const satisfies Theme;

const defaultShowEdgeShades = {
	isLoading: false,
	value: false,
} as const satisfies ShowEdgeShadesState;

export default function Home() {
	const { colors, setColors, savePalettes, loadPalettes, getColor } =
		useColors();

	const [isSettingsOpen, setIsSettingsOpen] = createSignal(false);
	const [theme, setTheme] = createSignal<Theme>(defaultTheme);

	const [showEdgeShades, setShowEdgeShades] = createSignal<ShowEdgeShadesState>(
		{ isLoading: true },
	);

	const [isEditMode, setIsEditMode] = createSignal(false);
	const [draggedIndex, setDraggedIndex] = createSignal<number | null>(null);
	const [dropTargetIndex, setDropTargetIndex] = createSignal<number | null>(
		null,
	);
	let settingsContainerRef: HTMLDivElement | undefined;
	let paletteContainerRef: HTMLDivElement | undefined;

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

		applyTheme(defaultTheme);
		setShowEdgeShades(defaultShowEdgeShades);
		setColors([createRandomColorState()]);
		setIsSettingsOpen(false);
		setIsEditMode(false);
	};

	const applyTheme = (newTheme: Theme) => {
		if (isServer) {
			return;
		}

		const root = document.documentElement;

		const preferredTheme =
			newTheme === "system"
				? window.matchMedia("(prefers-color-scheme: dark)").matches
					? "dark"
					: "light"
				: newTheme;

		if (preferredTheme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}

		setTheme(newTheme);
		localStorage.setItem(storageKeys.theme, newTheme);
	};

	onMount(() => {
		// Load settings from localStorage
		const savedTheme = localStorage.getItem(storageKeys.theme) as Theme | null;
		if (
			savedTheme === "light" ||
			savedTheme === "dark" ||
			savedTheme === "system"
		) {
			applyTheme(savedTheme);
		} else {
			applyTheme(theme());
		}

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

	const handleAddPalette = () => {
		const currentColors = colors();
		const existingNames = currentColors.map((c) => c.name);
		const lastColor = currentColors[currentColors.length - 1];
		const lastHue = lastColor ? extractHue(lastColor.input) : null;

		const newColors = [
			...currentColors,
			createRandomColorState(existingNames, lastHue),
		];
		setColors(newColors);
		savePalettes(newColors);

		requestAnimationFrame(() => {
			if (paletteContainerRef) {
				const paletteItems = paletteContainerRef.querySelectorAll(
					":scope > div:not(:last-child)",
				);
				const lastPalette = paletteItems[paletteItems.length - 1];
				if (lastPalette) {
					const gap = 12; // gap-3 = 0.75rem = 12px
					paletteContainerRef.scrollBy({
						top: lastPalette.getBoundingClientRect().height + gap,
						behavior: "instant",
					});
				}
			}
		});
	};

	const handleDeletePalette = (index: number) => {
		if (colors().length === 1) {
			throw new Error("Cannot delete the last palette");
		}
		const name = getColorName(getColor(index));
		if (confirm(`Are you sure you want to delete "${name}"?`)) {
			const newColors = colors().filter((_, i) => i !== index);
			setColors(newColors);
			savePalettes(newColors);
		}
	};

	const handleDragStart = (index: number) => {
		setDraggedIndex(index);
	};

	const handleDragEnd = () => {
		setDraggedIndex(null);
		setDropTargetIndex(null);
	};

	const handleDragOver = (e: DragEvent, index: number) => {
		e.preventDefault();
		const dragged = draggedIndex();
		if (dragged === null || dragged === index) {
			setDropTargetIndex(null);
			return;
		}
		setDropTargetIndex(index);
	};

	const handleDrop = (e: DragEvent, targetIndex: number) => {
		e.preventDefault();
		const dragged = draggedIndex();
		if (dragged === null || dragged === targetIndex) {
			return;
		}

		const newColors = [...colors()];
		const [removed] = newColors.splice(dragged, 1);
		newColors.splice(targetIndex, 0, removed);
		setColors(newColors);
		savePalettes(newColors);

		setDraggedIndex(null);
		setDropTargetIndex(null);
	};

	const isLoading = () => showEdgeShades().isLoading;

	return (
		<div class="flex justify-center h-screen bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300">
			<Show
				when={!isLoading()}
				fallback={
					<div class="flex items-center justify-center h-full">
						<Loader2 class="animate-spin text-gray-400" size={32} />
					</div>
				}
			>
				<main class="text-center h-full flex flex-col max-w-7xl w-full animate-fade-in">
					<Header
						settingsContainerRef={(el) => {
							settingsContainerRef = el;
						}}
						isSettingsOpen={isSettingsOpen}
						setIsSettingsOpen={setIsSettingsOpen}
						onClickSettingsButton={handleOnClickSettingsButton}
						theme={theme}
						applyTheme={applyTheme}
						showEdgeShades={showEdgeShades}
						onChangeShowEdgeShades={handleChangeShowEdgeShades}
						onResetSettings={handleResetSettings}
						isEditMode={isEditMode}
						onClickEditButton={() => setIsEditMode(!isEditMode())}
					/>

					<div class="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-4 w-full flex-1 min-h-0 px-4 pb-4">
						{/* Left Column: Palette Builder */}
						<div
							ref={(el) => {
								paletteContainerRef = el;
							}}
							class="flex flex-col gap-3 min-h-0 overflow-y-auto px-1"
						>
							<Index each={colors()}>
								{(_, index) => (
									<PaletteRow
										index={index}
										draggedIndex={draggedIndex}
										dropTargetIndex={dropTargetIndex}
										isEditMode={isEditMode}
										showEdgeShades={showEdgeShades}
										colorsLength={() => colors().length}
										onDragStart={handleDragStart}
										onDragEnd={handleDragEnd}
										onDragOver={handleDragOver}
										onDrop={handleDrop}
										onDelete={handleDeletePalette}
									/>
								)}
							</Index>
							<button
								type="button"
								onClick={handleAddPalette}
								class="w-full flex flex-col items-center gap-1 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 hover:text-gray-600 dark:hover:border-gray-500 dark:hover:text-gray-300 active:border-gray-500 active:text-gray-700 dark:active:border-gray-400 dark:active:text-gray-200 transition-colors"
							>
								<Plus size={20} />
								<span class="text-sm">Add Palette</span>
							</button>
						</div>

						<CssExport />
					</div>
				</main>
			</Show>
		</div>
	);
}
