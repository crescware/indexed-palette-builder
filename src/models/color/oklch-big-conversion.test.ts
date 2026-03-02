import Big from "big.js";
import { converter, formatHex } from "culori";
import { describe, expect, test } from "vitest";

import { formatHexFromOklchBig } from "./format-hex-from-oklch-big";
import { toOklchBig } from "./to-oklch-big";

const toOklch = converter("oklch");
const pureRedHex = "#ff0000";
const mediumGrayHex = "#808080";

describe("Hex <-> OklchBig conversion wrappers", () => {
	test("toOklchBig returns null for invalid hex", () => {
		expect(toOklchBig("invalid")).toBeNull();
	});

	test("toOklchBig matches culori converter for chromatic hex", () => {
		const culoriOklch = toOklch(pureRedHex);
		if (!culoriOklch) {
			throw new Error("Expected culori to convert valid hex");
		}

		const actual = toOklchBig(pureRedHex);
		if (!actual) {
			throw new Error("Expected toOklchBig to convert valid hex");
		}

		expect(actual.mode).toBe("oklch");
		expect(actual.l).toEqual(Big(culoriOklch.l));
		expect(actual.c).toEqual(Big(culoriOklch.c));
		expect(actual.h).toEqual(
			culoriOklch.h === undefined ? undefined : Big(culoriOklch.h),
		);
	});

	test("toOklchBig keeps hue undefined for achromatic hex", () => {
		const actual = toOklchBig(mediumGrayHex);
		if (!actual) {
			throw new Error("Expected toOklchBig to convert valid hex");
		}

		expect(Object.hasOwn(actual, "h")).toBe(false);
		expect(actual.h).toBeUndefined();
	});

	test("formatHexFromOklchBig matches culori formatHex", () => {
		const source = toOklch(pureRedHex);
		if (!source) {
			throw new Error("Expected culori to convert valid hex");
		}

		const expected = formatHex(source);
		const actual = formatHexFromOklchBig({
			mode: "oklch",
			l: Big(source.l),
			c: Big(source.c),
			...(source.h !== undefined && { h: Big(source.h) }),
		});

		expect(actual).toBe(expected);
	});

	test("formatHexFromOklchBig works when hue is absent", () => {
		const expected = formatHex({ mode: "oklch", l: 0.5, c: 0 });
		const actual = formatHexFromOklchBig({
			mode: "oklch",
			l: Big("0.5"),
			c: Big(0),
		});

		expect(actual).toBe(expected);
	});
});
