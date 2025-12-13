import { CssExport } from "../components/css-export";
import { Header } from "../components/header";
import { Loading } from "../components/loading";
import { PaletteBuilder } from "../components/palette-builder";
import { useShowEdgeShades } from "../contexts/show-edge-shades/use-show-edge-shades";

export default function Home() {
	const { isLoading } = useShowEdgeShades();

	return (
		<div class="flex justify-center h-screen bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300">
			<Loading enabled={isLoading()}>
				<main class="text-center h-full flex flex-col max-w-7xl w-full animate-fade-in">
					<Header />

					<div class="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-4 w-full flex-1 min-h-0 px-4 pb-4">
						<PaletteBuilder />
						<CssExport />
					</div>
				</main>
			</Loading>
		</div>
	);
}
