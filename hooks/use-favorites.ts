"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const DEVICE_ID_KEY = "halal-korea-device-id";

function getOrCreateDeviceId(): string {
	if (typeof window === "undefined") return "";

	let deviceId = localStorage.getItem(DEVICE_ID_KEY);
	if (!deviceId) {
		deviceId = crypto.randomUUID();
		localStorage.setItem(DEVICE_ID_KEY, deviceId);
	}
	return deviceId;
}

export function useFavorites() {
	const [favorites, setFavorites] = useState<Set<string>>(new Set());
	const [loading, setLoading] = useState(true);
	const [deviceId, setDeviceId] = useState<string>("");

	// Initialize device ID
	useEffect(() => {
		setDeviceId(getOrCreateDeviceId());
	}, []);

	// Fetch favorites when device ID is ready
	useEffect(() => {
		if (!deviceId) return;

		async function fetchFavorites() {
			const supabase = createClient();
			const { data } = await supabase
				.from("favorites")
				.select("restaurant_id")
				.eq("device_id", deviceId);

			if (data) {
				setFavorites(new Set(data.map((f) => f.restaurant_id)));
			}
			setLoading(false);
		}

		fetchFavorites();
	}, [deviceId]);

	const toggleFavorite = useCallback(
		async (restaurantId: string) => {
			if (!deviceId) return;

			const supabase = createClient();
			const isFavorite = favorites.has(restaurantId);

			if (isFavorite) {
				// Remove favorite
				await supabase
					.from("favorites")
					.delete()
					.eq("device_id", deviceId)
					.eq("restaurant_id", restaurantId);

				setFavorites((prev) => {
					const next = new Set(prev);
					next.delete(restaurantId);
					return next;
				});
			} else {
				// Add favorite
				await supabase.from("favorites").insert({
					device_id: deviceId,
					restaurant_id: restaurantId,
				});

				setFavorites((prev) => new Set(prev).add(restaurantId));
			}
		},
		[deviceId, favorites],
	);

	const isFavorite = useCallback(
		(restaurantId: string) => favorites.has(restaurantId),
		[favorites],
	);

	return {
		favorites,
		loading,
		toggleFavorite,
		isFavorite,
		favoriteCount: favorites.size,
	};
}
