import { type Accessor, createSignal, onMount } from "solid-js";
import { isServer } from "solid-js/web";

import { storageKeys } from "../constants/storage";
import type { Theme } from "../models/theme";

const defaultTheme = "system" as const satisfies Theme;

type UseThemeReturn = Readonly<{
	theme: Accessor<Theme>;
	applyTheme: (newTheme: Theme) => void;
	resetTheme: () => void;
}>;

export function useTheme(): UseThemeReturn {
	const [theme, setTheme] = createSignal<Theme>(defaultTheme);

	const applyTheme = (newTheme: Theme) => {
		if (isServer) {
			return;
		}

		const root = document.documentElement;

		const preferredTheme =
			newTheme === "system"
				? window.matchMedia("(prefers-color-scheme: dark)").matches
					? "dark"
					: "light"
				: newTheme;

		if (preferredTheme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}

		setTheme(newTheme);
		localStorage.setItem(storageKeys.theme, newTheme);
	};

	const resetTheme = () => {
		applyTheme(defaultTheme);
	};

	onMount(() => {
		const savedTheme = localStorage.getItem(storageKeys.theme) as Theme | null;
		if (
			savedTheme === "light" ||
			savedTheme === "dark" ||
			savedTheme === "system"
		) {
			applyTheme(savedTheme);
		} else {
			applyTheme(theme());
		}
	});

	return { theme, applyTheme, resetTheme };
}
