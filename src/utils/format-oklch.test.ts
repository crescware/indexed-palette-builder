import Big from "big.js";
import { describe, expect, test } from "vitest";

import { formatOklch } from "./format-oklch";

describe("formatOklch()", () => {
	test("formats OKLCH without alpha", () => {
		const result = formatOklch({
			mode: "oklch",
			l: Big("0.5"),
			c: Big("0.2"),
			h: Big("30"),
		});

		expect(result).toBe("oklch(50% 0.2 30)");
	});

	test("does not include alpha even when present on input", () => {
		const result = formatOklch({
			mode: "oklch",
			l: Big("0.5"),
			c: Big("0.2"),
			h: Big("30"),
			alpha: Big("0.5"),
		});

		expect(result).toBe("oklch(50% 0.2 30)");
	});
});
