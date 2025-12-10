import { storageKeys } from "../constants/storage";

(() => {
  try {
    const localTheme = localStorage.getItem(storageKeys.theme);
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const isDark =
      localTheme === "dark" ||
      ((localTheme === "system" || !localTheme) && systemDark);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch {
    // Prevent errors in SSR environment
  }
})();
