import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
	ArrowLeft,
	Loader2,
	SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductsGrid } from "@/features/products/components/product-grid";
import { useCategoryDetails } from "@/features/categories/hooks";
import { useWishlistContext } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import type {
	Product,
	SortOptions,
} from "@/features/products/types";

const ModernCategoryPage = () => {
	const { t, i18n } = useTranslation();
	const {
		category,
		products,
		isLoading,
		error,
		sort,
		setSort,
	} = useCategoryDetails();
	const isArabic = i18n.language === "ar";

	const { wishlistItems } = useWishlistContext();
	const { addToCart } = useCart();

	// Handle adding to cart
	const handleAddToCart = (product: Product) => {
		addToCart({
			product_id: product.id,
			quantity: 1,
			name: product.name,
			name_ar: product.name_ar,
			price: product.price,
			image: product.image,
		});
	};

	// Handle adding to wishlist
	const {
		addToWishlist,
		removeFromWishlist,
		isInWishlist,
	} = useWishlistContext();

	const handleAddToWishlist = (product: Product) => {
		if (isInWishlist(product.id)) {
			removeFromWishlist(product.id);
		} else {
			addToWishlist(product.id);
		}
	};

	// Handle sort change
	const handleSortChange = (newSort: SortOptions) => {
		setSort(newSort);
	};

	const sortOptions: {
		value: SortOptions;
		label: string;
	}[] = [
		{ value: "newest", label: t("products.sortNewest") },
		{ value: "oldest", label: t("products.sortOldest") },
		{
			value: "price_asc",
			label: t("products.sortPriceAsc"),
		},
		{
			value: "price_desc",
			label: t("products.sortPriceDesc"),
		},
	];

	if (isLoading) {
		return (
			<div className="container py-16 flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (error || !category) {
		return (
			<div className="container py-16">
				<div className="max-w-lg mx-auto text-center">
					<h1 className="text-2xl font-bold">
						{t("category.notFound")}
					</h1>
					<p className="mt-2 text-muted-foreground">
						{t("category.notFoundDescription")}
					</p>
					<Button asChild className="mt-6">
						<Link to="/categories">
							<ArrowLeft className="mr-2 h-4 w-4" />
							{t("category.backToCategories")}
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	// Define breadcrumb items
	const breadcrumbItems = [
		{
			href: "/categories",
			translationKey: "common.categories",
		},
		{
			href: `/category/${category.slug}`,
			label:
				isArabic && category.name_ar
					? category.name_ar
					: category.name,
		},
	];

	return (
		<div className="container py-8 md:py-12">
			{/* Breadcrumb */}
			<Breadcrumbs
				items={breadcrumbItems}
				className="mb-6"
			/>

			{/* Category header */}
			<div className="mb-8">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold">
							{isArabic && category.name_ar
								? category.name_ar
								: category.name}
						</h1>
						{category.description && (
							<p className="mt-2 text-muted-foreground">
								{isArabic && category.description_ar
									? category.description_ar
									: category.description}
							</p>
						)}
					</div>

					{/* Sort dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								<SlidersHorizontal className="mr-2 h-4 w-4" />
								{sortOptions.find(
									(option) => option.value === sort,
								)?.label || t("products.sort")}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{sortOptions.map((option) => (
								<DropdownMenuItem
									key={option.value}
									onClick={() =>
										handleSortChange(option.value)
									}
									className={
										sort === option.value
											? "bg-muted font-medium"
											: ""
									}>
									{option.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<Separator className="mb-8" />

			{/* Products grid */}
			{products.length > 0 ? (
				<Suspense
					fallback={
						<div className="min-h-[400px] flex items-center justify-center">
							<Loader2 className="h-6 w-6 animate-spin" />
						</div>
					}>
					<ProductsGrid
						products={products}
						handleAddToCart={handleAddToCart}
						handleAddToWishlist={handleAddToWishlist}
						wishlistItems={wishlistItems}
					/>
				</Suspense>
			) : (
				<div className="py-16 text-center">
					<p className="text-lg font-medium">
						{t("category.noProducts")}
					</p>
					<p className="mt-2 text-muted-foreground">
						{t("category.noProductsDescription")}
					</p>
					<Button asChild className="mt-6">
						<Link to="/products">
							{t("category.browseAllProducts")}
						</Link>
					</Button>
				</div>
			)}
		</div>
	);
};

export default ModernCategoryPage;
