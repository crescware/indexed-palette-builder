export function extractHue(color: string): number | null {
	const match = color.match(/oklch\([^)]+\s+([\d.]+)\)/);
	return match ? Number.parseFloat(match[1]) : null;
}
