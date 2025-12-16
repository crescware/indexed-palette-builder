import type { Accessor } from "solid-js";
import { createSignal, Show } from "solid-js";

import type { ColorState } from "../models/color/color-state";
import type { PaletteStep } from "../models/color/generate-palette";

type Props = Readonly<{
	index: number;
	color: Accessor<ColorState>;
	onChangeName: (name: string) => void;
	onChangeInput: (value: string) => void;
	gridColumns: Accessor<number>;
	displayedPalette: Accessor<readonly PaletteStep[]>;
	hiddenClosestEdgeShade: Accessor<number | null>;
	needsStrongCorrection: Accessor<boolean>;
	isEditMode: Accessor<boolean>;
}>;

export function ColorPalette(props: Props) {
	const [isColorInputFocused, setIsColorInputFocused] = createSignal(false);

	return (
		<div class="flex flex-col gap-3 min-w-0">
			{/* Input fields arranged horizontally */}
			<div class="flex gap-2">
				<div class="w-28 flex flex-col gap-1">
					<label
						for={`name-input-${props.index}`}
						class={
							props.index === 0
								? `block text-xs font-medium text-left ${props.isEditMode() ? "text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-300"}`
								: "sr-only"
						}
					>
						Name
					</label>
					<input
						id={`name-input-${props.index}`}
						type="text"
						value={props.color().name}
						onInput={(e) => props.onChangeName(e.target.value)}
						disabled={props.isEditMode()}
						class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:ring-sky-500 focus:border-sky-500 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
						placeholder="primary"
					/>
				</div>

				<div class="w-64 flex flex-col gap-1">
					<label
						for={`color-input-${props.index}`}
						class={
							props.index === 0
								? `block text-xs font-medium text-left ${props.isEditMode() ? "text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-300"}`
								: "sr-only"
						}
					>
						Color
					</label>
					<input
						id={`color-input-${props.index}`}
						type="text"
						value={props.color().input}
						onInput={(e) => props.onChangeInput(e.target.value)}
						onFocus={() => setIsColorInputFocused(true)}
						onBlur={() => setIsColorInputFocused(false)}
						disabled={props.isEditMode()}
						class="w-full px-2 py-1 text-sm font-mono border border-gray-300 dark:border-gray-700 rounded-md focus:ring-sky-500 focus:border-sky-500 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
						placeholder="#000000"
					/>
				</div>
			</div>

			{/* Color swatches below */}
			<div class="flex flex-col items-center gap-2">
				<div class="w-full relative">
					<div
						class="w-full grid gap-0"
						style={{
							"grid-template-columns": `repeat(${props.gridColumns()}, 1fr)`,
						}}
					>
						{props.displayedPalette().map((item, i) => {
							const isFirst = i === 0;
							const isLast = i === props.displayedPalette().length - 1;
							const roundedClass = isFirst
								? "rounded-l-xl"
								: isLast
									? "rounded-r-xl"
									: "";
							return (
								<div
									class={`aspect-square transition-all w-full ${roundedClass}`}
									style={{ "background-color": item.hex }}
									title={`${item.shade}: ${item.hex}`}
								/>
							);
						})}
					</div>
					<Show when={isColorInputFocused() && props.color().errorType !== "ParseError"}>
						{(() => {
							const closestIndex = props
								.displayedPalette()
								.findIndex((item) => item.isClosest);
							if (closestIndex === -1) return null;
							const closest = props.displayedPalette()[closestIndex];
							const columns = props.gridColumns();
							const expand = 3;
							const borderWidth = 4;
							const offset = expand + borderWidth;
							return (
								<div
									class="absolute pointer-events-none rounded-xl"
									style={{
										top: `-${offset}px`,
										bottom: `-${offset}px`,
										left: `calc(${(closestIndex / columns) * 100}% - ${offset}px)`,
										width: `calc(${(1 / columns) * 100}% + ${offset * 2}px)`,
										"background-color": closest.hex,
										border: `${borderWidth}px solid var(--app-bg)`,
									}}
								/>
							);
						})()}
					</Show>
				</div>

				{/* Reserved area for warning messages */}
				<div class="text-sm text-gray-600 dark:text-gray-400 h-5">
					<Show when={props.color().errorType === "ParseError"}>
						<span class="text-red-500 dark:text-red-400">
							Invalid color format
						</span>
					</Show>
					<Show
						when={
							!props.color().errorType &&
							props.hiddenClosestEdgeShade() !== null
						}
					>
						Closest to edge shade {props.hiddenClosestEdgeShade()}
					</Show>
					<Show
						when={!props.color().errorType && props.needsStrongCorrection()}
					>
						This color does not look like Tailwind, so strong correction is
						being applied
					</Show>
				</div>
			</div>
		</div>
	);
}
