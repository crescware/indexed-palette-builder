import type Big from "big.js";

import type { Pattern, Shade } from "./select-pattern";

type Closest = Readonly<{
	shade: Shade;
	diff: Big;
}>;

type Return = Readonly<{
	closest: Closest;
	secondClosest: Closest | null;
}>;

export function calcClosest(pattern: Pattern, l: Big): Return {
	const sortedCandidates = Object.entries(pattern)
		.reduce<Closest[]>((acc, [shadeStr, values]) => {
			const diff = l.minus(values.l).abs();
			acc.push({ shade: Number(shadeStr) as Shade, diff });
			return acc;
		}, [])
		.sort((a, b) => a.diff.minus(b.diff).toNumber());

	const [closest, secondClosest] = sortedCandidates;

	return { closest, secondClosest: secondClosest ?? null };
}
