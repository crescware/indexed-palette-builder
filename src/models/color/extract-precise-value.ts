import Big from "big.js";

type NumericToken = Readonly<{
	/** The raw numeric string without suffix */
	numericString: string;
	/** The parsed numeric value */
	value: number;
	/** The suffix if present (%, deg, rad, grad, turn) */
	suffix: string | null;
}>;

/**
 * Extracts all numeric tokens from an OKLCH color string.
 */
function extractNumericTokens(input: string): NumericToken[] {
	const pattern = /(-?\d+(?:\.\d+)?)(%|deg|rad|grad|turn)?/g;
	const matches = input.matchAll(pattern);

	return Array.from(matches, (match) => {
		const numericString = match[1];
		const suffix = match[2] ?? null;
		const value = Number.parseFloat(numericString);
		return { numericString, value, suffix };
	});
}

/**
 * Extracts a precise Big.js value from the original input string using the
 * integer part of culori's parsed value as an anchor.
 *
 * This preserves the exact decimal precision from the user's input, avoiding
 * floating-point artifacts introduced by JavaScript number parsing.
 *
 * @param input - The original OKLCH color string (e.g., "oklch(68.1% 0.162 75.834)")
 * @param culoriValue - The value parsed by culori (may have floating-point errors)
 * @param isPercentage - Whether the value in the string is expressed as a percentage
 * @returns Big.js value normalized to the standard range (percentages divided by 100)
 */
export function extractPreciseValue(
	input: string,
	culoriValue: number,
	isPercentage: boolean,
): Big {
	const displayValue = isPercentage ? culoriValue * 100 : culoriValue;
	const integerPart = Math.trunc(displayValue);

	const numericTokens = extractNumericTokens(input);

	for (const token of numericTokens) {
		const tokenInteger = Math.trunc(token.value);
		if (tokenInteger === integerPart) {
			const hasPercentSuffix = token.suffix === "%";
			if (hasPercentSuffix) {
				return Big(token.numericString).div(100);
			}
			return Big(token.numericString);
		}
	}

	return Big(culoriValue);
}
