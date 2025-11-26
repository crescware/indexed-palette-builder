import type { Shade } from "./select-pattern";

type Return = Readonly<{
	above: readonly Shade[];
	below: readonly Shade[];
}>;

export function calcShadesAroundClosest(
	shades: readonly Shade[],
	closestShade: Shade,
): Return {
	const lowerBoundary = 50;
	const upperBoundary = 950;

	return {
		above: shades.filter((s) => s > closestShade && s <= upperBoundary),
		below: shades.filter((s) => s < closestShade && s >= lowerBoundary),
	};
}
