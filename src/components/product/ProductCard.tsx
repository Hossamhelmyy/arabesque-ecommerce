import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import {
	Card,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Heart,
	ShoppingCart,
	Eye,
	ImageIcon,
	Check,
} from "lucide-react";

export type ProductCardProps = {
	product: {
		id: string;
		name: string;
		name_ar: string;
		price: number;
		original_price: number | null;
		image: string;
		images?: string[] | null;
		slug: string;
		is_new?: boolean | null;
		is_on_sale?: boolean | null;
		category_id?: string | null;
	};
	onAddToCart: () => void;
	onAddToWishlist?: () => void;
	isInWishlist?: boolean;
	imagePriority?: boolean;
	className?: string;
};

export const ProductCard = ({
	product,
	onAddToCart,
	onAddToWishlist,
	isInWishlist = false,
	imagePriority = false,
	className,
}: ProductCardProps) => {
	const { t, i18n } = useTranslation();
	const { isRTL } = useLanguage();
	const [isHovered, setIsHovered] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] =
		useState(0);
	const [animateHeart, setAnimateHeart] = useState(false);
	const [addedToCart, setAddedToCart] = useState(false);

	const displayName =
		i18n.language === "ar" ? product.name_ar : product.name;

	// Get all available images
	const images = getProductImages(product);

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onAddToCart();
		setAddedToCart(true);
		setTimeout(() => setAddedToCart(false), 1000);
	};

	const handleAddToWishlist = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (onAddToWishlist) {
			setAnimateHeart(true);
			setTimeout(() => setAnimateHeart(false), 600);
			onAddToWishlist();
		}
	};

	// Handle image change on hover if there are multiple images
	const handleMouseEnter = () => {
		setIsHovered(true);
		if (images.length > 1) {
			setCurrentImageIndex(1); // Show the second image on hover
		}
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
		setCurrentImageIndex(0); // Reset to main image
	};

	// Calculate discount percentage if there's an original price
	const discountPercentage = product.original_price
		? Math.round(
				(1 - product.price / product.original_price) * 100,
		  )
		: 0;

	return (
		<Card
			className={cn(
				"group overflow-hidden border transition-all hover:shadow-lg",
				className,
			)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}>
			<Link
				to={`/product/${product.slug}`}
				className="block relative">
				<div className="relative overflow-hidden">
					{/* Product image with hover effect */}
					<div className="relative aspect-square overflow-hidden bg-muted">
						{images.length > 0 ? (
							<img
								src={images[currentImageIndex]}
								alt={displayName}
								loading={imagePriority ? "eager" : "lazy"}
								className="h-full w-full object-cover transition-all duration-500"
								onError={(e) => {
									(e.target as HTMLImageElement).src =
										"/placeholder.svg";
								}}
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center">
								<ImageIcon className="h-12 w-12 text-muted-foreground opacity-50" />
							</div>
						)}

						{/* Overlay gradient */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
					</div>

					{/* Badges */}
					<div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
						{product.is_new && (
							<Badge className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md">
								{t("product.new")}
							</Badge>
						)}

						{product.is_on_sale &&
							product.original_price && (
								<Badge
									variant="destructive"
									className="shadow-md">
									-{discountPercentage}%
								</Badge>
							)}
					</div>

					{/* Quick action buttons on hover */}
					<div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-2 p-3 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
						<Button
							variant="secondary"
							size="icon"
							className="h-9 w-9 rounded-full shadow-md bg-background/80 backdrop-blur-sm hover:bg-background"
							onClick={handleAddToCart}>
							{addedToCart ? (
								<Check className="h-4 w-4 animate-fadeIn" />
							) : (
								<ShoppingCart className="h-4 w-4" />
							)}
							<span className="sr-only">
								{t("product.addToCart")}
							</span>
						</Button>

						<Button
							variant="secondary"
							size="icon"
							className={cn(
								"h-9 w-9 rounded-full shadow-md bg-background/80 backdrop-blur-sm hover:bg-background",
								isInWishlist && "text-red-500",
							)}
							onClick={handleAddToWishlist}>
							<Heart
								className={cn(
									"h-4 w-4 transition-all duration-300",
									animateHeart && "animate-heartbeat",
									isInWishlist && "fill-current",
								)}
							/>
							<span className="sr-only">
								{isInWishlist
									? t("product.removeFromWishlist")
									: t("product.addToWishlist")}
							</span>
						</Button>

						<Button
							variant="secondary"
							size="icon"
							className="h-9 w-9 rounded-full shadow-md bg-background/80 backdrop-blur-sm hover:bg-background"
							asChild>
							<Link to={`/product/${product.slug}`}>
								<Eye className="h-4 w-4" />
								<span className="sr-only">
									{t("product.view")}
								</span>
							</Link>
						</Button>
					</div>

					{/* Image counter if multiple images */}
					{images.length > 1 && isHovered && (
						<div className="absolute bottom-3 right-3 z-10">
							<Badge
								variant="outline"
								className="bg-background/70 backdrop-blur-sm text-xs px-2 py-0.5">
								{currentImageIndex + 1} / {images.length}
							</Badge>
						</div>
					)}
				</div>

				<CardContent className="p-4">
					<div className="space-y-1">
						<div className="flex justify-between items-baseline">
							<div className="space-y-1">
								<h3 className="font-medium text-sm line-clamp-1">
									{displayName}
								</h3>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<span className="font-semibold text-base">
								${product.price.toFixed(2)}
							</span>
							{product.original_price && (
								<span className="text-muted-foreground text-sm line-through">
									${product.original_price.toFixed(2)}
								</span>
							)}
						</div>
					</div>
				</CardContent>

				<CardFooter className="p-4 pt-0">
					<Button
						className="w-full"
						variant={isHovered ? "default" : "outline"}
						size="sm"
						onClick={handleAddToCart}>
						{addedToCart ? (
							<>
								<Check className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
								{t("product.addedToCart")}
							</>
						) : (
							<>
								<ShoppingCart className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
								{t("product.addToCart")}
							</>
						)}
					</Button>
				</CardFooter>
			</Link>
		</Card>
	);
};

// Helper function to get all product images
function getProductImages(
	product: ProductCardProps["product"],
) {
	const mainImage = product.image;
	const additionalImages = product.images || [];

	// Make sure images is an array
	const imagesArray = Array.isArray(additionalImages)
		? additionalImages
		: [];

	// Include the main image if it's not already in the array
	const allImages = [
		mainImage,
		...imagesArray.filter((img) => img !== mainImage),
	];

	// Remove any empty strings or null values
	return allImages.filter(Boolean);
}

export const ProductCardSkeleton = () => {
	return (
		<Card className="overflow-hidden">
			<div className="animate-pulse">
				<div className="aspect-square bg-muted" />
				<CardContent className="p-4">
					<div className="space-y-3">
						<div className="h-4 w-2/3 bg-muted rounded" />
						<div className="h-5 w-1/3 bg-muted rounded" />
					</div>
				</CardContent>
				<CardFooter className="p-4 pt-0">
					<div className="h-9 w-full bg-muted rounded" />
				</CardFooter>
			</div>
		</Card>
	);
};

export default ProductCard;
