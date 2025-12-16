import { Plus } from "lucide-solid";
import { createSignal, Index } from "solid-js";

import { useColors } from "../contexts/colors/use-colors";
import { useEditMode } from "../contexts/edit-mode/use-edit-mode";
import { useShowEdgeShades } from "../contexts/show-edge-shades/use-show-edge-shades";
import { PaletteRow } from "./palette-row";

export function PaletteBuilder() {
	const { colors, addColor, deleteColor, reorderColors } = useColors();
	const { showEdgeShades } = useShowEdgeShades();
	const { isEditMode } = useEditMode();

	const [draggedIndex, setDraggedIndex] = createSignal<number | null>(null);
	const [dropTargetIndex, setDropTargetIndex] = createSignal<number | null>(
		null,
	);
	let paletteContainerRef: HTMLDivElement | undefined;

	const handleAddPalette = () => {
		addColor();

		requestAnimationFrame(() => {
			if (paletteContainerRef) {
				const paletteItems = paletteContainerRef.querySelectorAll(
					":scope > div:not(:last-child)",
				);
				const lastPalette = paletteItems[paletteItems.length - 1];
				if (lastPalette) {
					const gap = 20; // gap-5 = 1.25rem = 20px
					paletteContainerRef.scrollBy({
						top: lastPalette.getBoundingClientRect().height + gap,
						behavior: "instant",
					});
				}
			}
		});
	};

	const handleDeletePalette = (index: number) => {
		deleteColor(index);
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

		reorderColors(dragged, targetIndex);

		setDraggedIndex(null);
		setDropTargetIndex(null);
	};

	return (
		<div
			ref={(el) => {
				paletteContainerRef = el;
			}}
			class="flex flex-col gap-5 min-h-0 overflow-y-auto px-1 pb-2"
		>
			<Index each={colors()}>
				{(_, index) => (
					<PaletteRow
						index={index}
						draggedIndex={draggedIndex}
						dropTargetIndex={dropTargetIndex}
						isEditMode={isEditMode}
						showEdgeShades={showEdgeShades}
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
