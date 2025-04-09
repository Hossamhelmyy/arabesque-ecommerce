import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
	NavigationMenuItem,
	NavigationMenuTrigger,
	NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import {
	ArrowRight,
	Sparkles,
	TrendingUp,
	TagIcon,
	Clock,
	Eye,
	HeartIcon,
	ShoppingBag,
	Star,
	CheckCircle,
	Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { Product } from "@/features/products";

// Featured product type

export const FeaturedProductsMenu = () => {
	const { t } = useTranslation();
	const { currentLanguage } = useLanguage();
	const [hovered, setHovered] = useState(false);

	// Fetch featured products directly
	const { data: featuredProducts, isLoading } = useQuery({
		queryKey: ["featured-products-menu"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("products")
				.select("*, category:categories(name, name_ar)")
				.eq("is_featured", true)
				.order("created_at", { ascending: false })
				.limit(5);

			if (error) {
				console.error(
					"Error fetching featured products:",
					error,
				);
				return [];
			}

			return data as Product[];
		},
		staleTime: 5 * 60 * 1000, // 5 minutes cache
	});

	// Get the first product from the fetched data
	const featuredProduct =
		featuredProducts && featuredProducts.length > 0
			? featuredProducts[0]
			: null;

	const formatPrice = (price: number) => {
		return `$${price.toFixed(2)}`;
	};

	const getDiscountPercentage = (
		original: number,
		current: number,
	) => {
		return Math.round(
			((original - current) / original) * 100,
		);
	};

	const getCategoryName = (category?: {
		name: string;
		name_ar?: string;
	}) => {
		if (!category) return "";
		return currentLanguage === "ar" && category.name_ar
			? category.name_ar
			: category.name;
	};

	return (
		<NavigationMenuItem>
			<NavigationMenuTrigger>
				{t("common.products")}
			</NavigationMenuTrigger>
			<NavigationMenuContent>
				<div className="grid gap-6 p-4 md:p-6 lg:p-8 w-[95vw] max-w-[95vw] md:w-[550px] md:max-w-[550px] lg:w-[680px] lg:max-w-[680px] lg:grid-cols-[1.1fr_1.2fr]">
					{/* Featured Product Section */}
					<div className="space-y-3 lg:space-y-4 overflow-hidden">
						<h3 className="text-lg font-semibold tracking-tight flex items-center gap-2 text-primary">
							<Sparkles className="h-4 w-4" />
							{t("home.featuredCollection")}
						</h3>

						{isLoading ? (
							<div className="space-y-3">
								<Skeleton className="aspect-[4/3] sm:aspect-square w-full rounded-lg" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-4 w-1/2" />
								</div>
							</div>
						) : featuredProduct ? (
							<div
								className="group relative overflow-hidden rounded-lg bg-background/30 ring-1 ring-primary/5 transition-all duration-300 hover:ring-primary/20 flex flex-col h-full"
								onMouseEnter={() => setHovered(true)}
								onMouseLeave={() => setHovered(false)}>
								{/* New and Sale badges */}
								<div className="absolute left-3 top-3 z-20 flex flex-col items-start gap-2">
									{featuredProduct.is_new && (
										<Badge
											variant="default"
											className="shadow-lg animate-fadeIn">
											{t("home.new")}
										</Badge>
									)}
								</div>

								{featuredProduct.is_on_sale &&
									featuredProduct.original_price && (
										<Badge
											variant="destructive"
											className="absolute right-3 top-3 z-20 shadow-lg animate-fadeIn">
											-
											{getDiscountPercentage(
												featuredProduct.original_price,
												featuredProduct.price,
											)}
											%
										</Badge>
									)}

								{/* Product Image */}
								<div className="overflow-hidden">
									<div className="aspect-[4/3] sm:aspect-square w-full overflow-hidden">
										<img
											src={featuredProduct.image}
											alt={featuredProduct.name}
											className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-105"
											onError={(e) => {
												(e.target as HTMLImageElement).src =
													"/placeholder.svg";
											}}
										/>
									</div>
								</div>

								{/* Product Info */}
								<div className="relative z-10 space-y-2 bg-background/95 p-4 backdrop-blur-sm flex-grow flex flex-col">
									{/* Title */}
									<h4 className="line-clamp-2 font-medium tracking-tight min-h-[2.5rem] text-sm">
										{currentLanguage === "ar"
											? featuredProduct.description_ar
											: featuredProduct.description}
									</h4>

									{/* Price */}
									<div className="flex items-center">
										{featuredProduct.original_price &&
										featuredProduct.original_price >
											featuredProduct.price ? (
											<>
												<span className="font-bold text-destructive">
													{formatPrice(
														featuredProduct.price,
													)}
												</span>
												<span className="ml-2 text-sm line-through text-muted-foreground">
													{formatPrice(
														featuredProduct.original_price,
													)}
												</span>
											</>
										) : (
											<span className="font-bold">
												{formatPrice(featuredProduct.price)}
											</span>
										)}
									</div>

									{/* Product Status */}
									<div className="flex items-center gap-2 text-xs mt-1">
										{featuredProduct.stock_quantity &&
										featuredProduct.stock_quantity > 0 ? (
											<div className="flex items-center text-green-600">
												<CheckCircle className="h-3 w-3 mr-1" />
												<span>{t("product.inStock")}</span>
											</div>
										) : (
											<div className="flex items-center text-muted-foreground">
												<span>
													{t("product.outOfStock")}
												</span>
											</div>
										)}

										<div className="flex items-center text-muted-foreground">
											<Truck className="h-3 w-3 mr-1" />
											<span>
												{t("product.freeShipping")}
											</span>
										</div>
									</div>

									{/* View Product Button */}
									<Button
										asChild
										variant="default"
										size="sm"
										className="mt-auto w-full group">
										<Link
											to={`/product/${featuredProduct.slug}`}>
											<span>{t("home.viewProduct")}</span>
											<ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
										</Link>
									</Button>
								</div>
							</div>
						) : (
							<div className="flex aspect-square items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
								{t("admin.noProducts")}
							</div>
						)}
					</div>

					{/* Categories Section */}
					<div className="space-y-5 md:space-y-6">
						{/* Browse By Section */}
						<div className="space-y-3">
							<h3 className="text-sm font-medium text-muted-foreground">
								{t("home.browseBy")}
							</h3>
							<div className="grid grid-cols-2 gap-3">
								<CategoryCard
									href="/products?category=all"
									title={t("home.allProducts")}
									variant="fancy"
								/>
								<CategoryCard
									href="/products?filter=new"
									title={t("home.newArrivals")}
									icon={
										<Clock className="h-4 w-4 text-primary" />
									}
								/>
								<CategoryCard
									href="/products?filter=sale"
									title={t("home.onSale")}
									icon={
										<TagIcon className="h-4 w-4 text-destructive" />
									}
								/>
								<CategoryCard
									href="/products?filter=trending"
									title={t("home.trending")}
									icon={
										<TrendingUp className="h-4 w-4 text-primary" />
									}
								/>
							</div>
						</div>

						{/* Popular Categories Section */}
						<div className="space-y-3">
							<h3 className="text-sm font-medium text-muted-foreground">
								{t("home.popularCategories")}
							</h3>
							<div className="grid grid-cols-2 gap-y-2">
								<CategoryLink
									href="/products?category=jewelry"
									label={t("categories.jewelry")}
								/>
								<CategoryLink
									href="/products?category=furniture"
									label={t("categories.furniture")}
								/>
								<CategoryLink
									href="/products?category=decor"
									label={t("categories.decor")}
								/>
								<CategoryLink
									href="/products?category=lighting"
									label={t("categories.lighting")}
								/>
								<CategoryLink
									href="/products?category=ceramics"
									label={t("categories.ceramics")}
								/>
								<CategoryLink
									href="/products?category=textiles"
									label={t("categories.textiles")}
								/>
							</div>
						</div>

						{/* All Categories Button */}
						<div className="pt-2">
							<Button
								asChild
								variant="outline"
								size="sm"
								className="w-full group">
								<Link to="/categories">
									<span>{t("common.allCategories")}</span>
									<ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</NavigationMenuContent>
		</NavigationMenuItem>
	);
};

interface CategoryCardProps {
	href: string;
	title: string;
	icon?: React.ReactNode;
	variant?: "default" | "fancy";
}

const CategoryCard = ({
	href,
	title,
	icon,
	variant = "default",
}: CategoryCardProps) => {
	return (
		<Link
			to={href}
			className={cn(
				"group flex flex-col items-center justify-center rounded-md border p-3 text-center transition-all duration-300",
				variant === "default"
					? "bg-transparent hover:bg-muted/50 hover:shadow-sm"
					: "bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 hover:shadow-md",
			)}>
			{icon && (
				<div className="transition-transform duration-300 group-hover:scale-110">
					{icon}
				</div>
			)}
			<div
				className={cn(
					"text-sm font-medium mt-1",
					variant === "fancy" &&
						"font-semibold text-primary",
				)}>
				{title}
			</div>
		</Link>
	);
};

const CategoryLink = ({
	href,
	label,
}: {
	href: string;
	label: string;
}) => {
	return (
		<Link
			to={href}
			className="group flex items-center text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground">
			<div className="mr-1.5 flex h-5 w-5 items-center justify-center overflow-hidden">
				<ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
			</div>
			<span className="transition-colors duration-300 group-hover:font-medium">
				{label}
			</span>
		</Link>
	);
};

export default FeaturedProductsMenu;
