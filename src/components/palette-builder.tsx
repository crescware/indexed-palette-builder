import { Plus } from "lucide-solid";
import type { Accessor } from "solid-js";
import { createSignal, Index } from "solid-js";

import { useColors } from "../contexts/colors/use-colors";
import { createRandomColorState } from "../models/color/create-random-color-state/create-random-color-state";
import { extractHue } from "../models/color/create-random-color-state/extract-hue";
import { getColorName } from "../models/color/get-color-name";
import type { ShowEdgeShadesState } from "../models/show-edge-shades-state";
import { PaletteRow } from "./palette-row";

type Props = Readonly<{
	isEditMode: Accessor<boolean>;
	showEdgeShades: Accessor<ShowEdgeShadesState>;
}>;

export function PaletteBuilder(props: Props) {
	const { colors, setColors, savePalettes, getColor } = useColors();

	const [draggedIndex, setDraggedIndex] = createSignal<number | null>(null);
	const [dropTargetIndex, setDropTargetIndex] = createSignal<number | null>(
		null,
	);
	let paletteContainerRef: HTMLDivElement | undefined;

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
		const name = getColorName(getColor(index));
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

	return (
		<div
			ref={(el) => {
				paletteContainerRef = el;
			}}
			class="flex flex-col gap-3 min-h-0 overflow-y-auto px-1"
		>
			<Index each={colors()}>
				{(_, index) => (
					<PaletteRow
						index={index}
						draggedIndex={draggedIndex}
						dropTargetIndex={dropTargetIndex}
						isEditMode={props.isEditMode}
						showEdgeShades={props.showEdgeShades}
						colorsLength={() => colors().length}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
						onDragOver={handleDragOver}
						onDrop={handleDrop}
						onDelete={handleDeletePalette}
					/>
				)}
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
	);
}
