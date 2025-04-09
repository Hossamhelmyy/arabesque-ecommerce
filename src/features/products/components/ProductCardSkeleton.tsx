import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductCardSkeleton = () => {
	return (
		<Card className="group overflow-hidden rounded-lg">
			{/* Product Image Skeleton */}
			<div className="relative aspect-square">
				<Skeleton className="absolute inset-0" />
			</div>

			{/* Product Details Skeleton */}
			<div className="p-4 sm:p-6">
				<div className="space-y-2">
					{/* Title */}
					<Skeleton className="h-4 w-[180px]" />

					{/* Price */}
					<div className="flex items-center gap-2">
						<Skeleton className="h-5 w-[70px]" />
						<Skeleton className="h-4 w-[60px]" />
					</div>
				</div>

				{/* Action Buttons */}
				<div className="mt-4 flex gap-2">
					<Skeleton className="h-9 w-full" />
					<Skeleton className="h-9 w-9" />
				</div>
			</div>
		</Card>
	);
};
