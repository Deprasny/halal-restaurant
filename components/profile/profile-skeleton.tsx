export function ProfileSkeleton() {
	return (
		<div className="space-y-8 animate-pulse">
			{/* Avatar Skeleton */}
			<div className="flex items-center gap-6">
				<div className="w-24 h-24 rounded-full bg-muted" />
				<div className="space-y-2">
					<div className="h-10 w-36 rounded-md bg-muted" />
					<div className="h-4 w-40 bg-muted rounded" />
				</div>
			</div>

			{/* Form Skeleton */}
			<div className="space-y-6">
				<div className="space-y-2">
					<div className="h-4 w-20 bg-muted rounded" />
					<div className="h-10 w-full rounded-md bg-muted" />
				</div>
				<div className="space-y-2">
					<div className="h-4 w-16 bg-muted rounded" />
					<div className="h-10 w-full rounded-md bg-muted" />
				</div>
				<div className="h-10 w-32 rounded-md bg-muted" />
			</div>
		</div>
	);
}
