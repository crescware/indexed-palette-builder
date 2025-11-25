import type { Oklch } from "culori";
import {
	array,
	maxLength,
	maxValue,
	minLength,
	minValue,
	number,
	parse,
	pipe,
	regex,
	strictObject,
	string,
} from "valibot";

const oklchString$ = pipe(string(), regex(/^oklch\s*\(.+\)\s*$/i));
const parts$ = pipe(array(string()), minLength(3), maxLength(3));

const oklchValues$ = strictObject({
	l: pipe(number(), minValue(0), maxValue(1)),
	c: pipe(number(), minValue(0), maxValue(0.4)),
	h: pipe(number(), minValue(0), maxValue(360)),
});

export function parseAsOklch(str: string): Oklch {
	const trimmed = parse(oklchString$, str.trim());

	const cleaned = trimmed
		.replace(/^oklch\s*\(\s*/i, "")
		.replace(/\s*\)\s*$/, "");

	const parts = cleaned
		.split(/[,\s]+/)
		.map((p) => p.trim())
		.filter((p) => 0 < p.length);

	const parsedParts = parse(parts$, parts);
	const [l, c, h] = parsedParts.map((p) => Number.parseFloat(p));
	const parsed = parse(oklchValues$, { l, c, h });

	return { ...parsed, mode: "oklch" };
}
