import { LoaderCircle } from "lucide-solid";
import { type ParentProps, Show } from "solid-js";

type Props = ParentProps<
	Readonly<{
		enabled: boolean;
	}>
>;

export function Loading(props: Props) {
	return (
		<Show
			when={!props.enabled}
			fallback={
				<div class="flex items-center justify-center h-full">
					<LoaderCircle class="animate-spin text-gray-400" size={32} />
				</div>
			}
		>
			{props.children}
		</Show>
	);
}
