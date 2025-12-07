import type { calcClosest } from "./calc-closest";

export function hasCompetingMidShades(
	closest: ReturnType<typeof calcClosest>["closest"],
	secondClosest: ReturnType<typeof calcClosest>["secondClosest"],
): boolean {
	return (
		secondClosest !== null &&
		closest.shade === 400 &&
		secondClosest.shade === 500 &&
		Math.abs(closest.diff - secondClosest.diff) < 0.015
	);
}
