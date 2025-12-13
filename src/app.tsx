import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

import "./app.css";
import { ColorsProvider } from "./contexts/colors/colors-context";
import { ShowEdgeShadesProvider } from "./contexts/show-edge-shades/show-edge-shades-context";
import { ThemeProvider } from "./contexts/theme/theme-context";
import { ThemeLoader } from "./theme-loader";

export default function App() {
	return (
		<Router
			root={(props) => (
				<ThemeProvider>
					<ShowEdgeShadesProvider>
						<ColorsProvider>
							<ThemeLoader />
							<Suspense>{props.children}</Suspense>
						</ColorsProvider>
					</ShowEdgeShadesProvider>
				</ThemeProvider>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
