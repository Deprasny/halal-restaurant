"use server";

import { calculateDistance } from "@/lib/geo-utils";
import { loadRestaurantsFromKMZ } from "@/lib/kmz-parser";
import type {
	Restaurant,
	RestaurantWithDistance,
} from "@/lib/types/restaurant";

// Cache the restaurants in memory
let cachedRestaurants: Restaurant[] | null = null;

export async function getRestaurants(): Promise<Restaurant[]> {
	if (cachedRestaurants) {
		return cachedRestaurants;
	}

	cachedRestaurants = await loadRestaurantsFromKMZ();
	return cachedRestaurants;
}

export async function getRestaurantsWithDistance(
	userLat: number,
	userLng: number,
): Promise<RestaurantWithDistance[]> {
	const restaurants = await getRestaurants();

	return restaurants
		.map((restaurant) => ({
			...restaurant,
			distance_km: calculateDistance(
				userLat,
				userLng,
				restaurant.latitude,
				restaurant.longitude,
			),
		}))
		.sort((a, b) => a.distance_km - b.distance_km);
}

export async function searchRestaurants(
	query: string,
	userLat?: number,
	userLng?: number,
): Promise<RestaurantWithDistance[]> {
	const restaurants = await getRestaurants();
	const lowerQuery = query.toLowerCase().trim();

	const filtered = restaurants.filter((r) => {
		return (
			r.name.toLowerCase().includes(lowerQuery) ||
			r.description.toLowerCase().includes(lowerQuery)
		);
	});

	if (userLat !== undefined && userLng !== undefined) {
		return filtered
			.map((restaurant) => ({
				...restaurant,
				distance_km: calculateDistance(
					userLat,
					userLng,
					restaurant.latitude,
					restaurant.longitude,
				),
			}))
			.sort((a, b) => a.distance_km - b.distance_km);
	}

	return filtered.map((restaurant) => ({
		...restaurant,
		distance_km: 0,
	}));
}

export async function getRestaurantById(
	id: string,
): Promise<Restaurant | null> {
	const restaurants = await getRestaurants();
	return restaurants.find((r) => r.id === id) || null;
}

export async function getRestaurantsByHalalStatus(
	status: string,
	userLat: number,
	userLng: number,
): Promise<RestaurantWithDistance[]> {
	const restaurants = await getRestaurants();

	return restaurants
		.filter((r) => r.halal_status === status)
		.map((restaurant) => ({
			...restaurant,
			distance_km: calculateDistance(
				userLat,
				userLng,
				restaurant.latitude,
				restaurant.longitude,
			),
		}))
		.sort((a, b) => a.distance_km - b.distance_km);
}

export async function getGroupCounts(): Promise<Record<string, number>> {
	const restaurants = await getRestaurants();
	const counts: Record<string, number> = {};

	for (const r of restaurants) {
		counts[r.halal_status] = (counts[r.halal_status] || 0) + 1;
	}

	return counts;
}
