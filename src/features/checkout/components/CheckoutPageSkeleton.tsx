import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const CheckoutPageSkeleton = () => {
	return (
		<div className="container py-8 md:py-12">
			<Skeleton className="h-8 w-[200px] mb-6" />

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<Card className="p-6 space-y-6">
						{/* Personal Information */}
						<div className="space-y-4">
							<Skeleton className="h-6 w-[150px]" />
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<Skeleton className="h-10" />
								<Skeleton className="h-10" />
								<Skeleton className="h-10" />
								<Skeleton className="h-10" />
							</div>
						</div>

						{/* Shipping Information */}
						<div className="space-y-4">
							<Skeleton className="h-6 w-[180px]" />
							<div className="grid grid-cols-1 gap-4">
								<Skeleton className="h-10" />
								<Skeleton className="h-10" />
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<Skeleton className="h-10" />
									<Skeleton className="h-10" />
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<Skeleton className="h-10" />
									<Skeleton className="h-10" />
								</div>
							</div>
						</div>

						{/* Payment Method */}
						<div className="space-y-4">
							<Skeleton className="h-6 w-[150px]" />
							<div className="grid grid-cols-1 gap-4">
								<Skeleton className="h-12" />
								<Skeleton className="h-12" />
							</div>
						</div>

						{/* Submit Button */}
						<Skeleton className="h-10 w-full mt-6" />
					</Card>
				</div>

				<div className="lg:col-span-1">
					<Card className="p-6 space-y-6">
						{/* Order Summary Header */}
						<div className="space-y-2">
							<Skeleton className="h-6 w-[150px]" />
							<Skeleton className="h-4 w-[200px]" />
						</div>

						{/* Order Items */}
						<div className="space-y-4">
							{Array.from({ length: 2 }).map((_, index) => (
								<div key={index} className="flex gap-4">
									<Skeleton className="h-16 w-16 rounded-lg" />
									<div className="flex-1 space-y-2">
										<Skeleton className="h-4 w-[150px]" />
										<Skeleton className="h-4 w-[100px]" />
									</div>
								</div>
							))}
						</div>

						{/* Order Summary */}
						<div className="space-y-2">
							<div className="flex justify-between">
								<Skeleton className="h-4 w-[80px]" />
								<Skeleton className="h-4 w-[60px]" />
							</div>
							<div className="flex justify-between">
								<Skeleton className="h-4 w-[60px]" />
								<Skeleton className="h-4 w-[60px]" />
							</div>
							<div className="flex justify-between">
								<Skeleton className="h-4 w-[40px]" />
								<Skeleton className="h-4 w-[50px]" />
							</div>
							<div className="flex justify-between pt-4">
								<Skeleton className="h-5 w-[100px]" />
								<Skeleton className="h-5 w-[80px]" />
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};
