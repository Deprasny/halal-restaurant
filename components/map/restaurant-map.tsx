"use client";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { getHalalIconSvg, HALAL_STATUS_COLORS } from "@/lib/halal-icons";
import type {
	HalalStatus,
	RestaurantWithDistance,
} from "@/lib/types/restaurant";

const LIGHT_TILES = [
	"https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
	"https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
	"https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
];

const DARK_TILES = [
	"https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
	"https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
	"https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
];

interface RestaurantMapProps {
	restaurants: RestaurantWithDistance[];
	userLocation: { latitude: number; longitude: number };
	onMarkerClick: (restaurant: RestaurantWithDistance) => void;
}

export function RestaurantMap({
	restaurants,
	userLocation,
	onMarkerClick,
}: RestaurantMapProps) {
	const mapContainer = useRef<HTMLDivElement>(null);
	const map = useRef<maplibregl.Map | null>(null);
	const markers = useRef<maplibregl.Marker[]>([]);
	const [mapLoaded, setMapLoaded] = useState(false);
	const { resolvedTheme } = useTheme();

	const isDark = resolvedTheme === "dark";

	// Initialize map (only once)
	useEffect(() => {
		if (!mapContainer.current || map.current) return;

		map.current = new maplibregl.Map({
			container: mapContainer.current,
			style: {
				version: 8,
				sources: {
					carto: {
						type: "raster",
						tiles: LIGHT_TILES,
						tileSize: 256,
						attribution:
							'&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
					},
				},
				layers: [
					{
						id: "carto",
						type: "raster",
						source: "carto",
					},
				],
			},
			center: [userLocation.longitude, userLocation.latitude],
			zoom: 12,
		});

		map.current.addControl(new maplibregl.NavigationControl(), "top-right");

		map.current.on("load", () => {
			setMapLoaded(true);
		});

		return () => {
			map.current?.remove();
			map.current = null;
		};
	}, [userLocation.latitude, userLocation.longitude]);

	// Update tiles when theme changes
	useEffect(() => {
		if (!map.current || !mapLoaded) return;

		const source = map.current.getSource("carto") as maplibregl.RasterTileSource;
		if (source) {
			const tiles = isDark ? DARK_TILES : LIGHT_TILES;
			source.setTiles(tiles);
		}
	}, [isDark, mapLoaded]);

	// Update markers when restaurants change
	useEffect(() => {
		if (!map.current || !mapLoaded) return;

		// Clear existing markers
		for (const marker of markers.current) {
			marker.remove();
		}
		markers.current = [];

		// Add new markers
		for (const restaurant of restaurants) {
			const status = restaurant.halal_status as HalalStatus;
			const color = HALAL_STATUS_COLORS[status] || "#16a34a";
			const icon = getHalalIconSvg(status);

			const el = document.createElement("div");
			el.className = "restaurant-marker";
			el.style.cssText = `
				width: 32px;
				height: 32px;
				background-color: ${color};
				border: 2px solid white;
				border-radius: 50%;
				cursor: pointer;
				box-shadow: 0 2px 6px rgba(0,0,0,0.3);
				display: flex;
				align-items: center;
				justify-content: center;
			`;
			el.innerHTML = icon;

			const marker = new maplibregl.Marker({ element: el })
				.setLngLat([restaurant.longitude, restaurant.latitude])
				.addTo(map.current);

			el.addEventListener("click", () => {
				onMarkerClick(restaurant);
			});

			markers.current.push(marker);
		}

		// Add user location marker
		const userEl = document.createElement("div");
		userEl.style.cssText = `
			width: 18px;
			height: 18px;
			background-color: #3b82f6;
			border: 3px solid white;
			border-radius: 50%;
			box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
		`;

		const userMarker = new maplibregl.Marker({ element: userEl })
			.setLngLat([userLocation.longitude, userLocation.latitude])
			.addTo(map.current);

		markers.current.push(userMarker);
	}, [restaurants, mapLoaded, onMarkerClick, userLocation]);

	return (
		<div
			ref={mapContainer}
			className="w-full h-full min-h-[400px]"
			style={{ position: "relative" }}
		/>
	);
}
