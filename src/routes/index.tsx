import { createMemo, createSignal } from "solid-js";
import {
	generatePalette,
	isValidHex,
} from "../utils/color-utils";

export default function Home() {
	const [color, setColor] = createSignal({
		name: "primary",
		input: "#3b82f6", // Default to blue-500
		palette: generatePalette("#3b82f6"),
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
		<main class="text-center mx-auto text-gray-700 h-screen bg-gray-50 flex flex-col overflow-hidden">
			<h1 class="max-6-xs text-2xl text-sky-700 font-thin uppercase my-3 px-4">
				Indexed Palette Builder
			</h1>

			<div class="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-4 max-w-7xl w-full mx-auto flex-1 min-h-0 px-4 pb-4">
				{/* Left Column: Palette Builder */}
				<div class="flex flex-col gap-3 min-h-0 overflow-hidden">
					<div class="flex gap-3 items-center min-w-0">
						{/* Input fields on the left */}
						<div class="flex-shrink-0 w-36 space-y-2">
							<div>
								<label
									for="name-input"
									class="block text-xs font-medium text-gray-700 mb-1"
								>
									Color Name
								</label>
								<input
									id="name-input"
									type="text"
									value={color().name}
									onInput={(e) => setColor({ ...color(), name: e.target.value })}
									class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 shadow-sm"
									placeholder="primary"
								/>
							</div>

							<div>
								<label
									for="color-input"
									class="block text-xs font-medium text-gray-700 mb-1"
								>
									Hex Color
								</label>
								<input
									id="color-input"
									type="text"
									value={color().input}
									onInput={handleInput}
									class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 shadow-sm"
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
							class="block text-xs font-medium text-gray-700"
						>
							CSS Variables
						</label>
						<button
							type="button"
							onClick={copyToClipboard}
							class="px-2 py-1 text-xs bg-sky-600 text-white rounded hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
						>
							Copy CSS
						</button>
					</div>
					<textarea
						id="css-output"
						readonly
						textContent={cssOutput()}
						class="w-full flex-1 min-h-0 p-3 font-mono text-xs border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 shadow-sm resize-none"
					/>
				</div>
			</div>
		</main>
	);
}
