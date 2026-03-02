import Big from "big.js";
import { describe, expect, test } from "vitest";

import { calcColor } from "./calc-color";
import { redPattern } from "./select-pattern";

type ShadesAround = Parameters<typeof calcColor>[5];

const noNeighborShades = {
	above: [],
	below: [],
} as const satisfies ShadesAround;

const twoStepAboveShades = {
	above: [600, 700],
	below: [400, 300, 200, 100, 50],
} as const satisfies ShadesAround;

// calc-color.ts defines maxChroma as 0.37.
const maxChromaDefinedInCalcColor = Big("0.37");

// For shade=600 with above=[600,700], calcBlendRatio(...) becomes 1/2.
const blendRatioForShade600 = Big(1).div(2);
const blendOverflowAmount = Big(1);
const inputChromaAtClampBoundary = maxChromaDefinedInCalcColor;
const calculatedChromaToForceClamp = inputChromaAtClampBoundary.plus(
	blendOverflowAmount.div(blendRatioForShade600),
);
const passthroughHue = Big(0);

describe("calcColor()", () => {
	test("returns input color when shade equals closestShade", () => {
		const input = {
			mode: "oklch" as const,
			l: Big(redPattern[500].l),
			c: Big(redPattern[500].c),
			h: passthroughHue,
		};

		const actual = calcColor(
			500,
			500,
			input,
			redPattern[500],
			Big(1),
			noNeighborShades,
		);

		expect(actual).toBe(input);
	});

	test("caps chroma at 0.37 when blended chroma exceeds max", () => {
		const actual = calcColor(
			600,
			500,
			{
				mode: "oklch",
				l: Big(redPattern[500].l),
				c: inputChromaAtClampBoundary,
				h: passthroughHue,
			},
			{
				l: redPattern[600].l,
				c: Number(calculatedChromaToForceClamp.toString()),
			},
			Big(1),
			twoStepAboveShades,
		);

		expect.soft(actual.l).toEqual(Big(redPattern[600].l));
		expect.soft(actual.c).toEqual(maxChromaDefinedInCalcColor);
		expect.soft(actual.h).toEqual(passthroughHue);
	});
});
