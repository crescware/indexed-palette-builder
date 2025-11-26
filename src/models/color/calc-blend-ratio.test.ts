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

			expect(actual).toEqual([1.0, 1.0]);
		});
	});

	describe("shades above closest", () => {
		test("returns gradual ratio when shadesAround.above has elements", () => {
			const actual = shadesAroundFor500.above.map((shade) =>
				calcBlendRatio(shade, 500, shadesAroundFor500),
			);

			expect(actual).toEqual([1 / 5, 2 / 5, 3 / 5, 4 / 5, 5 / 5]);
		});

		test("returns 1.0 when shadesAround.above is empty", () => {
			expect(calcBlendRatio(1000, 950, shadesAroundFor950)).toBe(1.0);
		});
	});

	describe("shades below closest", () => {
		test("returns gradual ratio when shadesAround.below has elements", () => {
			const actual = shadesAroundFor500.below.map((shade) =>
				calcBlendRatio(shade, 500, shadesAroundFor500),
			);

			expect(actual).toEqual([5 / 5, 4 / 5, 3 / 5, 2 / 5, 1 / 5]);
		});

		test("returns 1.0 when shadesAround.below is empty", () => {
			expect(calcBlendRatio(0, 50, shadesAroundFor50)).toBe(1.0);
		});
	});

	describe("closest shade itself", () => {
		test("returns 1.0 when shade equals closestShade", () => {
			expect(calcBlendRatio(500, 500, shadesAroundFor500)).toBe(1.0);
		});
	});

	describe("closestShade = 300", () => {
		test("returns gradual ratio for shades above", () => {
			const actual = shadesAroundFor300.above.map((shade) =>
				calcBlendRatio(shade, 300, shadesAroundFor300),
			);

			expect(actual).toEqual([1 / 7, 2 / 7, 3 / 7, 4 / 7, 5 / 7, 6 / 7, 7 / 7]);
		});

		test("returns gradual ratio for shades below", () => {
			const actual = shadesAroundFor300.below.map((shade) =>
				calcBlendRatio(shade, 300, shadesAroundFor300),
			);

			expect(actual).toEqual([3 / 3, 2 / 3, 1 / 3]);
		});
	});

	describe("closestShade = 700", () => {
		test("returns gradual ratio for shades above", () => {
			const actual = shadesAroundFor700.above.map((shade) =>
				calcBlendRatio(shade, 700, shadesAroundFor700),
			);

			expect(actual).toEqual([1 / 3, 2 / 3, 3 / 3]);
		});

		test("returns gradual ratio for shades below", () => {
			const actual = shadesAroundFor700.below.map((shade) =>
				calcBlendRatio(shade, 700, shadesAroundFor700),
			);

			expect(actual).toEqual([7 / 7, 6 / 7, 5 / 7, 4 / 7, 3 / 7, 2 / 7, 1 / 7]);
		});
	});
});
