export type HalalStatus =
	| "halal"
	| "partially_halal"
	| "muslim_friendly"
	| "seafood"
	| "vegetarian"
	| "masjid"
	| "mart"
	| "accommodation";

export type PlaceCategory =
	| "restaurant"
	| "mart"
	| "masjid"
	| "accommodation"
	| "other";

export interface Restaurant {
	id: string;
	name: string;
	category: PlaceCategory;
	halal_status: HalalStatus;
	latitude: number;
	longitude: number;
	description: string;
	image_url?: string;
	opening_hours?: string;
	price_range?: string;
	instagram_url?: string;
	source: "local_kmz";
}

export interface RestaurantWithDistance extends Restaurant {
	distance_km: number;
}
