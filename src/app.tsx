import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";

import "./app.css";
import { ColorFormatProvider } from "./contexts/color-format/color-format-context";
import { ColorsProvider } from "./contexts/colors/colors-context";
import { EditModeProvider } from "./contexts/edit-mode/edit-mode-context";
import { SettingsProvider } from "./contexts/settings/settings-context";
import { ShowEdgeShadesProvider } from "./contexts/show-edge-shades/show-edge-shades-context";
import { ThemeProvider } from "./contexts/theme/theme-context";
import { ThemeLoader } from "./theme-loader";

export default function App() {
	return (
		<Router
			root={(props) => (
				<ThemeProvider>
					<ShowEdgeShadesProvider>
						<ColorFormatProvider>
							<ColorsProvider>
								<SettingsProvider>
									<EditModeProvider>
										<ThemeLoader />
										<Suspense>{props.children}</Suspense>
									</EditModeProvider>
								</SettingsProvider>
							</ColorsProvider>
						</ColorFormatProvider>
					</ShowEdgeShadesProvider>
				</ThemeProvider>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
