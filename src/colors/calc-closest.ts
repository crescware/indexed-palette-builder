import type { Pattern, Shade } from "./select-pattern";

type Closest = Readonly<{
	shade: Shade;
	diff: number;
}>;

type Return = Readonly<{
	closest: Closest;
	secondClosest: Closest | null;
}>;

export function calcClosest(pattern: Pattern, l: number): Return {
	const sortedCandidates = Object.entries(pattern)
		.reduce<Closest[]>((acc, [shadeStr, values]) => {
			const diff = Math.abs(l - values.l);
			acc.push({ shade: Number(shadeStr) as Shade, diff });
			return acc;
		}, [])
		.sort((a, b) => a.diff - b.diff);

	const [closest, secondClosest] = sortedCandidates;

	return { closest, secondClosest: secondClosest ?? null };
}
