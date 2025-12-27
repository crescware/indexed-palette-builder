import type { ComponentProps, JSX, ParentProps } from "solid-js";

type Props = ParentProps<
	Pick<
		ComponentProps<"button">,
		"type" | "onClick" | "aria-label" | "disabled" | "class"
	>
>;

export function Button(props: Props): JSX.Element {
	return (
		<button
			type={props.type}
			onClick={props.onClick}
			aria-label={props["aria-label"]}
			disabled={props.disabled}
			class={`text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 active:bg-gray-300 dark:active:bg-gray-700 active:text-gray-900 dark:active:text-gray-100 rounded-lg transition-colors ${props.class}`}
		>
			{props.children}
		</button>
	);
}
