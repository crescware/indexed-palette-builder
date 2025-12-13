import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

import "./app.css";
import { ColorsProvider } from "./contexts/colors/colors-context";
import { ThemeProvider } from "./contexts/theme/theme-context";
import { ThemeLoader } from "./theme-loader";

export default function App() {
	return (
		<Router
			root={(props) => (
				<ThemeProvider>
					<ColorsProvider>
						<ThemeLoader />
						<Suspense>{props.children}</Suspense>
					</ColorsProvider>
				</ThemeProvider>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
