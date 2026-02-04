"use client";

import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useMemo, useState } from "react";
import { useFavoritesContext } from "@/contexts/favorites-context";
import type { RestaurantWithDistance } from "@/lib/types/restaurant";
import { Button } from "../ui/button";
import { RestaurantCard } from "./restaurant-card";

interface FavoritesSidebarProps {
	restaurants: RestaurantWithDistance[];
	onRestaurantClick: (restaurant: RestaurantWithDistance) => void;
}

export function FavoritesSidebar({
	restaurants,
	onRestaurantClick,
}: FavoritesSidebarProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { favorites, loading, favoriteCount } = useFavoritesContext();

	const favoriteRestaurants = useMemo(() => {
		return restaurants.filter((r) => favorites.has(r.id));
	}, [restaurants, favorites]);

	return (
		<>
			{/* Sidebar */}
			<div
				className={`absolute top-0 right-0 h-full z-10 transition-transform duration-300 ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="h-full w-[320px] max-w-[calc(100vw-48px)] bg-background gm-shadow-lg flex flex-col">
					{/* Header */}
					<header className="p-4 border-b border-border">
						<div className="flex items-center gap-2">
							<Heart className="h-5 w-5 text-red-500 fill-red-500" />
							<h2 className="text-lg font-semibold text-foreground">
								Favorites
							</h2>
						</div>
						<p className="text-sm text-muted-foreground mt-1">
							{loading
								? "Loading..."
								: `${favoriteCount} saved restaurant${favoriteCount !== 1 ? "s" : ""}`}
						</p>
					</header>

					{/* Favorites list */}
					<div className="flex-1 overflow-auto p-3">
						{loading ? (
							<div className="flex items-center justify-center h-32">
								<p className="text-sm text-muted-foreground">Loading...</p>
							</div>
						) : favoriteRestaurants.length === 0 ? (
							<div className="flex flex-col items-center justify-center h-32 text-center px-4">
								<Heart className="h-8 w-8 text-muted-foreground/50 mb-2" />
								<p className="text-sm text-muted-foreground">
									No favorites yet
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									Hover over a restaurant and click the heart to save it
								</p>
							</div>
						) : (
							<div className="space-y-2">
								{favoriteRestaurants.map((restaurant) => (
									<RestaurantCard
										key={restaurant.id}
										restaurant={restaurant}
										onClick={() => onRestaurantClick(restaurant)}
										showFavoriteButton={true}
									/>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Toggle button - positioned on the left edge of sidebar */}
				{isOpen && (
					<Button
						variant="secondary"
						size="icon"
						className="absolute top-26 -left-12 h-10 w-10 rounded-full gm-shadow-lg bg-background hover:bg-muted"
						onClick={() => setIsOpen(false)}
					>
						<ChevronRight className="h-5 w-5" />
					</Button>
				)}
			</div>

			{/* Floating button when closed */}
			{!isOpen && (
				<Button
					variant="secondary"
					size="icon"
					className="absolute top-26 right-1 z-10 h-10 w-10 rounded-full gm-shadow-lg bg-background hover:bg-muted"
					onClick={() => setIsOpen(true)}
				>
					<div className="relative">
						<Heart className="h-5 w-5 text-red-500" />
						{favoriteCount > 0 && (
							<span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
								{favoriteCount > 9 ? "9+" : favoriteCount}
							</span>
						)}
					</div>
				</Button>
			)}
		</>
	);
}
