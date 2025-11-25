import { ValiError } from "valibot";
import { describe, expect, test } from "vitest";
import { parseAsOklch } from "./parse-as-oklch";

describe("parseAsOklch", () => {
	describe("valid inputs", () => {
		test.each([
			{
				input: "oklch(0.63 0.22 250)",
				expected: { mode: "oklch", l: 0.63, c: 0.22, h: 250 },
				description: "space-separated OKLCH values",
			},
			{
				input: "oklch(0.63, 0.22, 250)",
				expected: { mode: "oklch", l: 0.63, c: 0.22, h: 250 },
				description: "comma-separated OKLCH values",
			},
			{
				input: "  oklch( 0.63  0.22  250 )  ",
				expected: { mode: "oklch", l: 0.63, c: 0.22, h: 250 },
				description: "extra whitespace",
			},
			{
				input: "OKLCH(0.63 0.22 250)",
				expected: { mode: "oklch", l: 0.63, c: 0.22, h: 250 },
				description: "case-insensitive oklch keyword",
			},
			{
				input: "oklch(0 0 0)",
				expected: { mode: "oklch", l: 0, c: 0, h: 0 },
				description: "edge case values (L=0, C=0, H=0)",
			},
			{
				input: "oklch(1 0.4 360)",
				expected: { mode: "oklch", l: 1, c: 0.4, h: 360 },
				description: "edge case values (L=1, C=0.4, H=360)",
			},
		])("should parse $description", ({ input, expected }) => {
			expect(parseAsOklch(input)).toEqual(expected);
		});
	});

	describe("valid syntax but invalid values", () => {
		test.each([
			{
				input: "oklch(-0.1 0.22 250)",
				description: "out-of-range lightness (negative)",
			},
			{
				input: "oklch(1.1 0.22 250)",
				description: "out-of-range lightness (>1)",
			},
			{
				input: "oklch(0.63 -0.1 250)",
				description: "out-of-range chroma (negative)",
			},
			{
				input: "oklch(0.63 0.5 250)",
				description: "out-of-range chroma (>0.4)",
			},
			{
				input: "oklch(0.63 0.22 -10)",
				description: "out-of-range hue (negative)",
			},
			{
				input: "oklch(0.63 0.22 361)",
				description: "out-of-range hue (>360)",
			},
		])("should throw ValiError for $description", ({ input }) => {
			expect(() => parseAsOklch(input)).toThrow(ValiError);
		});
	});

	describe("invalid syntax", () => {
		test.each([
			{
				input: "0.63 0.22 250",
				description: "values without oklch() wrapper",
			},
			{
				input: "0.63, 0.22, 250",
				description: "comma-separated values without wrapper",
			},
			{
				input: "oklch(0.63 0.22 250",
				description: "incomplete wrapper (missing closing)",
			},
			{
				input: "0.63 0.22 250)",
				description: "incomplete wrapper (missing opening)",
			},
			{
				input: "oklch(0.63 0.22)",
				description: "wrong number of values (2)",
			},
			{
				input: "oklch(0.63)",
				description: "wrong number of values (1)",
			},
			{
				input: "oklch(0.63 0.22 250 100)",
				description: "wrong number of values (4)",
			},
			{
				input: "oklch(abc 0.22 250)",
				description: "non-numeric lightness",
			},
			{
				input: "oklch(0.63 xyz 250)",
				description: "non-numeric chroma",
			},
			{
				input: "oklch(0.63 0.22 abc)",
				description: "non-numeric hue",
			},
			{
				input: "",
				description: "empty string",
			},
			{
				input: "oklch()",
				description: "just oklch()",
			},
		])("should throw ValiError for $description", ({ input }) => {
			expect(() => parseAsOklch(input)).toThrow(ValiError);
		});
	});
});
