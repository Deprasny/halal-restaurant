"use client";

import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { getRestaurantsByHalalStatus } from "@/app/actions/restaurants";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import type {
	HalalStatus,
	RestaurantWithDistance,
} from "@/lib/types/restaurant";
import { HalalStatusIcon } from "./halal-status-icon";
import { RestaurantCard } from "./restaurant-card";
import { RestaurantDetail } from "./restaurant-detail";
import { SearchInput } from "./search-input";

interface RestaurantListProps {
	groupCounts: Record<string, number>;
	userLat: number;
	userLng: number;
}

const HALAL_STATUS_ORDER: HalalStatus[] = [
	"halal",
	"partially_halal",
	"muslim_friendly",
	"seafood",
	"vegetarian",
	"masjid",
	"mart",
	"accommodation",
];

const HALAL_STATUS_LABELS: Record<string, string> = {
	halal: "Halal Certified",
	partially_halal: "Partially Halal",
	muslim_friendly: "Muslim Friendly",
	seafood: "Seafood",
	vegetarian: "Vegetarian",
	masjid: "Masjid & Musalla",
	mart: "Halal Mart",
	accommodation: "Accommodation",
};

export function RestaurantList({
	groupCounts,
	userLat,
	userLng,
}: RestaurantListProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [openAccordions, setOpenAccordions] = useState<string[]>([]);
	const [selectedRestaurant, setSelectedRestaurant] =
		useState<RestaurantWithDistance | null>(null);
	const [loadedGroups, setLoadedGroups] = useState<
		Record<string, RestaurantWithDistance[]>
	>({});
	const [loadingGroups, setLoadingGroups] = useState<Record<string, boolean>>(
		{},
	);
	const [, startTransition] = useTransition();

	const loadGroup = useCallback(
		async (status: string) => {
			if (loadedGroups[status] || loadingGroups[status]) return;

			setLoadingGroups((prev) => ({ ...prev, [status]: true }));

			startTransition(async () => {
				const restaurants = await getRestaurantsByHalalStatus(
					status,
					userLat,
					userLng,
				);
				setLoadedGroups((prev) => ({ ...prev, [status]: restaurants }));
				setLoadingGroups((prev) => ({ ...prev, [status]: false }));
			});
		},
		[loadedGroups, loadingGroups, userLat, userLng],
	);

	const filterRestaurants = useCallback(
		(restaurants: RestaurantWithDistance[]) => {
			if (!searchQuery.trim()) return restaurants;
			const query = searchQuery.toLowerCase().trim();
			return restaurants.filter(
				(r) =>
					r.name.toLowerCase().includes(query) ||
					r.description.toLowerCase().includes(query),
			);
		},
		[searchQuery],
	);

	// Load all groups and auto-open matching ones when search query changes
	useEffect(() => {
		if (!searchQuery.trim()) {
			setOpenAccordions([]);
			return;
		}

		const availableStatuses = HALAL_STATUS_ORDER.filter(
			(status) => groupCounts[status] > 0,
		);

		// Load all groups that haven't been loaded yet
		for (const status of availableStatuses) {
			loadGroup(status);
		}
	}, [searchQuery, groupCounts, loadGroup]);

	// Auto-open accordions that have matching results
	useEffect(() => {
		if (!searchQuery.trim()) return;

		const matchingStatuses = HALAL_STATUS_ORDER.filter((status) => {
			const restaurants = loadedGroups[status];
			if (!restaurants) return false;
			return filterRestaurants(restaurants).length > 0;
		});

		setOpenAccordions(matchingStatuses);
	}, [searchQuery, loadedGroups, filterRestaurants]);

	const handleAccordionChange = (value: string[]) => {
		setOpenAccordions(value);
		for (const status of value) {
			loadGroup(status);
		}
	};

	const totalCount = Object.values(groupCounts).reduce((a, b) => a + b, 0);

	// Calculate filtered counts when searching
	const filteredCounts = searchQuery.trim()
		? HALAL_STATUS_ORDER.reduce(
				(acc, status) => {
					const restaurants = loadedGroups[status];
					if (restaurants) {
						const filtered = filterRestaurants(restaurants);
						if (filtered.length > 0) {
							acc[status] = filtered.length;
						}
					}
					return acc;
				},
				{} as Record<string, number>,
			)
		: groupCounts;

	const displayTotalCount = Object.values(filteredCounts).reduce(
		(a, b) => a + b,
		0,
	);
	const displayCategoryCount = Object.keys(filteredCounts).length;

	return (
		<div className="flex flex-col h-full">
			<div className="p-3 bg-background">
				<SearchInput
					value={searchQuery}
					onChange={setSearchQuery}
					placeholder="Search restaurants..."
				/>
				<p className="text-xs text-muted-foreground mt-2 px-1">
					{displayTotalCount} restaurant{displayTotalCount !== 1 ? "s" : ""} in{" "}
					{displayCategoryCount} categor{displayCategoryCount !== 1 ? "ies" : "y"}
				</p>
			</div>

			<div className="flex-1 overflow-auto px-3 pb-3">
				<Accordion
					type="multiple"
					value={openAccordions}
					className="space-y-2"
					onValueChange={handleAccordionChange}
				>
					{HALAL_STATUS_ORDER.filter((status) => {
						// When searching, only show categories with matches
						if (searchQuery.trim()) {
							return filteredCounts[status] !== undefined && filteredCounts[status] > 0;
						}
						// When not searching, show all categories with restaurants
						return groupCounts[status] > 0;
					}).map((status) => (
							<AccordionItem
								key={status}
								value={status}
								className="border rounded-lg bg-card overflow-hidden"
							>
								<AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 [&[data-state=open]>svg]:rotate-180">
									<div className="flex items-center gap-3 flex-1">
										<HalalStatusIcon status={status} size="md" />
										<span className="font-medium text-sm">
											{HALAL_STATUS_LABELS[status]}
										</span>
										<span className="text-xs text-muted-foreground ml-auto mr-2">
											{searchQuery.trim()
												? filteredCounts[status]
												: groupCounts[status]}
										</span>
									</div>
								</AccordionTrigger>
								<AccordionContent className="px-3 pb-3">
									{loadingGroups[status] ? (
										<div className="flex items-center justify-center py-8">
											<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
										</div>
									) : loadedGroups[status] ? (
										<div className="space-y-2">
											{filterRestaurants(loadedGroups[status]).length === 0 ? (
												<p className="text-xs text-muted-foreground text-center py-4">
													No matches found
												</p>
											) : (
												filterRestaurants(loadedGroups[status]).map(
													(restaurant) => (
														<RestaurantCard
															key={restaurant.id}
															restaurant={restaurant}
															onClick={() => setSelectedRestaurant(restaurant)}
														/>
													),
												)
											)}
										</div>
									) : (
										<div className="flex items-center justify-center py-8">
											<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
										</div>
									)}
								</AccordionContent>
							</AccordionItem>
						),
					)}
				</Accordion>
			</div>

			<RestaurantDetail
				restaurant={selectedRestaurant}
				open={!!selectedRestaurant}
				onOpenChange={(open) => !open && setSelectedRestaurant(null)}
			/>
		</div>
	);
}
