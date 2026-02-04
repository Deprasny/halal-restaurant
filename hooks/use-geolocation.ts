"use client";

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_CENTER } from "@/lib/geo-utils";

interface GeolocationState {
	latitude: number;
	longitude: number;
	loading: boolean;
	error: string | null;
	isDefault: boolean;
}

export function useGeolocation() {
	const [state, setState] = useState<GeolocationState>({
		latitude: DEFAULT_CENTER.latitude,
		longitude: DEFAULT_CENTER.longitude,
		loading: true,
		error: null,
		isDefault: true,
	});

	const requestLocation = useCallback(() => {
		if (!navigator.geolocation) {
			setState((prev) => ({
				...prev,
				loading: false,
				error: "Geolocation is not supported",
			}));
			return;
		}

		setState((prev) => ({ ...prev, loading: true, error: null }));

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setState({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					loading: false,
					error: null,
					isDefault: false,
				});
			},
			(error) => {
				let errorMessage = "Unable to get location";
				switch (error.code) {
					case error.PERMISSION_DENIED:
						errorMessage = "Location permission denied";
						break;
					case error.POSITION_UNAVAILABLE:
						errorMessage = "Location unavailable";
						break;
					case error.TIMEOUT:
						errorMessage = "Location request timed out";
						break;
				}
				setState((prev) => ({
					...prev,
					loading: false,
					error: errorMessage,
				}));
			},
			{
				enableHighAccuracy: false,
				timeout: 10000,
				maximumAge: 300000, // 5 minutes cache
			},
		);
	}, []);

	useEffect(() => {
		requestLocation();
	}, [requestLocation]);

	return {
		...state,
		requestLocation,
	};
}
