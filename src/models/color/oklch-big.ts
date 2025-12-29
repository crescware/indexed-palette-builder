import type Big from "big.js";

/**
 * OKLCH color representation using Big.js for precise decimal arithmetic.
 * Prevents floating-point artifacts that occur with JavaScript numbers.
 */
export type OklchBig = Readonly<{
	mode: "oklch";
	/** Lightness in 0-1 range (normalized from percentage) */
	l: Big;
	/** Chroma (unbounded, typically 0-0.4 for sRGB colors) */
	c: Big;
	/** Hue in degrees (0-360). Property does not exist for achromatic colors. */
	h?: Big;
	/** Alpha channel (0-1). Property does not exist when fully opaque. */
	alpha?: Big;
}>;
