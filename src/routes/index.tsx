import { Settings } from "lucide-solid";
import { createMemo, createSignal, onCleanup, onMount, Show } from "solid-js";
import { isServer } from "solid-js/web";
import { generatePalette, isValidHex } from "../utils/color-utils";

export default function Home() {
	const [color, setColor] = createSignal({
		name: "primary",
		input: "#3b82f6", // Default to blue-500
		palette: generatePalette("#3b82f6"),
	});

	const [isSettingsOpen, setIsSettingsOpen] = createSignal(false);
	const [theme, setTheme] = createSignal<"light" | "dark" | "system">("system");
	let settingsContainerRef: HTMLDivElement | undefined;

	const applyTheme = (newTheme: "light" | "dark" | "system") => {
		if (isServer) return;

		const root = document.documentElement;

		if (newTheme === "light") {
			root.classList.remove("dark");
		} else if (newTheme === "dark") {
			root.classList.add("dark");
		} else if (newTheme === "system") {
			const prefersDark = window.matchMedia(
				"(prefers-color-scheme: dark)",
			).matches;
			if (prefersDark) {
				root.classList.add("dark");
			} else {
				root.classList.remove("dark");
			}
		}

		setTheme(newTheme);
	};

	onMount(() => {
		// Apply initial theme
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
			setColor({ ...color(), palette: generatePalette(value) });
		}
	};

	const cssOutput = createMemo(() => {
		const colorName = color().name.trim() || "primary";
		return color()
			.palette.map((item) => `--color-${colorName}-${item.shade}: ${item.hex};`)
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

					{/* Settings Popup */}
					<Show when={isSettingsOpen()}>
						<div class="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-64 z-50">
							<div class="flex justify-between items-center mb-3">
								<h2 class="text-base font-semibold text-gray-800 dark:text-gray-200">
									Settings
								</h2>
								<button
									type="button"
									onClick={() => setIsSettingsOpen(false)}
									class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
									aria-label="Close settings"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
							<div class="space-y-4">
								<div>
									<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Color Theme
									</label>
									<div class="space-y-2">
										<label class="flex items-center cursor-pointer">
											<input
												type="radio"
												name="theme"
												value="light"
												checked={theme() === "light"}
												onInput={() => applyTheme("light")}
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
												checked={theme() === "dark"}
												onInput={() => applyTheme("dark")}
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
												checked={theme() === "system"}
												onInput={() => applyTheme("system")}
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
						<div class="flex-1 grid grid-cols-13 gap-[1%] min-w-0">
							{color().palette.map((item) => (
								<div
									class={`aspect-square rounded transition-all ${
										item.isClosest ? "ring-2 ring-sky-500" : ""
									}`}
									style={{ "background-color": item.hex }}
									title={`${item.shade}: ${item.hex}`}
								/>
							))}
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
