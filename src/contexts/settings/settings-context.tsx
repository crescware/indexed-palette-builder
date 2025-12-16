import {
	type Accessor,
	createContext,
	createSignal,
	onCleanup,
	onMount,
	type ParentProps,
} from "solid-js";

export type SettingsContextValue = Readonly<{
	isSettingsOpen: Accessor<boolean>;
	toggleSettings: () => void;
	closeSettings: () => void;
	setSettingsContainerRef: (el: HTMLDivElement) => void;
}>;

export const SettingsContext = createContext<SettingsContextValue>();

export function SettingsProvider(props: ParentProps) {
	const [isSettingsOpen, setIsSettingsOpen] = createSignal(false);
	let settingsContainerRef: HTMLDivElement | undefined;

	const toggleSettings = (): void => {
		setIsSettingsOpen(!isSettingsOpen());
	};

	const closeSettings = (): void => {
		setIsSettingsOpen(false);
	};

	const setSettingsContainerRef = (el: HTMLDivElement): void => {
		settingsContainerRef = el;
	};

	onMount(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				isSettingsOpen() &&
				settingsContainerRef &&
				!settingsContainerRef.contains(event.target as Node)
			) {
				closeSettings();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		onCleanup(() => {
			document.removeEventListener("mousedown", handleClickOutside);
		});
	});

	return (
		<SettingsContext.Provider
			value={{
				isSettingsOpen,
				toggleSettings,
				closeSettings,
				setSettingsContainerRef,
			}}
		>
			{props.children}
		</SettingsContext.Provider>
	);
}
