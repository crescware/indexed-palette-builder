import type { Accessor } from "solid-js";
import { Show } from "solid-js";

import type { ColorState } from "../models/color/color-state";
import type { PaletteStep } from "../models/color/generate-palette";

type Props = Readonly<{
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
	return (
		<div class="flex gap-3 items-center min-w-0">
			{/* Input fields on the left */}
			<div class="flex-shrink-0 w-36 flex flex-col gap-2">
				<div class="flex flex-col gap-1">
					<label
						for="name-input"
						class="block text-xs font-medium text-gray-700 dark:text-gray-300 text-left"
					>
						Name
					</label>
					<input
						id="name-input"
						type="text"
						value={props.color().name}
						onInput={(e) => props.onChangeName(e.target.value)}
						disabled={props.isEditMode()}
						class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:ring-sky-500 focus:border-sky-500 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
						placeholder="primary"
					/>
				</div>

				<div class="flex flex-col gap-1">
					<label
						for="color-input"
						class="block text-xs font-medium text-gray-700 dark:text-gray-300 text-left"
					>
						Color
					</label>
					<input
						id="color-input"
						type="text"
						value={props.color().input}
						onInput={(e) => props.onChangeInput(e.target.value)}
						disabled={props.isEditMode()}
						class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md focus:ring-sky-500 focus:border-sky-500 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
						placeholder="#000000"
					/>
				</div>
			</div>

			{/* Color squares arranged horizontally */}
			<div class="flex-1 flex flex-col items-center min-w-0 gap-2">
				<div
					class="w-full grid gap-[1%]"
					style={{
						"grid-template-columns": `repeat(${props.gridColumns()}, 1fr)`,
					}}
				>
					{props.displayedPalette().map((item) => (
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
