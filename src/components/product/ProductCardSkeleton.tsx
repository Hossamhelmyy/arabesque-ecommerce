import {
	Card,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";

type ProductCardSkeletonProps = {
	className?: string;
	variant?: "default" | "compact" | "featured";
};

export const ProductCardSkeleton = ({
	className = "",
	variant = "default",
}: ProductCardSkeletonProps) => {
	const { isRTL } = useLanguage();

	return (
		<Card
			className={`product-card overflow-hidden ${className} animate-pulse-subtle ${
				variant === "compact"
					? "p-2"
					: variant === "featured"
					? "border-2 border-primary/20"
					: ""
			}`}>
			<div className="relative overflow-hidden">
				{/* Image skeleton */}
				<Skeleton className="w-full aspect-square" />

				{/* Badges skeleton - adjusted for RTL */}
				<div className="absolute top-0 left-0 w-full p-3">
					<div
						className={`flex flex-wrap gap-2 ${
							isRTL ? "justify-end" : ""
						}`}>
						<Skeleton className="h-5 w-12 rounded-md" />
						{variant === "featured" && (
							<Skeleton className="h-5 w-16 rounded-md" />
						)}
					</div>
				</div>
			</div>

			<CardContent
				className={`${
					variant === "compact" ? "p-2" : "p-4"
				}`}>
				{/* Rating skeleton */}
				<div className="flex items-center gap-1 mb-2">
					<Skeleton className="h-3 w-3 rounded-full" />
					<Skeleton className="h-3 w-3 rounded-full" />
					<Skeleton className="h-3 w-3 rounded-full" />
					<Skeleton className="h-3 w-3 rounded-full" />
					<Skeleton className="h-3 w-3 rounded-full" />
					<Skeleton className="h-3 w-8 ml-1 rtl:ml-0 rtl:mr-1" />
				</div>

				{/* Title skeleton */}
				<div
					className={`${
						isRTL ? "text-right" : "text-left"
					}`}>
					<Skeleton className="h-4 w-3/4 mt-2" />
					<Skeleton className="h-4 w-1/2 mt-2" />
				</div>

				{/* Price skeleton */}
				<div
					className={`flex items-center mt-4 ${
						isRTL ? "justify-end" : "justify-start"
					}`}>
					<Skeleton className="h-6 w-16" />
					{variant !== "compact" && (
						<Skeleton className="h-4 w-12 ml-2 rtl:ml-0 rtl:mr-2" />
					)}
				</div>
			</CardContent>

			<CardFooter
				className={`${
					variant === "compact" ? "p-2 pt-0" : "p-4 pt-0"
				}`}>
				{/* Button skeleton */}
				<Skeleton className="h-9 w-full rounded-full" />
			</CardFooter>
		</Card>
	);
};

export default ProductCardSkeleton;
