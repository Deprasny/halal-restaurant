import { getGroupCounts, getRestaurants } from "@/app/actions/restaurants";
import { HomeClient } from "../home-client";

export default async function ExplorePage() {
	const [restaurants, groupCounts] = await Promise.all([
		getRestaurants(),
		getGroupCounts(),
	]);

	return <HomeClient restaurants={restaurants} groupCounts={groupCounts} />;
}
