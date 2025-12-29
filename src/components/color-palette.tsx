import type { Accessor } from "solid-js";
import { createMemo, createSignal, Show } from "solid-js";

import { useColorFormat } from "../contexts/color-format/use-color-format";
import type { ColorState } from "../models/color/color-state";
import type { PaletteStep } from "../models/color/generate-palette";
import { defaultColorFormat } from "../models/color-format-state";
import { formatOklch } from "../utils/format-oklch";

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
	const { colorFormat } = useColorFormat();
	const [isColorInputFocused, setIsColorInputFocused] = createSignal(false);

	const formatColorValue = (item: PaletteStep): string => {
		const state = colorFormat();
		const format = state.isLoading ? defaultColorFormat : state.value;
		switch (format) {
			case "hex":
				return item.hex;
			case "oklch":
				return formatOklch(item.oklch);
		}
	};

	const closestSwatchData = createMemo(() => {
		const palette = props.displayedPalette();
		const closestIndex = palette.findIndex((item) => item.isClosest);
		if (closestIndex === -1) return null;
		return {
			index: closestIndex,
			item: palette[closestIndex],
		};
	});

	const shouldShowHighlight = createMemo(
		() =>
			isColorInputFocused() &&
			props.color().errorType !== "ParseError" &&
			closestSwatchData() !== null,
	);

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
						class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md outline-1 outline-transparent focus:outline-blue-500 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
						class="w-full px-2 py-1 text-sm font-mono border border-gray-300 dark:border-gray-700 rounded-md outline-1 outline-transparent focus:outline-blue-500 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
									class={`aspect-square transition-all w-full ${roundedClass}`.trim()}
									style={{ "background-color": formatColorValue(item) }}
									title={`${item.shade}: ${formatColorValue(item)}`}
								/>
							);
						})}
					</div>
					<Show when={closestSwatchData()}>
						{(data) => {
							const columns = props.gridColumns();
							const expand = 3;
							const borderWidth = 4;
							const expandedOffset = expand + borderWidth;
							const offset = () => (shouldShowHighlight() ? expandedOffset : 0);
							return (
								<div
									class="absolute pointer-events-none rounded-xl transition-all duration-200"
									style={{
										top: `-${offset()}px`,
										bottom: `-${offset()}px`,
										left: `calc(${(data().index / columns) * 100}% - ${offset()}px)`,
										width: `calc(${(1 / columns) * 100}% + ${offset() * 2}px)`,
										"background-color": formatColorValue(data().item),
										border: `${borderWidth}px solid ${shouldShowHighlight() ? "var(--app-bg)" : "transparent"}`,
										opacity: shouldShowHighlight() ? 1 : 0,
									}}
								/>
							);
						}}
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
