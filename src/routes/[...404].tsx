import { A } from "@solidjs/router";

export default function NotFound() {
	return (
		<div class="flex justify-center">
			<main class="text-center text-gray-700 p-4 flex flex-col gap-8">
				<h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase pt-16">
					Not Found
				</h1>
				<p>
					Visit{" "}
					<a
						href="https://solidjs.com"
						target="_blank"
						class="text-sky-600 hover:underline"
						rel="noopener"
					>
						solidjs.com
					</a>{" "}
					to learn how to build Solid apps.
				</p>
				<p>
					<A href="/" class="text-sky-600 hover:underline">
						Home
					</A>
					{" - "}
					<A href="/about" class="text-sky-600 hover:underline">
						About Page
					</A>
				</p>
			</main>
		</div>
	);
}
