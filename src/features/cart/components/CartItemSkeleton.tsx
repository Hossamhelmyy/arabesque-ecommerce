import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";

export const CartItemSkeleton = () => {
	const { isRTL } = useLanguage();

	return (
		<div
			dir={isRTL ? "rtl" : "ltr"}
			className="group relative flex flex-col sm:flex-row items-start gap-3 sm:gap-4 rounded-lg border p-3 sm:p-4">
			{/* Product Image Skeleton */}
			<Skeleton className="relative aspect-square h-20 w-20 sm:h-24 sm:w-24 rounded-md" />

			{/* Product Details Skeleton */}
			<div className="flex flex-1 flex-col space-y-2 w-full">
				<div className="flex justify-between items-start">
					<div className="space-y-2">
						<Skeleton className="h-4 w-[150px] sm:w-[200px]" />
						<Skeleton className="h-3 w-[100px]" />
					</div>
					<Skeleton className="h-8 w-8 rounded-md" />
				</div>

				{/* Quantity Controls Skeleton */}
				<div className="flex items-center justify-between mt-auto pt-2 sm:pt-0">
					<div className="flex items-center space-x-1 sm:space-x-2">
						<Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-md" />
						<Skeleton className="h-7 w-8 sm:h-8 sm:w-12 rounded-md" />
						<Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-md" />
					</div>
					<Skeleton className="h-4 w-[80px] sm:w-[100px]" />
				</div>
			</div>
		</div>
	);
};
