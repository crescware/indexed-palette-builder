import fg from "fast-glob";
import { readFileSync } from "node:fs";

type LintError = Readonly<{
	file: string;
	matches: readonly string[];
}>;

async function main() {
	const pattern = /\bm[trblxyes]?-(\d+|auto|px)/g;
	const files = await fg("src/**/*.{tsx,jsx}");

	const errors: readonly LintError[] = files.reduce(
		(
			acc: /* readwrite */ LintError[],
			file: string,
		): /* readwrite */ LintError[] => {
			const content = readFileSync(file, "utf-8");
			const matches = content.match(pattern);
			if (matches) {
				acc.push({ file, matches });
			}
			return acc;
		},
		[] as /* readwrite */ LintError[],
	);

	if (errors.length === 0) {
		console.log("✅ No margin errors found");
		return;
	}

	errors.forEach(({ file, matches }) => {
		console.error(`❌ ${file}: ${matches.join(", ")}`);
	});

	process.exit(1);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
