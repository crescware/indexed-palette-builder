import Big from "big.js";
import { describe, expect, test } from "vitest";

import { detectStrongCorrection } from "./detect-strong-correction";
import { redPattern } from "./select-pattern";

// detect-strong-correction.ts correctionThresholds.lightnessDistance$.literal
const lightnessDistanceThresholdDefinedInDetectStrongCorrection = Big("0.05");
// Strict `lt(...)` branch needs a value just above the threshold.
const strictGreaterEpsilon = Big("0.001");
const baseRedHue = Big(0);
const midpointBetween400And500 = Big(redPattern[400].l)
	.plus(redPattern[500].l)
	.div(2);

describe("detectStrongCorrection()", () => {
	test("returns false when closest shade is outside 300-700 range", () => {
		const actual = detectStrongCorrection(
			{
				mode: "oklch",
				l: Big(redPattern[500].l),
				c: Big(redPattern[500].c),
				h: baseRedHue,
			},
			redPattern,
			200,
		);

		expect(actual).toBe(false);
	});

	test("returns true when lightness is far from any standard shade", () => {
		// closest.diff should be 0.051 (= threshold 0.05 + epsilon 0.001).
		const actual = detectStrongCorrection(
			{
				mode: "oklch",
				l: Big(redPattern[950].l).plus(
					lightnessDistanceThresholdDefinedInDetectStrongCorrection.plus(
						strictGreaterEpsilon,
					),
				),
				c: Big(redPattern[500].c),
				h: baseRedHue,
			},
			redPattern,
			500,
		);

		expect(actual).toBe(true);
	});

	test("returns true when closest and second closest are ambiguous", () => {
		// detect-strong-correction.ts correctionThresholds.lightnessAmbiguity$.literal = 0.02.
		// Midpoint makes diff delta zero, which is below that ambiguity threshold.
		const actual = detectStrongCorrection(
			{
				mode: "oklch",
				l: midpointBetween400And500,
				c: Big(redPattern[500].c),
				h: baseRedHue,
			},
			redPattern,
			500,
		);

		expect(actual).toBe(true);
	});
});
