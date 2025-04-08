import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { ProductsGrid } from "@/features/products/components/product-grid";
import {
	FilterBadges,
	SearchBar,
	FilterSheet,
} from "@/features/products/components/filters";
import {
	ProductsLoading,
	ProductsError,
	EmptyResults,
} from "@/features/products/components/product-state";
import { useProducts } from "@/features/products/hooks";

const ProductsPage = () => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();

	// Use the hook directly
	const {
		filters,
		sort,
		setSort,
		filterOpen,
		setFilterOpen,
		products,
		categories,
		isLoading,
		error,
		refetch,
		wishlistItems,
		handleAddToWishlist,
		handleFilterChange,
		handleQuickSearch,
		clearFilters,
		handleAddToCart,
		countActiveFilters,
		handlePriceChange,
	} = useProducts();

	// Determine main content based on state
	let content;

	if (isLoading && !products) {
		content = <ProductsLoading />;
	}
	if (error && !isLoading) {
		content = (
			<ProductsError
				error={error as Error}
				onRetry={refetch}
			/>
		);
	}
	if (products?.length === 0 && !isLoading) {
		content = (
			<EmptyResults onClearFilters={clearFilters} />
		);
	}
	if (products?.length > 0) {
		content = (
			<ProductsGrid
				products={products}
				handleAddToCart={handleAddToCart}
				handleAddToWishlist={handleAddToWishlist}
				wishlistItems={wishlistItems}
			/>
		);
	}

	return (
		<div className="container py-8 md:py-12">
			<h1 className="text-3xl font-bold mb-8">
				{t("products.title")}
			</h1>

			<div className="flex flex-col md:flex-row gap-8">
				{/* Main content */}
				<div className="flex-1">
					<div className="space-y-6">
						{/* Search and filter controls */}
						<SearchBar
							search={filters.search}
							handleFilterChange={handleFilterChange}
							handleQuickSearch={handleQuickSearch}
							setFilterOpen={setFilterOpen}
						/>

						{/* Filter badges */}
						<FilterBadges
							filters={filters}
							categories={categories}
							handleFilterChange={handleFilterChange}
						/>

						{/* Filter sheet (mobile) */}
						<FilterSheet
							filterOpen={filterOpen}
							setFilterOpen={setFilterOpen}
							filters={filters}
							categories={categories}
							handleFilterChange={handleFilterChange}
							handlePriceChange={handlePriceChange}
							clearFilters={clearFilters}
							countActiveFilters={countActiveFilters}
							isRTL={isRTL}
						/>

						{/* Products grid or appropriate state component */}
						{content}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductsPage;
