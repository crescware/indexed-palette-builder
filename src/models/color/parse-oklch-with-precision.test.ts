import Big from "big.js";
import { describe, expect, test } from "vitest";

import { parseOklchWithPrecision } from "./parse-oklch-with-precision";

describe("parseOklchWithPrecision()", () => {
	describe("invalid input", () => {
		test.each([
			{ name: "empty string", input: "" },
			{ name: "invalid color string", input: "not a color" },
			{ name: "hex color", input: "#ff0000" },
			{ name: "rgb color", input: "rgb(255, 0, 0)" },
			{ name: "hsl color", input: "hsl(0, 100%, 50%)" },
			{ name: "incomplete OKLCH", input: "oklch(50% 0)" },
		])("returns null for $name", ({ input }) => {
			expect.soft(parseOklchWithPrecision(input)).toBeNull();
		});
	});

	describe("valid OKLCH with hue", () => {
		test.each([
			{
				name: "percentage lightness",
				input: "oklch(68.1% 0.162 75.834)",
				expected: { l: "0.681", c: "0.162", h: "75.834" },
			},
			{
				name: "decimal lightness",
				input: "oklch(0.681 0.162 75.834)",
				expected: { l: "0.681", c: "0.162", h: "75.834" },
			},
			{
				name: "hue of 0",
				input: "oklch(50% 0 0)",
				expected: { l: "0.5", c: "0", h: "0" },
			},
			{
				name: "hue of 360",
				input: "oklch(100% 0 360)",
				expected: { l: "1", c: "0", h: "360" },
			},
		])("parses $name correctly", ({ input, expected }) => {
			const result = parseOklchWithPrecision(input);
			if (!result) {
				throw new Error("Expected result to not be null");
			}

			expect.soft(result.mode).toBe("oklch");
			expect.soft(Object.hasOwn(result, "h")).toBe(true);
			expect.soft(result.l).toEqual(Big(expected.l));
			expect.soft(result.c).toEqual(Big(expected.c));
			expect.soft(result.h).toEqual(Big(expected.h));
		});
	});

	describe("OKLCH with none keyword for hue", () => {
		test.each([
			{
				input: "oklch(50% 0 none)",
				expected: { l: "0.5", c: "0" },
			},
			{
				input: "oklch(75% 0.05 none)",
				expected: { l: "0.75", c: "0.05" },
			},
			{
				input: "oklch(100% 0 none)",
				expected: { l: "1", c: "0" },
			},
		])("h property does not exist for $input", ({ input, expected }) => {
			const result = parseOklchWithPrecision(input);
			if (!result) {
				throw new Error("Expected result to not be null");
			}

			expect.soft(Object.hasOwn(result, "h")).toBe(false);
			expect.soft(result.h).toBeUndefined();
			expect.soft(result.l).toEqual(Big(expected.l));
			expect.soft(result.c).toEqual(Big(expected.c));
		});
	});

	describe("OKLCH with alpha", () => {
		test.each([
			{
				input: "oklch(50% 0.2 30 / 0.5)",
				expected: { alpha: "0.5" },
			},
			{
				input: "oklch(75% 0.1 180 / 0.8)",
				expected: { alpha: "0.8" },
			},
			{
				input: "oklch(100% 0 0 / 1)",
				expected: { alpha: "1" },
			},
		])("alpha property exists for $input", ({ input, expected }) => {
			const result = parseOklchWithPrecision(input);
			if (!result) {
				throw new Error("Expected result to not be null");
			}

			expect.soft(Object.hasOwn(result, "alpha")).toBe(true);
			expect.soft(result.alpha).toEqual(Big(expected.alpha));
		});

		test("alpha property does not exist when not specified", () => {
			const result = parseOklchWithPrecision("oklch(50% 0.2 30)");
			if (!result) {
				throw new Error("Expected result to not be null");
			}

			expect.soft(Object.hasOwn(result, "alpha")).toBe(false);
			expect.soft(result.alpha).toBeUndefined();
		});

		test("parses OKLCH with none hue and alpha", () => {
			const result = parseOklchWithPrecision("oklch(50% 0 none / 0.8)");
			if (!result) {
				throw new Error("Expected result to not be null");
			}

			expect.soft(Object.hasOwn(result, "h")).toBe(false);
			expect.soft(Object.hasOwn(result, "alpha")).toBe(true);
			expect.soft(result.alpha).toEqual(Big("0.8"));
		});
	});

	describe("precision preservation", () => {
		test.each([
			{
				input: "oklch(72.345% 0.123456 89.012)",
				expected: { l: "0.72345", c: "0.123456", h: "89.012" },
			},
			{
				input: "oklch(100% 0 360)",
				expected: { l: "1", c: "0", h: "360" },
			},
			{
				input: "oklch(0% 0.4 0)",
				expected: { l: "0", c: "0.4", h: "0" },
			},
		])("preserves precision for $input", ({ input, expected }) => {
			const result = parseOklchWithPrecision(input);
			if (!result) {
				throw new Error("Expected result to not be null");
			}

			expect.soft(result.l.toString()).toBe(expected.l);
			expect.soft(result.c.toString()).toBe(expected.c);
			expect.soft(result.h?.toString()).toBe(expected.h);
		});
	});
});
