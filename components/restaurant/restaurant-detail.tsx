"use client";

import { Clock, Heart, Instagram, MapPin } from "lucide-react";
import Image from "next/image";
import { useFavoritesContext } from "@/contexts/favorites-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { formatDistance } from "@/lib/geo-utils";
import type { RestaurantWithDistance } from "@/lib/types/restaurant";

interface RestaurantDetailProps {
	restaurant: RestaurantWithDistance | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const HALAL_STATUS_LABELS: Record<string, string> = {
	halal: "Halal Certified",
	partially_halal: "Partially Halal",
	muslim_friendly: "Muslim Friendly",
	seafood: "Seafood Restaurant",
	vegetarian: "Vegetarian",
	masjid: "Masjid & Musalla",
	mart: "Halal Mart",
	accommodation: "Accommodation",
};

const HALAL_STATUS_COLORS: Record<string, string> = {
	halal: "bg-green-600 text-white",
	partially_halal: "bg-yellow-500 text-black",
	muslim_friendly: "bg-blue-600 text-white",
	seafood: "bg-cyan-600 text-white",
	vegetarian: "bg-emerald-600 text-white",
	masjid: "bg-violet-600 text-white",
	mart: "bg-orange-600 text-white",
	accommodation: "bg-teal-600 text-white",
};

export function RestaurantDetail({
	restaurant,
	open,
	onOpenChange,
}: RestaurantDetailProps) {
	const { isFavorite, toggleFavorite } = useFavoritesContext();

	if (!restaurant) return null;

	const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`;
	const loved = isFavorite(restaurant.id);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
				{restaurant.image_url ? (
					<div className="relative h-48 w-full">
						<Image
							src={restaurant.image_url}
							alt={restaurant.name}
							fill
							className="object-cover"
							sizes="(max-width: 448px) 100vw, 448px"
						/>
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm"
							onClick={() => toggleFavorite(restaurant.id)}
						>
							<Heart
								className={`h-5 w-5 ${loved ? "fill-red-500 text-red-500" : "text-gray-600"}`}
							/>
						</Button>
					</div>
				) : (
					<div className="relative h-32 w-full bg-muted flex items-center justify-center">
						<span className="text-5xl font-semibold text-muted-foreground">
							{restaurant.name.charAt(0)}
						</span>
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm"
							onClick={() => toggleFavorite(restaurant.id)}
						>
							<Heart
								className={`h-5 w-5 ${loved ? "fill-red-500 text-red-500" : "text-gray-600"}`}
							/>
						</Button>
					</div>
				)}

				<div className="p-5">
					<DialogHeader className="gap-2">
						<div className="flex items-start justify-between gap-2">
							<DialogTitle className="text-lg font-semibold">
								{restaurant.name}
							</DialogTitle>
							<Badge
								className={`shrink-0 ${HALAL_STATUS_COLORS[restaurant.halal_status]}`}
							>
								{HALAL_STATUS_LABELS[restaurant.halal_status]}
							</Badge>
						</div>
					</DialogHeader>

					<div className="mt-4 space-y-3">
						{restaurant.description && (
							<p className="text-sm text-muted-foreground">
								{restaurant.description}
							</p>
						)}

						<div className="space-y-2 text-sm">
							{restaurant.distance_km > 0 && (
								<div className="flex items-center gap-2 text-muted-foreground">
									<MapPin className="h-4 w-4 shrink-0" />
									<span>{formatDistance(restaurant.distance_km)} away</span>
								</div>
							)}

							{restaurant.opening_hours && (
								<div className="flex items-center gap-2 text-muted-foreground">
									<Clock className="h-4 w-4 shrink-0" />
									<span>{restaurant.opening_hours}</span>
								</div>
							)}

							{restaurant.price_range && (
								<div className="flex items-center gap-2 text-muted-foreground">
									<span className="h-4 w-4 shrink-0 text-center font-medium">
										₩
									</span>
									<span>{restaurant.price_range}</span>
								</div>
							)}
						</div>

						<div className="flex flex-wrap gap-2 pt-4">
							<Button asChild className="flex-1">
								<a
									href={googleMapsUrl}
									target="_blank"
									rel="noopener noreferrer"
								>
									<MapPin className="h-4 w-4 mr-2" />
									Open in Maps
								</a>
							</Button>

							{restaurant.instagram_url && (
								<Button variant="outline" asChild>
									<a
										href={restaurant.instagram_url}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Instagram className="h-4 w-4" />
									</a>
								</Button>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
