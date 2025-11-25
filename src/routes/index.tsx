import { Settings } from "lucide-solid";
import { createMemo, createSignal, onCleanup, onMount, Show } from "solid-js";
import { isServer } from "solid-js/web";

import { SettingsPopup } from "../components/settings-popup";
import { generatePaletteFromHex, isValidHex } from "../utils/color-utils";

export default function Home() {
	const [color, setColor] = createSignal({
		name: "primary",
		input: "#3b82f6", // Default to blue-500
		palette: generatePaletteFromHex("#3b82f6"),
	});

	const [isSettingsOpen, setIsSettingsOpen] = createSignal(false);
	const [theme, setTheme] = createSignal<"light" | "dark" | "system">("system");
	const [showEdgeShades, setShowEdgeShades] = createSignal(false);
	let settingsContainerRef: HTMLDivElement | undefined;

	const applyTheme = (newTheme: "light" | "dark" | "system") => {
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
			setColor({ ...color(), input: value, palette: generatePaletteFromHex(value) });
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

	return (
		<main class="text-center mx-auto text-gray-700 dark:text-gray-300 h-screen bg-gray-50 dark:bg-gray-950 flex flex-col overflow-hidden">
			<div class="relative">
				<h1 class="max-6-xs text-2xl text-sky-700 dark:text-sky-400 font-thin uppercase my-3 px-4">
					Indexed Palette Builder
				</h1>

				<div
					class="absolute top-1/2 -translate-y-1/2 right-4"
					ref={settingsContainerRef}
				>
					<button
						type="button"
						onClick={() => setIsSettingsOpen(!isSettingsOpen())}
						class="p-2 text-gray-600 dark:text-gray-400 hover:text-sky-700 dark:hover:text-sky-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
						aria-label="Settings"
					>
						<Settings size={20} />
					</button>

					<SettingsPopup
						isOpen={isSettingsOpen}
						setIsOpen={setIsSettingsOpen}
						theme={theme}
						applyTheme={applyTheme}
						showEdgeShades={showEdgeShades}
						setShowEdgeShades={setShowEdgeShades}
					/>
				</div>
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-4 max-w-7xl w-full mx-auto flex-1 min-h-0 px-4 pb-4">
				{/* Left Column: Palette Builder */}
				<div class="flex flex-col gap-3 min-h-0 overflow-hidden">
					<div class="flex gap-3 items-center min-w-0">
						{/* Input fields on the left */}
						<div class="flex-shrink-0 w-36 space-y-2">
							<div>
								<label
									for="name-input"
									class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
								>
									Color Name
								</label>
								<input
									id="name-input"
									type="text"
									value={color().name}
									onInput={(e) =>
										setColor({ ...color(), name: e.target.value })
									}
									class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:ring-sky-500 focus:border-sky-500 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
									placeholder="primary"
								/>
							</div>

							<div>
								<label
									for="color-input"
									class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
								>
									Hex Color
								</label>
								<input
									id="color-input"
									type="text"
									value={color().input}
									onInput={handleInput}
									class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:ring-sky-500 focus:border-sky-500 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
									placeholder="#000000"
								/>
							</div>
						</div>

						{/* Color squares arranged horizontally */}
						<div class="flex-1 flex flex-col items-center min-w-0">
							<div
								class="w-full grid gap-[1%]"
								style={{
									"grid-template-columns": `repeat(${gridColumns()}, 1fr)`,
								}}
							>
								{displayedPalette().map((item) => (
									<div class="flex flex-col items-center gap-1">
										<div
											class="aspect-square rounded transition-all w-full"
											style={{ "background-color": item.hex }}
											title={`${item.shade}: ${item.hex}`}
										/>
										{item.isClosest && (
											<div class="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500" />
										)}
									</div>
								))}
							</div>

							{/* Detection message for hidden edge shades */}
							<Show when={hiddenClosestEdgeShade() !== null}>
								<div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
									Closest to edge shade {hiddenClosestEdgeShade()}
								</div>
							</Show>
						</div>
					</div>
				</div>

				{/* Right Column: CSS Export */}
				<div class="flex flex-col min-h-0">
					<div class="flex justify-between items-center mb-2">
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
	);
}
