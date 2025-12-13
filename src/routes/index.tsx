import { GripVertical, Loader2, Plus, Trash2 } from "lucide-solid";
import {
	createMemo,
	createSignal,
	Index,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import { isServer } from "solid-js/web";

import { ColorPalette } from "../components/color-palette";
import { Header } from "../components/header";
import { storageKeys, storagePrefix } from "../constants/storage";
import type { ColorState } from "../models/color/color-state";
import { createRandomColorState } from "../models/color/create-random-color-state/create-random-color-state";
import { extractHue } from "../models/color/create-random-color-state/extract-hue";
import type { PaletteStep } from "../models/color/generate-palette";
import { generatePaletteFromHex } from "../models/color/generate-palette-from-hex";
import { generatePaletteFromOklchString } from "../models/color/generate-palette-from-oklch-string";
import type { ShowEdgeShadesState } from "../models/show-edge-shades-state";
import type { Theme } from "../models/theme";
import { isValidHex } from "../utils/is-valid-hex";

const defaultTheme = "system" as const satisfies Theme;

const defaultShowEdgeShades = {
	isLoading: false,
	value: false,
} as const satisfies ShowEdgeShadesState;

type StoredPalette = { name: string; input: string };

function generatePalette(input: string): readonly PaletteStep[] | null {
	if (isValidHex(input)) {
		return generatePaletteFromHex(input);
	}

	if (
		(input.length === 3 || input.length === 6) &&
		/^[0-9a-fA-F]+$/.test(input)
	) {
		return generatePaletteFromHex(`#${input}`);
	}

	if (input.startsWith("oklch(")) {
		try {
			return generatePaletteFromOklchString(input);
		} catch {
			return null;
		}
	}

	return null;
}

const fallbackPalette = generatePaletteFromHex("#f00");

const palettesToColorStates = (
	palettes: readonly StoredPalette[],
): readonly ColorState[] =>
	palettes.map((p) => {
		const palette = generatePalette(p.input);
		return {
			name: p.name,
			input: p.input,
			palette: palette ?? fallbackPalette,
			errorType: palette ? null : "ParseError",
		};
	});

const colorStatesToStoredPalettes = (
	colors: readonly ColorState[],
): readonly StoredPalette[] =>
	colors.map((c) => ({ name: c.name, input: c.input }));

export default function Home() {
	const [colors, setColors] = createSignal<readonly ColorState[]>([
		createRandomColorState(),
	]);

	const savePalettes = (colorStates: readonly ColorState[]): void => {
		if (!isServer) {
			localStorage.setItem(
				storageKeys.palettes,
				JSON.stringify(colorStatesToStoredPalettes(colorStates)),
			);
		}
	};

	const getColor = (index: number) => () => colors()[index];
	const setColorAt = (index: number) => (value: ColorState) => {
		const newColors = colors().map((c, i) => (i === index ? value : c));
		setColors(newColors);
		savePalettes(newColors);
	};

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

		const savedPalettes = localStorage.getItem(storageKeys.palettes);
		if (savedPalettes !== null) {
			const parsed = JSON.parse(savedPalettes) as StoredPalette[];
			if (parsed.length > 0) {
				setColors(palettesToColorStates(parsed));
			}
		}

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

	const createHandleInput = (index: number) => (e: Event) => {
		const target = e.target as HTMLInputElement;
		const value = target.value;
		const color = getColor(index);
		const setColor = setColorAt(index);
		const palette = generatePalette(value);

		setColor({
			...color(),
			input: value,
			palette: palette ?? color().palette,
			errorType: palette ? null : "ParseError",
		});
	};

	const createDisplayedPalette = (index: number) =>
		createMemo(() => {
			const palette = colors()[index].palette;
			const state = showEdgeShades();
			if (state.isLoading || state.value) {
				return palette;
			}
			return palette.filter((item) => item.shade !== 0 && item.shade !== 1000);
		});

	const createGridColumns = (displayedPalette: () => readonly unknown[]) =>
		createMemo(() => displayedPalette().length);

	const createHiddenClosestEdgeShade = (index: number) =>
		createMemo(() => {
			const state = showEdgeShades();
			if (state.isLoading || state.value) return null;
			const closest = colors()[index].palette.find((item) => item.isClosest);
			if (closest && (closest.shade === 0 || closest.shade === 1000)) {
				return closest.shade;
			}
			return null;
		});

	const createNeedsStrongCorrection = (index: number) =>
		createMemo(() => {
			const closest = colors()[index].palette.find((item) => item.isClosest);
			return closest?.needsStrongCorrection ?? false;
		});

	const getColorName = (color: ColorState) => color.name.trim() || color.input;

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
	};

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
		const name = getColorName(colors()[index]);
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
								{(_, index) => {
									const displayedPalette = createDisplayedPalette(index);
									const gridColumns = createGridColumns(displayedPalette);
									const showDropBefore = createMemo(() => {
										const dragged = draggedIndex();
										const dropTarget = dropTargetIndex();
										return (
											dropTarget === index &&
											dragged !== null &&
											dragged > index
										);
									});
									const showDropAfter = createMemo(() => {
										const dragged = draggedIndex();
										const dropTarget = dropTargetIndex();
										return (
											dropTarget === index &&
											dragged !== null &&
											dragged < index
										);
									});
									return (
										// biome-ignore lint/a11y/noStaticElementInteractions: drag-and-drop requires these handlers
										<div
											onDragOver={(e) => handleDragOver(e, index)}
											onDrop={(e) => handleDrop(e, index)}
										>
											<div
												class={`h-1 rounded-full transition-colors ${showDropBefore() ? "bg-sky-500" : "bg-transparent"}`}
											/>
											{/* biome-ignore lint/a11y/noStaticElementInteractions: draggable element */}
											<div
												class={`flex items-center gap-4 ${draggedIndex() === index ? "opacity-30" : ""}`}
												draggable={isEditMode()}
												onDragStart={() => handleDragStart(index)}
												onDragEnd={handleDragEnd}
											>
												<Show when={isEditMode()}>
													<span
														class="text-gray-500 dark:text-gray-400 cursor-grab active:cursor-grabbing"
														role="img"
														aria-label="Reorder"
													>
														<GripVertical size={20} />
													</span>
												</Show>
												<div class="flex-1">
													<ColorPalette
														color={getColor(index)}
														setColor={setColorAt(index)}
														handleInput={createHandleInput(index)}
														gridColumns={gridColumns}
														displayedPalette={displayedPalette}
														hiddenClosestEdgeShade={createHiddenClosestEdgeShade(
															index,
														)}
														needsStrongCorrection={createNeedsStrongCorrection(
															index,
														)}
														isEditMode={isEditMode}
													/>
												</div>
												<Show when={isEditMode()}>
													<button
														type="button"
														onClick={() => handleDeletePalette(index)}
														disabled={colors().length === 1}
														class="p-2 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950 active:bg-red-100 dark:active:bg-red-900 rounded-lg transition-colors disabled:text-gray-300 dark:disabled:text-gray-600 disabled:hover:bg-transparent disabled:cursor-not-allowed"
														aria-label="Delete"
													>
														<Trash2 size={20} />
													</button>
												</Show>
											</div>
											<div
												class={`h-1 rounded-full transition-colors ${showDropAfter() ? "bg-sky-500" : "bg-transparent"}`}
											/>
										</div>
									);
								}}
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

						{/* Right Column: CSS Export */}
						<div class="flex flex-col min-h-0 gap-2">
							<div class="flex justify-between items-center">
								<label
									for="css-output"
									class="block text-xs font-medium text-gray-700 dark:text-gray-300"
								>
									CSS Variables
								</label>
								<button
									type="button"
									onClick={copyToClipboard}
									class="px-2 py-1 text-xs bg-sky-600 dark:bg-sky-700 text-white rounded hover:bg-sky-700 dark:hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
								>
									Copy CSS
								</button>
							</div>
							<textarea
								id="css-output"
								readonly
								textContent={cssOutput()}
								class="w-full flex-1 min-h-0 p-3 font-mono text-xs border border-gray-300 dark:border-gray-700 rounded-md focus:ring-sky-500 focus:border-sky-500 shadow-sm resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
							/>
						</div>
					</div>
				</main>
			</Show>
		</div>
	);
}
