import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const FavoritesGridSkeleton = () => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{Array.from({ length: 8 }).map((_, index) => (
				<Card
					key={index}
					className="group overflow-hidden rounded-lg">
					{/* Product Image Skeleton */}
					<div className="relative aspect-square">
						<Skeleton className="absolute inset-0" />
					</div>

					{/* Product Details */}
					<div className="p-4 sm:p-6">
						<div className="space-y-2">
							{/* Title */}
							<Skeleton className="h-4 w-[180px]" />

							{/* Price */}
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-[70px]" />
								<Skeleton className="h-4 w-[60px]" />
							</div>

							{/* Added Date */}
							<div className="flex items-center gap-2">
								<Skeleton className="h-4 w-[120px]" />
							</div>
						</div>

						{/* Action Buttons */}
						<div className="mt-4 flex gap-2">
							<Skeleton className="h-9 w-full" />
							<Skeleton className="h-9 w-9" />
						</div>
					</div>
				</Card>
			))}
		</div>
	);
};
