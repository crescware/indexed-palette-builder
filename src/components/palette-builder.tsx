import { Plus } from "lucide-solid";
import { createSignal, Index } from "solid-js";

import { useColors } from "../contexts/colors/use-colors";
import { useEditMode } from "../contexts/edit-mode/use-edit-mode";
import { useShowEdgeShades } from "../contexts/show-edge-shades/use-show-edge-shades";
import { Button } from "./button";
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

	const handleDragStart = (e: DragEvent, index: number) => {
		if (e.dataTransfer) {
			// setData() must be called first to properly initialize the DataTransfer object.
			// Without this, the browser may briefly show the default copy cursor before
			// effectAllowed takes effect. Once initialized, effectAllowed = "move" is
			// applied immediately, showing the move cursor from the start.
			e.dataTransfer.setData("text/plain", index.toString());
			e.dataTransfer.effectAllowed = "move";
		}
		setDraggedIndex(index);
	};

	const handleDragEnd = () => {
		setDraggedIndex(null);
		setDropTargetIndex(null);
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		const dragged = draggedIndex();
		if (dragged === null || !paletteContainerRef) {
			setDropTargetIndex(null);
			return;
		}

		const rows = paletteContainerRef.querySelectorAll<HTMLElement>(
			":scope > div:not(:last-child)",
		);
		const mouseY = e.clientY;

		for (let i = 0; i < rows.length; i++) {
			const rect = rows[i].getBoundingClientRect();
			const midY = rect.top + rect.height / 2;
			if (mouseY < midY) {
				setDropTargetIndex(i === dragged ? null : i);
				return;
			}
		}
		// Mouse is below all rows
		const lastIndex = rows.length - 1;
		setDropTargetIndex(lastIndex === dragged ? null : lastIndex);
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		const dragged = draggedIndex();
		const target = dropTargetIndex();
		if (dragged === null || target === null) {
			return;
		}

		reorderColors(dragged, target);

		setDraggedIndex(null);
		setDropTargetIndex(null);
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: drag-and-drop container
		<div
			ref={(el) => {
				paletteContainerRef = el;
			}}
			class="flex flex-col gap-5 min-h-0 overflow-y-auto px-6"
			onDragOver={handleDragOver}
			onDrop={handleDrop}
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
						onDelete={handleDeletePalette}
					/>
				)}
			</Index>
			<Button
				onClick={handleAddPalette}
				class="w-full flex items-center justify-center gap-2 py-3"
			>
				<Plus size={20} />
				<span class="text-sm">Add Palette</span>
			</Button>
		</div>
	);
}
