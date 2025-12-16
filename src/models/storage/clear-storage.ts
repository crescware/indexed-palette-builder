import { storageKeys } from "./storage";

export const clearStorage = (): void => {
	Object.values(storageKeys).forEach((key) => {
		localStorage.removeItem(key);
	});
};
