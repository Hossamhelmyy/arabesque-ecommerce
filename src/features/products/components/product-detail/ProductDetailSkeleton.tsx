import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function ProductDetailSkeleton() {
	return (
		<div className="container py-12">
			{/* Breadcrumb Skeleton */}
			<div className="flex items-center gap-2 mb-6">
				<Skeleton className="h-4 w-20" />
				<Skeleton className="h-4 w-4" />
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-4 w-4" />
				<Skeleton className="h-4 w-32" />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
				{/* Gallery Skeleton */}
				<div className="space-y-4">
					<Skeleton className="aspect-square w-full rounded-lg" />
					<div className="grid grid-cols-4 gap-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton
								key={i}
								className="aspect-square w-full rounded-lg"
							/>
						))}
					</div>
				</div>

				{/* Product Info Skeleton */}
				<div className="space-y-8">
					{/* Title and Price */}
					<div className="space-y-4">
						<Skeleton className="h-8 w-3/4" />
						<Skeleton className="h-6 w-1/4" />
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-5/6" />
						<Skeleton className="h-4 w-4/6" />
					</div>

					{/* Actions */}
					<div className="space-y-4">
						<div className="flex items-center gap-4">
							<Skeleton className="h-10 w-32" />
							<Skeleton className="h-10 w-10" />
						</div>
						<Skeleton className="h-10 w-full" />
					</div>
				</div>
			</div>

			<Separator className="my-12" />

			{/* Related Products Skeleton */}
			<div className="space-y-6">
				<Skeleton className="h-8 w-48" />
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="space-y-3">
							<Skeleton className="aspect-square w-full rounded-lg" />
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-1/4" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
