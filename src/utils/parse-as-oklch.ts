import type { Oklch } from "culori";

export function parseAsOklch(str: string): Oklch {
	// Only accept valid CSS OKLCH format: "oklch(L C H)" or "oklch(L, C, H)"
	const trimmed = str.trim();

	// Check if it starts with "oklch(" and ends with ")"
	if (!/^oklch\s*\(/i.test(trimmed) || !/\)\s*$/.test(trimmed)) {
		throw new Error(
			`Invalid OKLCH syntax: expected format "oklch(L C H)" or "oklch(L, C, H)", got "${str}"`,
		);
	}

	// Remove "oklch(" prefix and ")" suffix
	const cleaned = trimmed
		.replace(/^oklch\s*\(\s*/i, "")
		.replace(/\s*\)\s*$/, "");

	// Split by comma or whitespace
	const parts = cleaned
		.split(/[,\s]+/)
		.map((p) => p.trim())
		.filter((p) => p.length > 0);

	if (parts.length !== 3) {
		throw new Error(
			`Invalid OKLCH syntax: expected 3 values (L, C, H), got ${parts.length} values`,
		);
	}

	const l = Number.parseFloat(parts[0]);
	const c = Number.parseFloat(parts[1]);
	const h = Number.parseFloat(parts[2]);

	// Validate parsed values
	if (Number.isNaN(l) || Number.isNaN(c) || Number.isNaN(h)) {
		throw new Error(
			`Invalid OKLCH values: all values must be numeric, got L="${parts[0]}", C="${parts[1]}", H="${parts[2]}"`,
		);
	}

	// Validate ranges (L: 0-1, C: 0-0.4, H: 0-360)
	if (l < 0 || l > 1) {
		throw new Error(
			`Invalid OKLCH lightness: must be between 0 and 1, got ${l}`,
		);
	}

	if (c < 0 || c > 0.4) {
		throw new Error(
			`Invalid OKLCH chroma: must be between 0 and 0.4, got ${c}`,
		);
	}

	if (h < 0 || h > 360) {
		throw new Error(`Invalid OKLCH hue: must be between 0 and 360, got ${h}`);
	}

	return {
		mode: "oklch",
		l,
		c,
		h,
	};
}
