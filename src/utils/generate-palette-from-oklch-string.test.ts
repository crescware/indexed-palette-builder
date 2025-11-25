import { describe, expect, test } from "vitest";
import colors from "./colors.json";
import { generatePaletteFromOklchString } from "./generate-palette-from-oklch-string";

describe("generatePaletteFromOklchString", () => {
	const colorNames = [
		"red",
		"orange",
		"amber",
		"yellow",
		"lime",
		"green",
		"emerald",
		"teal",
		"cyan",
		"sky",
		"blue",
		"indigo",
		"violet",
		"purple",
		"fuchsia",
		"pink",
		"rose",
		"slate",
		"gray",
		"zinc",
		"neutral",
		"stone",
	];

	for (const colorName of colorNames) {
		const color = colors.find((c) => c.name === colorName);

		test.each([
			{ shadeNumber: 50 },
			{ shadeNumber: 100 },
			{ shadeNumber: 200 },
			{ shadeNumber: 300 },
			{ shadeNumber: 400 },
			{ shadeNumber: 500 },
			{ shadeNumber: 600 },
			{ shadeNumber: 700 },
			{ shadeNumber: 800 },
			{ shadeNumber: 900 },
			{ shadeNumber: 950 },
		])(`should generate palette from ${colorName} $shadeNumber OKLCH string`, ({
			shadeNumber,
		}) => {
			const colorShade = color?.grid.find((g) => g.number === shadeNumber);
			const palette = generatePaletteFromOklchString(colorShade?.value);
			const closestSteps = palette.filter((step) => step.isClosest);

			expect(closestSteps[0].shade).toBe(shadeNumber);
		});
	}

	test("should throw error for invalid OKLCH string", () => {
		expect(() => generatePaletteFromOklchString("invalid")).toThrow(
			"Invalid OKLCH color string",
		);
	});

	test("should throw error for non-OKLCH color string", () => {
		expect(() => generatePaletteFromOklchString("#ff0000")).toThrow(
			"Invalid OKLCH color string",
		);
	});
});
