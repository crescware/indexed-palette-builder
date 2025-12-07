import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";

import { ColorPalette } from "../components/color-palette";
import { Header } from "../components/header";
import type { ColorState } from "../models/color/color-state";
import { generatePaletteFromHex } from "../models/color/generate-palette-from-hex";
import type { Theme } from "../models/theme";
import { isValidHex } from "../utils/is-valid-hex";

export default function Home() {
	const [color, setColor] = createSignal<ColorState>({
		name: "primary",
		input: "#3b82f6", // Default to blue-500
		palette: generatePaletteFromHex("#3b82f6"),
	});

	const [isSettingsOpen, setIsSettingsOpen] = createSignal(false);
	const [theme, setTheme] = createSignal<Theme>("system");
	const [showEdgeShades, setShowEdgeShades] = createSignal(false);
	let settingsContainerRef: HTMLDivElement | undefined;

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
	};

	onMount(() => {
		applyTheme(theme());

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

	const handleInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const value = target.value;
		setColor({ ...color(), input: value });

		if (isValidHex(value)) {
			setColor({
				...color(),
				input: value,
				palette: generatePaletteFromHex(value),
			});
		}
	};

	const displayedPalette = createMemo(() => {
		const palette = color().palette;
		if (showEdgeShades()) {
			return palette;
		}
		return palette.filter((item) => item.shade !== 0 && item.shade !== 1000);
	});

	const gridColumns = createMemo(() => displayedPalette().length);

	const hiddenClosestEdgeShade = createMemo(() => {
		if (showEdgeShades()) return null;
		const closest = color().palette.find((item) => item.isClosest);
		if (closest && (closest.shade === 0 || closest.shade === 1000)) {
			return closest.shade;
		}
		return null;
	});

	const needsStrongCorrection = createMemo(() => {
		const closest = color().palette.find((item) => item.isClosest);
		return closest?.needsStrongCorrection ?? false;
	});

	const cssOutput = createMemo(() => {
		const colorName = color().name.trim() || "primary";
		return color()
			.palette.filter((item) => item.shade !== 0 && item.shade !== 1000)
			.map((item) => `--color-${colorName}-${item.shade}: ${item.hex};`)
			.join("\n");
	});

	const copyToClipboard = () => {
		navigator.clipboard.writeText(cssOutput());
	};

	const handleOnClickSettingsButton = () => {
		setIsSettingsOpen(!isSettingsOpen());
	};

	return (
		<div class="flex justify-center h-screen bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300">
			<main class="text-center h-full flex flex-col max-w-7xl w-full">
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
					setShowEdgeShades={setShowEdgeShades}
				/>

				<div class="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-4 w-full flex-1 min-h-0 px-4 pb-4">
					{/* Left Column: Palette Builder */}
					<div class="flex flex-col gap-3 min-h-0">
						<ColorPalette
							color={color}
							setColor={setColor}
							handleInput={handleInput}
							gridColumns={gridColumns}
							displayedPalette={displayedPalette}
							hiddenClosestEdgeShade={hiddenClosestEdgeShade}
							needsStrongCorrection={needsStrongCorrection}
						/>
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
		</div>
	);
}
