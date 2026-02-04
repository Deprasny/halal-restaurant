"use client";

import { createContext, type ReactNode, useContext } from "react";
import { useFavorites } from "@/hooks/use-favorites";

type FavoritesContextType = ReturnType<typeof useFavorites>;

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
	const favorites = useFavorites();

	return (
		<FavoritesContext.Provider value={favorites}>
			{children}
		</FavoritesContext.Provider>
	);
}

export function useFavoritesContext() {
	const context = useContext(FavoritesContext);
	if (!context) {
		throw new Error(
			"useFavoritesContext must be used within a FavoritesProvider",
		);
	}
	return context;
}
