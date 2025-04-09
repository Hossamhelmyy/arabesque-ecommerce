import { Skeleton } from "@/components/ui/skeleton";
import { CartListSkeleton } from "./CartListSkeleton";
import { CartSummarySkeleton } from "./CartSummarySkeleton";

export const CartPageSkeleton = () => {
	return (
		<div className="container py-8 md:py-12">
			<Skeleton className="h-8 w-[200px] mb-6" />

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<CartListSkeleton />
				</div>

				<div className="lg:col-span-1">
					<CartSummarySkeleton />
				</div>
			</div>
		</div>
	);
};
