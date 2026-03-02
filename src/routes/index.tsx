import { CssExport } from "../components/css-export";
import { Header } from "../components/header";
import { Loading } from "../components/loading";
import { PaletteBuilder } from "../components/palette-builder";
import { useShowEdgeShades } from "../contexts/show-edge-shades/use-show-edge-shades";

export default function Home() {
	const { isLoading } = useShowEdgeShades();

	return (
		<div class="flex justify-center h-screen bg-[var(--app-bg)] text-gray-700 dark:text-gray-300">
			<Loading enabled={isLoading()}>
				<main class="text-center h-full flex flex-col max-w-7xl w-full animate-fade-in pb-6">
					<Header />

					<div class="grid grid-cols-1 lg:grid-cols-[3fr_2fr] w-full flex-1 min-h-0">
						<PaletteBuilder />
						<CssExport />
					</div>
				</main>
			</Loading>
		</div>
	);
}
