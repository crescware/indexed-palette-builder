import Big from "big.js";
import { describe, expect, test } from "vitest";

import { formatOklch } from "./format-oklch";

type TestCase = {
	name: string;
	input: {
		mode: "oklch";
		l: Big;
		c: Big;
		h?: Big;
		alpha?: Big;
	};
	expected: string;
};

// formatOklch serializes lightness as percent, so 0.5 should become 50%.
const lightness50Percent = Big("0.5");
const sampleChroma = Big("0.2");
const sampleHue = Big("30");
const zeroHue = Big(0);
const sampleAlpha = Big("0.5");

describe("formatOklch()", () => {
	test.each([
		{
			name: "h >= 1 and alpha present",
			input: {
				mode: "oklch" as const,
				l: lightness50Percent,
				c: sampleChroma,
				h: sampleHue,
				alpha: sampleAlpha,
			},
			expected: "oklch(50% 0.2 30)",
		},
		{
			name: "h = 0 and alpha present",
			input: {
				mode: "oklch" as const,
				l: lightness50Percent,
				c: sampleChroma,
				h: zeroHue,
				alpha: sampleAlpha,
			},
			expected: "oklch(50% 0.2 0)",
		},
		{
			name: "h = none and alpha present",
			input: {
				mode: "oklch" as const,
				l: lightness50Percent,
				c: sampleChroma,
				alpha: sampleAlpha,
			},
			expected: "oklch(50% 0.2 none)",
		},
		{
			name: "h >= 1 and alpha absent",
			input: {
				mode: "oklch" as const,
				l: lightness50Percent,
				c: sampleChroma,
				h: sampleHue,
			},
			expected: "oklch(50% 0.2 30)",
		},
		{
			name: "h = 0 and alpha absent",
			input: {
				mode: "oklch" as const,
				l: lightness50Percent,
				c: sampleChroma,
				h: zeroHue,
			},
			expected: "oklch(50% 0.2 0)",
		},
		{
			name: "h = none and alpha absent",
			input: {
				mode: "oklch" as const,
				l: lightness50Percent,
				c: sampleChroma,
			},
			expected: "oklch(50% 0.2 none)",
		},
	] as const satisfies readonly TestCase[])("$name", ({ input, expected }) => {
		const actual = formatOklch(input);
		expect(actual).toBe(expected);
	});
});
