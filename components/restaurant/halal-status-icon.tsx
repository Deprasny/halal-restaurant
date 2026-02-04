"use client";

import { HALAL_STATUS_BG_CLASSES, HalalIcon } from "@/lib/halal-icons";
import type { HalalStatus } from "@/lib/types/restaurant";

interface HalalStatusIconProps {
	status: HalalStatus;
	size?: "sm" | "md" | "lg";
	showBackground?: boolean;
}

const SIZE_CLASSES = {
	sm: "w-5 h-5",
	md: "w-6 h-6",
	lg: "w-8 h-8",
};

const ICON_SIZE_CLASSES = {
	sm: "w-3 h-3",
	md: "w-3.5 h-3.5",
	lg: "w-4 h-4",
};

export function HalalStatusIcon({
	status,
	size = "md",
	showBackground = true,
}: HalalStatusIconProps) {
	const bgColor = HALAL_STATUS_BG_CLASSES[status];
	const iconSizeClass = ICON_SIZE_CLASSES[size];

	if (!showBackground) {
		return (
			<HalalIcon status={status} className={`${iconSizeClass} text-current`} />
		);
	}

	return (
		<span
			className={`${SIZE_CLASSES[size]} ${bgColor} rounded-full flex items-center justify-center shrink-0`}
		>
			<HalalIcon status={status} className={`${iconSizeClass} text-white`} />
		</span>
	);
}
