import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const ProfilePageSkeleton = () => {
	return (
		<div className="container py-8 md:py-12">
			<div className="flex flex-col md:flex-row gap-8">
				{/* Sidebar Skeleton */}
				<div className="md:w-auto">
					<Card className="p-6 w-full md:w-[280px]">
						{/* Avatar and User Info */}
						<div className="flex flex-col items-center space-y-4 mb-6">
							<Skeleton className="h-20 w-20 rounded-full" />
							<div className="space-y-2 w-full text-center">
								<Skeleton className="h-5 w-32 mx-auto" />
								<Skeleton className="h-4 w-40 mx-auto" />
							</div>
						</div>

						{/* Navigation Buttons */}
						<div className="space-y-2">
							{[1, 2, 3, 4].map((i) => (
								<Skeleton key={i} className="h-10 w-full" />
							))}
						</div>
					</Card>
				</div>

				{/* Main Content Skeleton */}
				<div className="md:w-3/4">
					<Card className="p-6">
						{/* Header */}
						<div className="space-y-2 mb-6">
							<Skeleton className="h-8 w-48" />
							<Skeleton className="h-4 w-72" />
						</div>

						{/* Form Fields */}
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{[1, 2, 3, 4].map((i) => (
									<div key={i} className="space-y-2">
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-10 w-full" />
									</div>
								))}
							</div>

							{/* Full Width Fields */}
							<div className="space-y-2">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-24 w-full" />
							</div>

							{/* Submit Button */}
							<Skeleton className="h-10 w-32" />
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};
