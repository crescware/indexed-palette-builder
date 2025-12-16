import { GripVertical, Trash2 } from "lucide-solid";
import type { Accessor } from "solid-js";
import { createMemo, Show } from "solid-js";

import { useColors } from "../contexts/colors/use-colors";
import type { PaletteStep } from "../models/color/generate-palette";
import type { ShowEdgeShadesState } from "../models/show-edge-shades-state";
import { ColorPalette } from "./color-palette";

type Props = Readonly<{
	index: number;
	draggedIndex: Accessor<number | null>;
	dropTargetIndex: Accessor<number | null>;
	isEditMode: Accessor<boolean>;
	showEdgeShades: Accessor<ShowEdgeShadesState>;
	colorsLength: Accessor<number>;
	onDragStart: (e: DragEvent, index: number) => void;
	onDragEnd: () => void;
	onDelete: (index: number) => void;
}>;

export function PaletteRow(props: Props) {
	const { getColor, setColorNameAt, setColorValueAt } = useColors();

	const displayedPalette: Accessor<readonly PaletteStep[]> = createMemo(() => {
		const palette = getColor(props.index).palette;
		const state = props.showEdgeShades();
		if (state.isLoading || state.value) {
			return palette;
		}
		return palette.filter((item) => item.shade !== 0 && item.shade !== 1000);
	});

	const gridColumns = createMemo(() => displayedPalette().length);

	const hiddenClosestEdgeShade = createMemo(() => {
		const state = props.showEdgeShades();
		if (state.isLoading || state.value) return null;
		const closest = getColor(props.index).palette.find(
			(item) => item.isClosest,
		);
		if (closest && (closest.shade === 0 || closest.shade === 1000)) {
			return closest.shade;
		}
		return null;
	});

	const needsStrongCorrection = createMemo(() => {
		const closest = getColor(props.index).palette.find(
			(item) => item.isClosest,
		);
		return closest?.needsStrongCorrection ?? false;
	});

	const showDropBefore = createMemo(() => {
		const dragged = props.draggedIndex();
		const dropTarget = props.dropTargetIndex();
		return (
			dropTarget === props.index && dragged !== null && dragged > props.index
		);
	});

	const showDropAfter = createMemo(() => {
		const dragged = props.draggedIndex();
		const dropTarget = props.dropTargetIndex();
		return (
			dropTarget === props.index && dragged !== null && dragged < props.index
		);
	});

	return (
		<div>
			<div
				class={`h-1 rounded-full transition-colors ${showDropBefore() ? "bg-sky-500" : "bg-transparent"}`}
			/>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: draggable element */}
			<div
				class={`flex items-center gap-4 ${props.draggedIndex() === props.index ? "opacity-30" : ""}`}
				draggable={props.isEditMode()}
				onDragStart={(e) => props.onDragStart(e, props.index)}
				onDragEnd={props.onDragEnd}
			>
				<Show when={props.isEditMode()}>
					<span
						class="text-gray-500 dark:text-gray-400"
						role="img"
						aria-label="Reorder"
					>
						<GripVertical size={20} />
					</span>
				</Show>
				<div class="flex-1">
					<ColorPalette
						index={props.index}
						color={() => getColor(props.index)}
						onChangeName={(name) => setColorNameAt(props.index, name)}
						onChangeInput={(value) => setColorValueAt(props.index, value)}
						gridColumns={gridColumns}
						displayedPalette={displayedPalette}
						hiddenClosestEdgeShade={hiddenClosestEdgeShade}
						needsStrongCorrection={needsStrongCorrection}
						isEditMode={props.isEditMode}
					/>
				</div>
				<Show when={props.isEditMode()}>
					<button
						type="button"
						onClick={() => props.onDelete(props.index)}
						disabled={props.colorsLength() === 1}
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
}
