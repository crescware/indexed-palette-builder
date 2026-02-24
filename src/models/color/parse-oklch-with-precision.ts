import { type Oklch, parse } from "culori";

import { extractPreciseValue } from "./extract-precise-value";
import type { OklchBig } from "./oklch-big";

type OklchComponentInput = Readonly<{
	lightness: string;
	chroma: string;
	hue: string | null;
	alpha: string | null;
}>;

function extractOklchComponentInput(input: string): OklchComponentInput | null {
	const bodyMatch = input.match(/^oklch\(\s*(.+)\s*\)$/i);
	if (!bodyMatch) {
		return null;
	}

	const body = bodyMatch[1];
	const slashIndex = body.indexOf("/");
	const colorSection =
		slashIndex >= 0 ? body.slice(0, slashIndex).trim() : body.trim();
	const alphaSection =
		slashIndex >= 0 ? body.slice(slashIndex + 1).trim() : null;

	const colorTokens = colorSection.split(/[\s,]+/).filter(Boolean);
	if (colorTokens.length < 2) {
		return null;
	}

	return {
		lightness: colorTokens[0],
		chroma: colorTokens[1],
		hue: colorTokens[2] ?? null,
		alpha: alphaSection && alphaSection.length > 0 ? alphaSection : null,
	};
}

function hasPercentageSuffix(value: string): boolean {
	return value.trim().endsWith("%");
}

/**
 * Parses an OKLCH color string with precision preservation.
 *
 * Uses culori for syntax validation and parsing, then extracts precise values
 * from the original string using integer-anchored matching to avoid
 * floating-point artifacts.
 *
 * @param input - The OKLCH color string (e.g., "oklch(68.1% 0.162 75.834)")
 * @returns OklchBig with Big.js values, or null if parsing fails
 */
export function parseOklchWithPrecision(input: string): OklchBig | null {
	const parsed = parse(input);
	if (!parsed || parsed.mode !== "oklch") {
		return null;
	}
	const oklch = parsed as Oklch;
	const componentInput = extractOklchComponentInput(input);

	const lightnessInput = componentInput?.lightness ?? `${oklch.l}`;
	const chromaInput = componentInput?.chroma ?? `${oklch.c}`;

	const l = extractPreciseValue(
		lightnessInput,
		oklch.l,
		hasPercentageSuffix(lightnessInput),
	);
	const c = extractPreciseValue(chromaInput, oklch.c, false);
	const hueInput =
		componentInput?.hue ?? (oklch.h !== undefined ? `${oklch.h}` : null);
	const alphaInput =
		componentInput?.alpha ??
		(oklch.alpha !== undefined ? `${oklch.alpha}` : null);

	return {
		mode: "oklch",
		l,
		c,
		...(oklch.h !== undefined && {
			h: extractPreciseValue(hueInput ?? `${oklch.h}`, oklch.h, false),
		}),
		...(oklch.alpha !== undefined && {
			alpha: extractPreciseValue(
				alphaInput ?? `${oklch.alpha}`,
				oklch.alpha,
				hasPercentageSuffix(alphaInput ?? `${oklch.alpha}`),
			),
		}),
	};
}
