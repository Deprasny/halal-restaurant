"use client";

import { Clock, Heart, MapPin } from "lucide-react";
import Image from "next/image";
import { useFavoritesContext } from "@/contexts/favorites-context";
import { formatDistance } from "@/lib/geo-utils";
import type { RestaurantWithDistance } from "@/lib/types/restaurant";
import { HalalStatusIcon } from "./halal-status-icon";

interface RestaurantCardProps {
	restaurant: RestaurantWithDistance;
	onClick?: () => void;
	showFavoriteButton?: boolean;
}

const HALAL_STATUS_LABELS: Record<string, string> = {
	halal: "Halal",
	partially_halal: "Partial",
	muslim_friendly: "Friendly",
	seafood: "Seafood",
	vegetarian: "Veg",
};

export function RestaurantCard({
	restaurant,
	onClick,
	showFavoriteButton = true,
}: RestaurantCardProps) {
	const { isFavorite, toggleFavorite } = useFavoritesContext();
	const favorite = isFavorite(restaurant.id);

	const handleFavoriteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		toggleFavorite(restaurant.id);
	};

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={onClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick?.();
				}
			}}
			className="w-full text-left bg-card p-3 rounded-lg gm-hover cursor-pointer border border-border hover:border-primary/30 relative group"
		>
			{showFavoriteButton && (
				<button
					type="button"
					onClick={handleFavoriteClick}
					className="absolute bottom-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity z-10"
					aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
				>
					<Heart
						className={`h-4 w-4 ${favorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
					/>
				</button>
			)}
			<div className="flex gap-3">
				{restaurant.image_url ? (
					<div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-muted">
						<Image
							src={restaurant.image_url}
							alt={restaurant.name}
							fill
							className="object-cover"
							sizes="64px"
						/>
					</div>
				) : (
					<div className="h-16 w-16 shrink-0 rounded-lg bg-muted flex items-center justify-center">
						<span className="text-xl font-semibold text-muted-foreground">
							{restaurant.name.charAt(0)}
						</span>
					</div>
				)}

				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-2">
						<h3 className="font-medium text-sm truncate">{restaurant.name}</h3>
						<span className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground">
							<HalalStatusIcon status={restaurant.halal_status} size="sm" />
							{HALAL_STATUS_LABELS[restaurant.halal_status]}
						</span>
					</div>

					<p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
						{restaurant.description || "No description available"}
					</p>

					<div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
						{restaurant.distance_km > 0 && (
							<span className="flex items-center gap-1">
								<MapPin className="h-3 w-3" />
								{formatDistance(restaurant.distance_km)}
							</span>
						)}
						{restaurant.opening_hours && (
							<span className="flex items-center gap-1">
								<Clock className="h-3 w-3" />
								<span className="truncate max-w-[120px]">
									{restaurant.opening_hours}
								</span>
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
