import { formatHex } from "culori";

import type { OklchBig } from "./oklch-big";

/**
 * Converts an OklchBig color to a hex string.
 */
export function formatHexFromOklchBig(color: OklchBig): string {
	return formatHex({
		mode: "oklch",
		l: color.l.toNumber(),
		c: color.c.toNumber(),
		...(color.h !== undefined && { h: color.h.toNumber() }),
	});
}
