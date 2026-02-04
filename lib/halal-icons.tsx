"use client";

import type { HalalStatus } from "@/lib/types/restaurant";

// Single source of truth for halal status colors
export const HALAL_STATUS_COLORS: Record<HalalStatus, string> = {
	halal: "#16a34a", // green-600
	partially_halal: "#eab308", // yellow-500
	muslim_friendly: "#2563eb", // blue-600
	seafood: "#0891b2", // cyan-600
	vegetarian: "#059669", // emerald-600
	masjid: "#7c3aed", // violet-600
	mart: "#ea580c", // orange-600
	accommodation: "#0d9488", // teal-600
};

// Tailwind class equivalents for React components
export const HALAL_STATUS_BG_CLASSES: Record<HalalStatus, string> = {
	halal: "bg-green-600",
	partially_halal: "bg-yellow-500",
	muslim_friendly: "bg-blue-600",
	seafood: "bg-cyan-600",
	vegetarian: "bg-emerald-600",
	masjid: "bg-violet-600",
	mart: "bg-orange-600",
	accommodation: "bg-teal-600",
};

// Single source of truth for halal status icon SVG paths
export const HALAL_ICON_PATHS: Record<HalalStatus, string> = {
	halal: "M20 6 9 17l-5-5", // Checkmark
	partially_halal: "M12 2a10 10 0 0 1 0 20V2z", // Half circle
	muslim_friendly:
		"12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26", // Star (polygon points)
	seafood:
		"M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6-3.56 0-7.56-2.53-8.5-6Z|M18 12v.5|M16 17.93a9.77 9.77 0 0 1-3 .07|M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5 .23 6.5C5.58 18.03 7 16 7 13.33", // Fish (multiple paths separated by |)
	vegetarian:
		"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z|M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12", // Leaf (multiple paths separated by |)
	masjid: "M12 2L8.5 9H4l3 6v5h10v-5l3-6h-4.5L12 2z|M12 6v3", // Mosque dome
	mart: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z|M3 6h18|M16 10a4 4 0 0 1-8 0", // Shopping bag
	accommodation: "M3 21V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13|M9 21v-6h6v6|M3 11h18", // Building with door
};

// Icon render styles per status
const ICON_STYLES: Record<
	HalalStatus,
	{ fill: boolean; strokeWidth: number; isPolygon?: boolean }
> = {
	halal: { fill: false, strokeWidth: 3 },
	partially_halal: { fill: true, strokeWidth: 2 },
	muslim_friendly: { fill: true, strokeWidth: 1, isPolygon: true },
	seafood: { fill: false, strokeWidth: 2 },
	vegetarian: { fill: false, strokeWidth: 2 },
	masjid: { fill: false, strokeWidth: 2 },
	mart: { fill: false, strokeWidth: 2 },
	accommodation: { fill: false, strokeWidth: 2 },
};

// Generate SVG string for map markers (HTML string for DOM insertion)
export function getHalalIconSvg(
	status: HalalStatus,
	size: number = 14,
): string {
	const pathData = HALAL_ICON_PATHS[status];
	const style = ICON_STYLES[status];
	const paths = pathData.split("|");

	const fill = style.fill ? "white" : "none";
	const strokeWidth = style.strokeWidth;

	if (style.isPolygon) {
		return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="white" stroke-width="${strokeWidth}"><polygon points="${paths[0]}"/></svg>`;
	}

	const pathElements = paths
		.map(
			(p) =>
				`<path d="${p}" fill="${fill}" stroke="white" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
		)
		.join("");

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">${pathElements}</svg>`;
}

// React component for sidebar/cards
interface HalalIconProps {
	status: HalalStatus;
	className?: string;
}

export function HalalIcon({ status, className }: HalalIconProps) {
	const pathData = HALAL_ICON_PATHS[status];
	const style = ICON_STYLES[status];
	const paths = pathData.split("|");

	const fill = style.fill ? "currentColor" : "none";
	const strokeWidth = style.strokeWidth;

	if (style.isPolygon) {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill={fill}
				stroke="currentColor"
				strokeWidth={strokeWidth}
				className={className}
				aria-label={`${status} status`}
				role="img"
			>
				<polygon points={paths[0]} />
			</svg>
		);
	}

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill={fill}
			stroke="currentColor"
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-label={`${status} status`}
			role="img"
		>
			{paths.map((p) => (
				<path key={p} d={p} />
			))}
		</svg>
	);
}
