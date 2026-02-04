"use client";

import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
	FavoritesSidebar,
	RestaurantDetail,
	RestaurantList,
} from "@/components/restaurant";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { useGeolocation } from "@/hooks/use-geolocation";
import { calculateDistance } from "@/lib/geo-utils";
import type {
	Restaurant,
	RestaurantWithDistance,
} from "@/lib/types/restaurant";

// Dynamic import for map (avoid SSR issues with maplibre-gl)
const RestaurantMap = dynamic(
	() => import("@/components/map").then((mod) => mod.RestaurantMap),
	{
		ssr: false,
		loading: () => (
			<div className="w-full h-full min-h-[400px] flex items-center justify-center bg-muted">
				<span className="text-muted-foreground">Loading map...</span>
			</div>
		),
	},
);

interface HomeClientProps {
	restaurants: Restaurant[];
	groupCounts: Record<string, number>;
}

export function HomeClient({ restaurants, groupCounts }: HomeClientProps) {
	const { latitude, longitude, loading, isDefault } = useGeolocation();
	const [selectedRestaurant, setSelectedRestaurant] =
		useState<RestaurantWithDistance | null>(null);
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const restaurantsWithDistance: RestaurantWithDistance[] = useMemo(() => {
		return restaurants
			.map((restaurant) => ({
				...restaurant,
				distance_km: calculateDistance(
					latitude,
					longitude,
					restaurant.latitude,
					restaurant.longitude,
				),
			}))
			.sort((a, b) => a.distance_km - b.distance_km);
	}, [restaurants, latitude, longitude]);

	return (
		<FavoritesProvider>
			<div className="h-screen w-full relative overflow-hidden">
				{/* Full-screen map */}
				<div className="absolute inset-0">
					<RestaurantMap
						restaurants={restaurantsWithDistance}
						userLocation={{ latitude, longitude }}
						onMarkerClick={setSelectedRestaurant}
					/>
				</div>

				{/* Floating sidebar */}
				<div
					className={`absolute top-0 left-0 h-full z-10 transition-transform duration-300 ${
						sidebarOpen ? "translate-x-0" : "-translate-x-full"
					}`}
				>
					<div className="h-full w-[380px] max-w-[calc(100vw-48px)] bg-background gm-shadow-lg flex flex-col">
						{/* Header */}
						<header className="p-4 border-b border-border">
							<div className="flex items-center justify-between">
								<h1 className="text-xl font-semibold text-foreground">
									Halal Korea
								</h1>
								<ThemeToggle />
							</div>
							<p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
								<MapPin className="h-3.5 w-3.5" />
								{loading
									? "Getting your location..."
									: isDefault
										? "Seoul Station (default)"
										: "Near you"}
							</p>
						</header>

						{/* Restaurant list */}
						<div className="flex-1 overflow-hidden">
							<RestaurantList
								groupCounts={groupCounts}
								userLat={latitude}
								userLng={longitude}
							/>
						</div>
					</div>

					{/* Toggle button */}
					<Button
						variant="secondary"
						size="icon"
						className="absolute top-4 -right-12 h-10 w-10 rounded-full gm-shadow-lg bg-background hover:bg-muted"
						onClick={() => setSidebarOpen(!sidebarOpen)}
					>
						{sidebarOpen ? (
							<ChevronLeft className="h-5 w-5" />
						) : (
							<ChevronRight className="h-5 w-5" />
						)}
					</Button>
				</div>


				{/* Favorites sidebar (right) */}
				<FavoritesSidebar
					restaurants={restaurantsWithDistance}
					onRestaurantClick={setSelectedRestaurant}
				/>

				<RestaurantDetail
					restaurant={selectedRestaurant}
					open={!!selectedRestaurant}
					onOpenChange={(open) => !open && setSelectedRestaurant(null)}
				/>
			</div>
		</FavoritesProvider>
	);
}
