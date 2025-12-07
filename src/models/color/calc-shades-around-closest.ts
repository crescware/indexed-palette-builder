import type { Shade } from "./select-pattern";

type Return = Readonly<{
	above: readonly Shade[];
	below: readonly Shade[];
}>;

export function calcShadesAroundClosest(
	shades: readonly Shade[],
	closestShade: Shade,
): Return {
	const filtered = shades.filter((v) => 50 <= v && v <= 950);

	return {
		above: filtered.filter((v) => closestShade < v),
		below: filtered.filter((v) => v < closestShade),
	};
}
