import { createMemo, createSignal } from "solid-js";
import {
	generatePalette,
	isValidHex,
	type Palette,
} from "../utils/color-utils";

export default function Home() {
	const [input, setInput] = createSignal("#3b82f6"); // Default to blue-500
	const [palette, setPalette] = createSignal<Palette[]>(
		generatePalette("#3b82f6"),
	);

	const handleInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const value = target.value;
		setInput(value);

		if (isValidHex(value)) {
			setPalette(generatePalette(value));
		}
	};

	const cssOutput = createMemo(() => {
		return palette()
			.map((item) => `--color-${item.shade}: ${item.hex};`)
			.join("\n");
	});

	const copyToClipboard = () => {
		navigator.clipboard.writeText(cssOutput());
	};

	return (
		<main class="text-center mx-auto text-gray-700 p-4 min-h-screen bg-gray-50">
			<h1 class="max-6-xs text-4xl text-sky-700 font-thin uppercase my-8">
				Indexed Palette Builder
			</h1>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
				{/* Left Column: Palette Builder */}
				<div>
					<div class="max-w-md mx-auto mb-8">
						<label
							for="color-input"
							class="block text-sm font-medium text-gray-700 mb-2"
						>
							Enter RGB Hex Color
						</label>
						<input
							id="color-input"
							type="text"
							value={input()}
							onInput={handleInput}
							class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 shadow-sm"
							placeholder="#000000"
						/>
						<p class="mt-2 text-sm text-gray-500">
							Try entering a hex code like #3b82f6
						</p>
					</div>

					<div class="max-w-2xl mx-auto space-y-2">
						{palette().map((item) => (
							<div
								class={`flex items-center justify-between p-4 rounded-lg shadow-sm transition-all ${
									item.isClosest
										? "ring-2 ring-sky-500 scale-105 z-10"
										: "hover:bg-gray-100"
								}`}
								style={{ "background-color": item.hex }}
							>
								<span
									class={`font-mono font-bold ${
										item.shade > 500 ? "text-white" : "text-black"
									}`}
								>
									{item.shade}
								</span>
								<span
									class={`font-mono uppercase ${
										item.shade > 500 ? "text-white/80" : "text-black/80"
									}`}
								>
									{item.hex}
								</span>
								{item.isClosest && (
									<span
										class={`text-xs font-bold px-2 py-1 rounded-full ${
											item.shade > 500
												? "bg-white/20 text-white"
												: "bg-black/10 text-black"
										}`}
									>
										Closest
									</span>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Right Column: CSS Export */}
				<div class="flex flex-col h-full">
					<div class="flex justify-between items-center mb-2">
						<label
							for="css-output"
							class="block text-sm font-medium text-gray-700"
						>
							CSS Variables
						</label>
						<button
							type="button"
							onClick={copyToClipboard}
							class="px-3 py-1 text-sm bg-sky-600 text-white rounded hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
						>
							Copy CSS
						</button>
					</div>
					<textarea
						id="css-output"
						readonly
						textContent={cssOutput()}
						class="w-full h-96 lg:h-full p-4 font-mono text-sm border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 shadow-sm resize-none"
					/>
				</div>
			</div>
		</main>
	);
}
