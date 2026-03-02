import Big from "big.js";
import { describe, expect, test } from "vitest";

import { redPattern, selectPattern } from "./select-pattern";

// select-pattern.ts defines red$ lower bound with minValue(0).
const redHueLowerBound = Big(0);
const justBelowRedHueLowerBound = redHueLowerBound.minus(1);

describe("selectPattern()", () => {
	test("uses hue=0 fallback when hue is undefined", () => {
		const actual = selectPattern({
			mode: "oklch",
			// Use redPattern[500] anchors instead of ad-hoc literals.
			l: Big(redPattern[500].l),
			c: Big(redPattern[500].c),
		});

		expect(actual).toBe(redPattern);
	});

	test("throws when hue is outside all supported ranges", () => {
		// select-pattern.ts defines red hue lower bound at 0.
		expect(() =>
			selectPattern({
				mode: "oklch",
				l: Big(redPattern[500].l),
				c: Big(redPattern[500].c),
				h: justBelowRedHueLowerBound,
			}),
		).toThrow("never reached");
	});
});
