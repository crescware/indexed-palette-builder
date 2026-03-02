import Big from "big.js";
import { describe, expect, test } from "vitest";

import { extractPreciseValue } from "./extract-precise-value";

const tokenA = "0.12";
const tokenB = "0.19";
const tokenC = "0.3";
const culoriValueMatchingTokenB = Number(tokenB);

describe("extractPreciseValue()", () => {
	test("selects nearest candidate when multiple numeric tokens share integer part", () => {
		const actual = extractPreciseValue(
			`${tokenA} ${tokenB} ${tokenC}`,
			culoriValueMatchingTokenB,
			false,
		);
		expect(actual).toEqual(Big(tokenB));
	});

	test("selects nearest percent candidate and converts it to normalized value", () => {
		// 0.19% is 0.0019 after /100 normalization.
		const actual = extractPreciseValue(
			`${tokenA}% ${tokenB}% ${tokenC}%`,
			culoriValueMatchingTokenB / 100,
			true,
		);
		expect(actual).toEqual(Big(tokenB).div(100));
	});
});
