export function ThemeLoader() {
	return (
		<script
			innerHTML={`
(function() {
  try {
    const localTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // If saved setting is dark, or if not set and system prefers dark
    if (localTheme === 'dark' || (!localTheme && systemDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    /* Prevent errors in SSR environment */
    return;
  }
})();
`}
		/>
	);
}
