import Big from "big.js";
import { describe, expect, test } from "vitest";

import { getClosestShade } from "./get-closest-shade";
import { orangePattern, redPattern } from "./select-pattern";

// get-closest-shade.ts uses strict bounds Big(65).lt(h) and Big(0.75).lt(l).
const orangeBoundaryHueLowerExclusive = Big(65);
const orangeBoundaryLightnessLowerExclusive = Big("0.75");
const justInsideOrangeBoundary = {
	h: orangeBoundaryHueLowerExclusive.plus(1),
	l: orangeBoundaryLightnessLowerExclusive.plus("0.001"),
} as const;
const exactlyOnOrangeBoundary = {
	h: orangeBoundaryHueLowerExclusive,
	l: orangeBoundaryLightnessLowerExclusive.plus("0.001"),
} as const;

describe("getClosestShade()", () => {
	test("uses hue=0 fallback when hue is undefined", () => {
		// Use the exact redPattern 500 anchor to avoid testing neighbor-distance behavior.
		const actual = getClosestShade(
			{
				mode: "oklch",
				l: Big(redPattern[500].l),
				c: Big(redPattern[500].c),
			},
			redPattern,
		);

		expect(actual).toBe(500);
	});

	test("prefers 500 for orange boundary colors with competing 400/500 candidates", () => {
		const actual = getClosestShade(
			{
				mode: "oklch",
				l: justInsideOrangeBoundary.l,
				c: Big(orangePattern[400].c),
				h: justInsideOrangeBoundary.h,
			},
			orangePattern,
		);

		expect(actual).toBe(500);
	});

	test("does not apply orange boundary override at hue=65 (strict lower-exclusive)", () => {
		const actual = getClosestShade(
			{
				mode: "oklch",
				l: exactlyOnOrangeBoundary.l,
				c: Big(orangePattern[400].c),
				h: exactlyOnOrangeBoundary.h,
			},
			orangePattern,
		);

		expect(actual).toBe(400);
	});
});
