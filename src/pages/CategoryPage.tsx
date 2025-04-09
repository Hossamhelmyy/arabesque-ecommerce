import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import { useWishlistContext } from "@/context/WishlistContext";
import { useCategoryDetails } from "@/features/categories/hooks";
import {
	ProductsGrid,
	ProductsGridSkeleton,
} from "@/features/products/components";
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
			<div className="container py-8 md:py-12">
				<div className="mb-8">
					<ProductsGridSkeleton count={12} />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container py-16 flex flex-col items-center justify-center">
				<div className="text-destructive mb-4">
					<span className="sr-only">
						{t("common.error")}
					</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-8 w-8 mx-auto">
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
				</div>
				<p className="text-muted-foreground">
					{t("common.error")}
				</p>
			</div>
		);
	}

	return (
		<div className="container py-8 md:py-12">
			<div className="mb-8">
				<h1 className="text-2xl md:text-3xl font-bold mb-4">
					{isArabic ? category?.name_ar : category?.name}
				</h1>
				<p className="text-muted-foreground">
					{products?.length} {t("products.results")}
				</p>
			</div>

			<ProductsGrid
				products={products || []}
				onAddToCart={handleAddToCart}
				onAddToWishlist={handleAddToWishlist}
				isInWishlist={isInWishlist}
			/>
		</div>
	);
};

export default ModernCategoryPage;
