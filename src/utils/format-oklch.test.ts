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

describe("formatOklch()", () => {
	test.each([
		{
			name: "h >= 1 and alpha present",
			input: {
				mode: "oklch" as const,
				l: Big("0.5"),
				c: Big("0.2"),
				h: Big("30"),
				alpha: Big("0.5"),
			},
			expected: "oklch(50% 0.2 30)",
		},
		{
			name: "h = 0 and alpha present",
			input: {
				mode: "oklch" as const,
				l: Big("0.5"),
				c: Big("0.2"),
				h: Big("0"),
				alpha: Big("0.5"),
			},
			expected: "oklch(50% 0.2 0)",
		},
		{
			name: "h = none and alpha present",
			input: {
				mode: "oklch" as const,
				l: Big("0.5"),
				c: Big("0.2"),
				alpha: Big("0.5"),
			},
			expected: "oklch(50% 0.2 none)",
		},
		{
			name: "h >= 1 and alpha absent",
			input: {
				mode: "oklch" as const,
				l: Big("0.5"),
				c: Big("0.2"),
				h: Big("30"),
			},
			expected: "oklch(50% 0.2 30)",
		},
		{
			name: "h = 0 and alpha absent",
			input: {
				mode: "oklch" as const,
				l: Big("0.5"),
				c: Big("0.2"),
				h: Big("0"),
			},
			expected: "oklch(50% 0.2 0)",
		},
		{
			name: "h = none and alpha absent",
			input: {
				mode: "oklch" as const,
				l: Big("0.5"),
				c: Big("0.2"),
			},
			expected: "oklch(50% 0.2 none)",
		},
	] as const satisfies readonly TestCase[])("$name", ({ input, expected }) => {
		const actual = formatOklch(input);
		expect(actual).toBe(expected);
	});
});
