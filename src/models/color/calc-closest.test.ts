import Big from "big.js";
import { describe, expect, test } from "vitest";

import { calcClosest } from "./calc-closest";
import { redPattern, type Shade } from "./select-pattern";

describe("calcClosest()", () => {
	test("returns secondClosest as null when only one candidate exists", () => {
		const singleCandidatePattern = { ...redPattern };
		const shadesToHide =
			[0, 50, 100, 200, 300, 400, 600, 700, 800, 900, 950, 1000] as const satisfies readonly Shade[];
		for (const shade of shadesToHide) {
			Object.defineProperty(singleCandidatePattern, shade, {
				enumerable: false,
			});
		}

		const actual = calcClosest(singleCandidatePattern, Big(redPattern[500].l));

		expect.soft(actual.closest.shade).toBe(500);
		expect.soft(actual.secondClosest).toBeNull();
	});
});
