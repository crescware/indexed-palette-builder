import type { calcClosest } from "./calc-closest";

export function hasCompetingMidShades(
	closest: ReturnType<typeof calcClosest>["closest"],
	secondClosest: ReturnType<typeof calcClosest>["secondClosest"],
): boolean {
	return (
		secondClosest !== null &&
		closest.shade === 400 &&
		secondClosest.shade === 500 &&
		closest.diff.minus(secondClosest.diff).abs().lt(0.015)
	);
}
