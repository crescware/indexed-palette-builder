export const storagePrefix = "indexed-palette-builder:";

export const storageKeys = {
	theme: `${storagePrefix}theme`,
	showEdgeShades: `${storagePrefix}showEdgeShades`,
	palettes: `${storagePrefix}palettes`,
	colorFormat: `${storagePrefix}colorFormat`,
} as const;
