import Big from "big.js";
import { describe, expect, test } from "vitest";

import { getClosestShade } from "./get-closest-shade";
import { redPattern } from "./select-pattern";

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
});
