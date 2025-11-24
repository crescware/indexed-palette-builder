// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

const app = document.getElementById("app");
if (!app) {
	throw new Error("App not found");
}

mount(() => <StartClient />, app);
