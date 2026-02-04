import { XMLParser } from "fast-xml-parser";
import JSZip from "jszip";
import type {
	HalalStatus,
	PlaceCategory,
	Restaurant,
} from "@/lib/types/restaurant";

interface KMLPlacemark {
	name: string;
	description?: string;
	Point?: {
		coordinates: string;
	};
	styleUrl?: string;
}

interface KMLFolder {
	name: string;
	Placemark?: KMLPlacemark | KMLPlacemark[];
}

interface KMLDocument {
	kml: {
		Document: {
			name: string;
			description?: string;
			Folder?: KMLFolder | KMLFolder[];
		};
	};
}

const FOLDER_TO_HALAL_STATUS: Record<string, HalalStatus> = {
	"Halal restaurant": "halal",
	"Partially Halal": "partially_halal",
	"Seafood restaurant": "seafood",
	"Muslim Friendly Restaurant": "muslim_friendly",
	"Vegetarian Restaurant": "vegetarian",
	"Masjid & Musalla": "masjid",
	"Muslim Friendly Accommodation": "accommodation",
	"Halal Mart": "mart",
};

const FOLDER_TO_CATEGORY: Record<string, PlaceCategory> = {
	"Halal restaurant": "restaurant",
	"Partially Halal": "restaurant",
	"Seafood restaurant": "restaurant",
	"Muslim Friendly Restaurant": "restaurant",
	"Vegetarian Restaurant": "restaurant",
	"Masjid & Musalla": "masjid",
	"Muslim Friendly Accommodation": "accommodation",
	"Halal Mart": "mart",
};

function parseDescription(description: string): {
	image_url?: string;
	opening_hours?: string;
	price_range?: string;
	instagram_url?: string;
	cleaned_description: string;
} {
	const result: ReturnType<typeof parseDescription> = {
		cleaned_description: "",
	};

	// Extract image URL
	const imgMatch = description.match(/<img src="([^"]+)"/);
	if (imgMatch) {
		result.image_url = imgMatch[1];
	}

	// Extract opening hours (⏰ pattern)
	const hoursMatch = description.match(/⏰\s*([^<\n]+)/);
	if (hoursMatch) {
		result.opening_hours = hoursMatch[1].trim();
	}

	// Extract price range (₩ pattern)
	const priceMatch = description.match(/₩\s*([^<\n]+)/);
	if (priceMatch) {
		result.price_range = `₩${priceMatch[1].trim()}`;
	}

	// Extract Instagram URL
	const instaMatch = description.match(
		/https:\/\/www\.instagram\.com\/[^\s<]+/,
	);
	if (instaMatch) {
		result.instagram_url = instaMatch[0];
	}

	// Clean description - remove HTML tags, app download links, and extract meaningful text
	let cleaned = description
		.replace(/<img[^>]*>/g, "")
		.replace(/<br\s*\/?>/g, "\n")
		.replace(/<[^>]+>/g, "")
		.replace(/◼ Korehalal Trip App Download[\s\S]*?id6736513932/g, "")
		.replace(/Android\s*:\s*https:\/\/play\.google\.com[^\s\n]+/g, "")
		.replace(/iOS\s*:\s*https:\/\/apps\.apple\.com[^\s\n]+/g, "")
		.replace(/🚲Delivery Link:[\s\S]*?viewform/g, "")
		.replace(/https:\/\/forms\.gle\/[^\s\n]+/g, "")
		.replace(/https:\/\/www\.instagram\.com[^\s\n]+/g, "")
		.replace(/⏰[^\n]+/g, "")
		.replace(/₩[^\n]+/g, "")
		.trim();

	// Clean up multiple newlines
	cleaned = cleaned
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0)
		.join("\n");

	result.cleaned_description = cleaned;

	return result;
}

function parseCoordinates(coordString: string): {
	latitude: number;
	longitude: number;
} | null {
	// Format: longitude,latitude,altitude
	const parts = coordString.trim().split(",");
	if (parts.length >= 2) {
		const longitude = Number.parseFloat(parts[0]);
		const latitude = Number.parseFloat(parts[1]);
		if (!Number.isNaN(longitude) && !Number.isNaN(latitude)) {
			return { latitude, longitude };
		}
	}
	return null;
}

function generateId(
	name: string,
	coords: { lat: number; lng: number },
): string {
	// Create a deterministic ID from name and coordinates
	const base = `${name}-${coords.lat.toFixed(4)}-${coords.lng.toFixed(4)}`;
	return base
		.toLowerCase()
		.replace(/[^a-z0-9-]/g, "-")
		.replace(/-+/g, "-")
		.substring(0, 50);
}

export async function parseKMZFromBuffer(
	buffer: ArrayBuffer,
): Promise<Restaurant[]> {
	const zip = await JSZip.loadAsync(buffer);

	// Find the KML file (usually doc.kml)
	const kmlFile = zip.file("doc.kml");
	if (!kmlFile) {
		throw new Error("No doc.kml found in KMZ file");
	}

	const kmlContent = await kmlFile.async("string");

	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: "@_",
		textNodeName: "#text",
	});

	const parsed = parser.parse(kmlContent) as KMLDocument;

	const restaurants: Restaurant[] = [];
	const seenIds = new Set<string>();
	const folders = parsed.kml.Document.Folder;

	if (!folders) {
		return restaurants;
	}

	const folderArray = Array.isArray(folders) ? folders : [folders];

	for (const folder of folderArray) {
		const folderName = folder.name;
		const halalStatus = FOLDER_TO_HALAL_STATUS[folderName];
		const category = FOLDER_TO_CATEGORY[folderName];

		// Skip non-restaurant categories for now (but you can include them later)
		if (!category || category === "other") {
			continue;
		}

		const placemarks = folder.Placemark;
		if (!placemarks) continue;

		const placemarkArray = Array.isArray(placemarks)
			? placemarks
			: [placemarks];

		for (const placemark of placemarkArray) {
			if (!placemark.Point?.coordinates) continue;

			const coords = parseCoordinates(placemark.Point.coordinates);
			if (!coords) continue;

			const description = placemark.description || "";
			const parsedDesc = parseDescription(description);

			// Generate unique ID, adding suffix if duplicate
			let id = generateId(placemark.name, {
				lat: coords.latitude,
				lng: coords.longitude,
			});

			let suffix = 1;
			const baseId = id;
			while (seenIds.has(id)) {
				suffix++;
				id = `${baseId}-${suffix}`.substring(0, 50);
			}
			seenIds.add(id);

			const restaurant: Restaurant = {
				id,
				name: placemark.name,
				category,
				halal_status: halalStatus || "muslim_friendly",
				latitude: coords.latitude,
				longitude: coords.longitude,
				description: parsedDesc.cleaned_description,
				image_url: parsedDesc.image_url,
				opening_hours: parsedDesc.opening_hours,
				price_range: parsedDesc.price_range,
				instagram_url: parsedDesc.instagram_url,
				source: "local_kmz",
			};

			restaurants.push(restaurant);
		}
	}

	return restaurants;
}

export async function loadRestaurantsFromKMZ(): Promise<Restaurant[]> {
	// This function is used server-side to load the bundled KMZ file
	const fs = await import("node:fs/promises");
	const path = await import("node:path");

	const kmzPath = path.join(process.cwd(), "data", "halal-restaurants.kmz");
	const buffer = await fs.readFile(kmzPath);

	return parseKMZFromBuffer(buffer.buffer as ArrayBuffer);
}
