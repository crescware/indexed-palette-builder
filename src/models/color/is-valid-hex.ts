import { hexColor, pipe, safeParse, string } from "valibot";

const hexColor$ = pipe(string(), hexColor());

export function isValidHex(hex: string): boolean {
	return safeParse(hexColor$, hex).success;
}
