import { colorNames } from "../color-names";
import type { ColorState } from "../color-state";
import { generatePaletteFromOklchString } from "../generate-palette-from-oklch-string";
import { getColorCategory } from "../get-color-category";
import { randomColors } from "../random-colors";
import { extractHue } from "./extract-hue";

function getRandomColorName(hue: number): string {
	const category = getColorCategory(hue);
	const names = colorNames[category];
	const randomIndex = Math.floor(Math.random() * names.length);
	return names[randomIndex];
}

function getHueDifference(hue1: number, hue2: number): number {
	const diff = Math.abs(hue1 - hue2);
	return Math.min(diff, 360 - diff);
}

export function createRandomColorState(
	existingNames: readonly string[] = [],
	lastHue: number | null = null,
): ColorState {
	let randomColor: (typeof randomColors)[number];
	let hue: number;
	let colorAttempts = 0;
	const maxAttempts = 20;

	do {
		randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
		hue = extractHue(randomColor) ?? 0;
		colorAttempts++;
	} while (
		lastHue !== null &&
		getHueDifference(hue, lastHue) < 30 &&
		colorAttempts < maxAttempts
	);

	let name: string;
	let nameAttempts = 0;

	do {
		name = getRandomColorName(hue);
		nameAttempts++;
	} while (existingNames.includes(name) && nameAttempts < maxAttempts);

	if (existingNames.includes(name)) {
		name = `color${existingNames.length + 1}`;
	}

	return {
		name,
		input: randomColor,
		palette: generatePaletteFromOklchString(randomColor),
		errorType: null,
	};
}
