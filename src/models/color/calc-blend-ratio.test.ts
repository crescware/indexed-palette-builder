import Big from "big.js";
import { describe, expect, test } from "vitest";

import { calcBlendRatio } from "./calc-blend-ratio";

type ShadesAround = Parameters<typeof calcBlendRatio>[2];

const shadesAroundFor50 = {
	above: [100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
	below: [],
} as const satisfies ShadesAround;

const shadesAroundFor300 = {
	above: [400, 500, 600, 700, 800, 900, 950],
	below: [200, 100, 50],
} as const satisfies ShadesAround;

const shadesAroundFor500 = {
	above: [600, 700, 800, 900, 950],
	below: [400, 300, 200, 100, 50],
} as const satisfies ShadesAround;

const shadesAroundFor700 = {
	above: [800, 900, 950],
	below: [600, 500, 400, 300, 200, 100, 50],
} as const satisfies ShadesAround;

const shadesAroundFor950 = {
	above: [],
	below: [900, 800, 700, 600, 500, 400, 300, 200, 100, 50],
} as const satisfies ShadesAround;

describe("calcBlendRatio()", () => {
	describe("edge shades", () => {
		test("returns 1.0 for shade 0 and 1000", () => {
			const actual = ([0, 1000] as const).map((shade) =>
				calcBlendRatio(shade, 500, shadesAroundFor500),
			);

			expect(actual).toEqual([Big(1), Big(1)]);
		});
	});

	describe("shades above closest", () => {
		test("returns gradual ratio when shadesAround.above has elements", () => {
			const actual = shadesAroundFor500.above.map((shade) =>
				calcBlendRatio(shade, 500, shadesAroundFor500),
			);

			expect(actual).toEqual([
				Big(1).div(5),
				Big(2).div(5),
				Big(3).div(5),
				Big(4).div(5),
				Big(5).div(5),
			]);
		});

		test("returns 1.0 when shadesAround.above is empty", () => {
			expect(calcBlendRatio(1000, 950, shadesAroundFor950)).toEqual(Big(1));
		});
	});

	describe("shades below closest", () => {
		test("returns gradual ratio when shadesAround.below has elements", () => {
			const actual = shadesAroundFor500.below.map((shade) =>
				calcBlendRatio(shade, 500, shadesAroundFor500),
			);

			expect(actual).toEqual([
				Big(5).div(5),
				Big(4).div(5),
				Big(3).div(5),
				Big(2).div(5),
				Big(1).div(5),
			]);
		});

		test("returns 1.0 when shadesAround.below is empty", () => {
			expect(calcBlendRatio(0, 50, shadesAroundFor50)).toEqual(Big(1));
		});
	});

	describe("closest shade itself", () => {
		test("returns 1.0 when shade equals closestShade", () => {
			expect(calcBlendRatio(500, 500, shadesAroundFor500)).toEqual(Big(1));
		});
	});

	describe("closestShade = 300", () => {
		test("returns gradual ratio for shades above", () => {
			const actual = shadesAroundFor300.above.map((shade) =>
				calcBlendRatio(shade, 300, shadesAroundFor300),
			);

			expect(actual).toEqual([
				Big(1).div(7),
				Big(2).div(7),
				Big(3).div(7),
				Big(4).div(7),
				Big(5).div(7),
				Big(6).div(7),
				Big(7).div(7),
			]);
		});

		test("returns gradual ratio for shades below", () => {
			const actual = shadesAroundFor300.below.map((shade) =>
				calcBlendRatio(shade, 300, shadesAroundFor300),
			);

			expect(actual).toEqual([Big(3).div(3), Big(2).div(3), Big(1).div(3)]);
		});
	});

	describe("closestShade = 700", () => {
		test("returns gradual ratio for shades above", () => {
			const actual = shadesAroundFor700.above.map((shade) =>
				calcBlendRatio(shade, 700, shadesAroundFor700),
			);

			expect(actual).toEqual([Big(1).div(3), Big(2).div(3), Big(3).div(3)]);
		});

		test("returns gradual ratio for shades below", () => {
			const actual = shadesAroundFor700.below.map((shade) =>
				calcBlendRatio(shade, 700, shadesAroundFor700),
			);

			expect(actual).toEqual([
				Big(7).div(7),
				Big(6).div(7),
				Big(5).div(7),
				Big(4).div(7),
				Big(3).div(7),
				Big(2).div(7),
				Big(1).div(7),
			]);
		});
	});
});
