import {
	type Accessor,
	createContext,
	createSignal,
	type ParentProps,
} from "solid-js";

export type EditModeContextValue = Readonly<{
	isEditMode: Accessor<boolean>;
	toggleEditMode: () => void;
	exitEditMode: () => void;
}>;

export const EditModeContext = createContext<EditModeContextValue>();

export function EditModeProvider(props: ParentProps) {
	const [isEditMode, setIsEditMode] = createSignal(false);

	const toggleEditMode = (): void => {
		setIsEditMode(!isEditMode());
	};

	const exitEditMode = (): void => {
		setIsEditMode(false);
	};

	return (
		<EditModeContext.Provider
			value={{
				isEditMode,
				toggleEditMode,
				exitEditMode,
			}}
		>
			{props.children}
		</EditModeContext.Provider>
	);
}
