import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	useParams,
	Link,
	useNavigate,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
	ShoppingCart,
	ArrowLeft,
	Filter,
	ChevronDown,
	Check,
	X,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
	ProductCard,
	ProductCardSkeleton,
} from "@/components/product";
import {
	CategoryCard,
	CategoryCardSkeleton,
} from "@/components/category";
import { Separator } from "@/components/ui/separator";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetFooter,
	SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type Product = {
	id: string;
	name: string;
	name_ar: string;
	price: number;
	original_price: number | null;
	image: string;
	images: string[] | null;
	slug: string;
	is_new: boolean | null;
	is_on_sale: boolean | null;
	category_id: string | null;
};

type Category = {
	id: string;
	name: string;
	name_ar: string;
	slug: string;
	image: string | null;
	parent_id: string | null;
};

type SortOption =
	| "newest"
	| "price_low"
	| "price_high"
	| "name_asc"
	| "name_desc";

const sortOptions = [
	{ value: "newest", label: "Newest" },
	{ value: "price_low", label: "Price: Low to High" },
	{ value: "price_high", label: "Price: High to Low" },
	{ value: "name_asc", label: "Name: A to Z" },
	{ value: "name_desc", label: "Name: Z to A" },
];

const CategoryPage = () => {
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const { isRTL } = useLanguage();
	const { addToCart } = useCart();
	const { slug } = useParams<{ slug: string }>();
	const navigate = useNavigate();

	// State for filters and sorting
	const [sortBy, setSortBy] =
		useState<SortOption>("newest");
	const [priceRange, setPriceRange] = useState<string[]>(
		[],
	);
	const [selectedFilters, setSelectedFilters] = useState<{
		onSale: boolean;
		newArrivals: boolean;
	}>({
		onSale: false,
		newArrivals: false,
	});

	// Fetch category details
	const { data: category, isLoading: categoryLoading } =
		useQuery({
			queryKey: ["category", slug],
			queryFn: async () => {
				const { data, error } = await supabase
					.from("categories")
					.select("*")
					.eq("slug", slug)
					.single();

				if (error) {
					throw error;
				}

				return data as Category;
			},
		});

	// Fetch subcategories
	const {
		data: subcategories,
		isLoading: subcategoriesLoading,
	} = useQuery({
		queryKey: ["subcategories", category?.id],
		queryFn: async () => {
			if (!category) return null;

			const { data, error } = await supabase
				.from("categories")
				.select("*, products:products(id)")
				.eq("parent_id", category.id);

			if (error) {
				throw error;
			}

			// Transform to include product count
			return data.map((subcat) => ({
				...subcat,
				products_count: subcat.products?.length || 0,
				products: undefined,
			})) as Category[];
		},
		enabled: !!category,
	});

	// Fetch products in this category
	const { data: products, isLoading: productsLoading } =
		useQuery({
			queryKey: [
				"categoryProducts",
				category?.id,
				sortBy,
				selectedFilters,
				priceRange,
			],
			queryFn: async () => {
				if (!category) return null;

				let query = supabase
					.from("products")
					.select("*")
					.eq("category_id", category.id);

				// Apply filters
				if (selectedFilters.onSale) {
					query = query.eq("is_on_sale", true);
				}

				if (selectedFilters.newArrivals) {
					query = query.eq("is_new", true);
				}

				// Apply price range filter if selected
				if (priceRange.includes("under50")) {
					query = query.lt("price", 50);
				}
				if (priceRange.includes("50to100")) {
					query = query.gte("price", 50).lte("price", 100);
				}
				if (priceRange.includes("100to200")) {
					query = query.gte("price", 100).lte("price", 200);
				}
				if (priceRange.includes("over200")) {
					query = query.gt("price", 200);
				}

				// Apply sorting
				switch (sortBy) {
					case "price_low":
						query = query.order("price", {
							ascending: true,
						});
						break;
					case "price_high":
						query = query.order("price", {
							ascending: false,
						});
						break;
					case "name_asc":
						query = query.order(
							i18n.language === "ar" ? "name_ar" : "name",
							{ ascending: true },
						);
						break;
					case "name_desc":
						query = query.order(
							i18n.language === "ar" ? "name_ar" : "name",
							{ ascending: false },
						);
						break;
					case "newest":
					default:
						query = query.order("created_at", {
							ascending: false,
						});
						break;
				}

				const { data, error } = await query;

				if (error) {
					throw error;
				}

				return data as Product[];
			},
			enabled: !!category,
		});

	const isLoading = categoryLoading || productsLoading;
	const hasActiveFilters =
		selectedFilters.onSale ||
		selectedFilters.newArrivals ||
		priceRange.length > 0;

	const handleAddToCart = (product: Product) => {
		addToCart({
			id: product.id,
			product_id: product.id,
			quantity: 1,
			name: product.name,
			name_ar: product.name_ar,
			price: product.price,
			image: product.image,
		});

		toast({
			title: t("product.addedToCart"),
			description: t("product.addedToCartDescription"),
			action: (
				<Button
					size="sm"
					variant="outline"
					onClick={() => navigate("/cart")}>
					{t("cart.title")}
				</Button>
			),
		});
	};

	const handlePriceRangeChange = (value: string) => {
		setPriceRange(
			priceRange.includes(value)
				? priceRange.filter((range) => range !== value)
				: [...priceRange, value],
		);
	};

	const handleFilterChange = (
		key: keyof typeof selectedFilters,
	) => {
		setSelectedFilters({
			...selectedFilters,
			[key]: !selectedFilters[key],
		});
	};

	const clearAllFilters = () => {
		setPriceRange([]);
		setSelectedFilters({
			onSale: false,
			newArrivals: false,
		});
		setSortBy("newest");
	};

	if (isLoading) {
		return (
			<div className="container py-8 md:py-12">
				<div className="animate-pulse">
					<div className="h-8 w-1/4 bg-muted rounded mb-2"></div>
					<div className="h-10 w-1/2 bg-muted rounded mb-8"></div>

					<div className="flex justify-between items-center mb-8">
						<div className="h-10 w-32 bg-muted rounded"></div>
						<div className="h-10 w-48 bg-muted rounded"></div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{[...Array(8)].map((_, index) => (
							<ProductCardSkeleton key={index} />
						))}
					</div>
				</div>
			</div>
		);
	}

	if (!category) {
		return (
			<div className="container py-12">
				<div className="text-center py-12">
					<h1 className="text-2xl font-bold mb-4">
						{t("category.notFound")}
					</h1>
					<p className="text-muted-foreground mb-6">
						{t("category.notFoundDescription")}
					</p>
					<Button asChild>
						<Link to="/categories">
							{t("category.browseCategories")}
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	const displayName =
		i18n.language === "ar"
			? category.name_ar
			: category.name;

	return (
		<div className="container py-8 md:py-12">
			<div className="mb-8">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate(-1)}
					className="mb-4">
					<ArrowLeft className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
					{t("common.back")}
				</Button>

				<h1 className="text-3xl font-bold mb-2">
					{displayName}
				</h1>
				<p className="text-muted-foreground">
					{products?.length
						? t("category.productsCount", {
								count: products.length,
						  })
						: t("category.noProducts")}
				</p>
			</div>

			{/* Subcategories Section (if any) */}
			{subcategories && subcategories.length > 0 && (
				<div className="mb-12">
					<h2 className="text-xl font-medium mb-6">
						{t("category.subcategories")}
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{subcategories.map((subcategory, index) => (
							<CategoryCard
								key={subcategory.id}
								category={subcategory}
								imagePriority={index < 4}
							/>
						))}
					</div>
					<Separator className="my-10" />
				</div>
			)}

			{/* Filters and Sorting UI */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
				<div className="flex flex-wrap items-center gap-2">
					{/* Mobile Filter Sheet */}
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="lg:hidden">
								<Filter className="h-4 w-4 mr-2" />
								{t("filters.title")}
								{hasActiveFilters && (
									<Badge
										variant="secondary"
										className="ml-2 px-1 py-0 h-5 min-w-5 flex items-center justify-center">
										{priceRange.length +
											(selectedFilters.onSale ? 1 : 0) +
											(selectedFilters.newArrivals ? 1 : 0)}
									</Badge>
								)}
							</Button>
						</SheetTrigger>
						<SheetContent side="left">
							<SheetHeader>
								<SheetTitle>
									{t("filters.title")}
								</SheetTitle>
							</SheetHeader>

							<div className="mt-6 space-y-6">
								{/* Price Range */}
								<div>
									<h3 className="text-sm font-medium mb-3">
										{t("filters.priceRange")}
									</h3>
									<div className="space-y-2">
										<div className="flex items-center space-x-2">
											<Checkbox
												id="under50-mobile"
												checked={priceRange.includes(
													"under50",
												)}
												onCheckedChange={() =>
													handlePriceRangeChange("under50")
												}
											/>
											<label
												htmlFor="under50-mobile"
												className="text-sm">
												{t("filters.under")} $50
											</label>
										</div>

										<div className="flex items-center space-x-2">
											<Checkbox
												id="50to100-mobile"
												checked={priceRange.includes(
													"50to100",
												)}
												onCheckedChange={() =>
													handlePriceRangeChange("50to100")
												}
											/>
											<label
												htmlFor="50to100-mobile"
												className="text-sm">
												$50 - $100
											</label>
										</div>

										<div className="flex items-center space-x-2">
											<Checkbox
												id="100to200-mobile"
												checked={priceRange.includes(
													"100to200",
												)}
												onCheckedChange={() =>
													handlePriceRangeChange("100to200")
												}
											/>
											<label
												htmlFor="100to200-mobile"
												className="text-sm">
												$100 - $200
											</label>
										</div>

										<div className="flex items-center space-x-2">
											<Checkbox
												id="over200-mobile"
												checked={priceRange.includes(
													"over200",
												)}
												onCheckedChange={() =>
													handlePriceRangeChange("over200")
												}
											/>
											<label
												htmlFor="over200-mobile"
												className="text-sm">
												{t("filters.over")} $200
											</label>
										</div>
									</div>
								</div>

								<Separator />

								{/* Product State */}
								<div>
									<h3 className="text-sm font-medium mb-3">
										{t("filters.productState")}
									</h3>
									<div className="space-y-2">
										<div className="flex items-center space-x-2">
											<Checkbox
												id="on-sale-mobile"
												checked={selectedFilters.onSale}
												onCheckedChange={() =>
													handleFilterChange("onSale")
												}
											/>
											<label
												htmlFor="on-sale-mobile"
												className="text-sm">
												{t("filters.onSale")}
											</label>
										</div>

										<div className="flex items-center space-x-2">
											<Checkbox
												id="new-arrivals-mobile"
												checked={
													selectedFilters.newArrivals
												}
												onCheckedChange={() =>
													handleFilterChange("newArrivals")
												}
											/>
											<label
												htmlFor="new-arrivals-mobile"
												className="text-sm">
												{t("filters.newArrivals")}
											</label>
										</div>
									</div>
								</div>
							</div>

							<SheetFooter className="absolute bottom-0 left-0 right-0 p-4 border-t">
								<div className="flex justify-between w-full gap-4">
									<Button
										variant="outline"
										className="flex-1"
										onClick={clearAllFilters}
										disabled={!hasActiveFilters}>
										<X className="h-4 w-4 mr-2" />
										{t("filters.clearAll")}
									</Button>
									<SheetClose asChild>
										<Button className="flex-1">
											{t("filters.apply")}
										</Button>
									</SheetClose>
								</div>
							</SheetFooter>
						</SheetContent>
					</Sheet>

					{/* Desktop Filter Dropdowns */}
					<div className="hidden lg:flex items-center gap-2">
						{/* Price Range Filter */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm">
									{t("filters.price")}
									{priceRange.length > 0 && (
										<Badge
											variant="secondary"
											className="ml-2 px-1 py-0 h-5 min-w-5 flex items-center justify-center">
											{priceRange.length}
										</Badge>
									)}
									<ChevronDown className="ml-2 h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="start"
								className="w-56">
								<div className="p-2">
									<div className="space-y-2">
										<div className="flex items-center space-x-2">
											<Checkbox
												id="under50"
												checked={priceRange.includes(
													"under50",
												)}
												onCheckedChange={() =>
													handlePriceRangeChange("under50")
												}
											/>
											<label
												htmlFor="under50"
												className="text-sm">
												{t("filters.under")} $50
											</label>
										</div>

										<div className="flex items-center space-x-2">
											<Checkbox
												id="50to100"
												checked={priceRange.includes(
													"50to100",
												)}
												onCheckedChange={() =>
													handlePriceRangeChange("50to100")
												}
											/>
											<label
												htmlFor="50to100"
												className="text-sm">
												$50 - $100
											</label>
										</div>

										<div className="flex items-center space-x-2">
											<Checkbox
												id="100to200"
												checked={priceRange.includes(
													"100to200",
												)}
												onCheckedChange={() =>
													handlePriceRangeChange("100to200")
												}
											/>
											<label
												htmlFor="100to200"
												className="text-sm">
												$100 - $200
											</label>
										</div>

										<div className="flex items-center space-x-2">
											<Checkbox
												id="over200"
												checked={priceRange.includes(
													"over200",
												)}
												onCheckedChange={() =>
													handlePriceRangeChange("over200")
												}
											/>
											<label
												htmlFor="over200"
												className="text-sm">
												{t("filters.over")} $200
											</label>
										</div>
									</div>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Product State Filter */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm">
									{t("filters.state")}
									{(selectedFilters.onSale ||
										selectedFilters.newArrivals) && (
										<Badge
											variant="secondary"
											className="ml-2 px-1 py-0 h-5 min-w-5 flex items-center justify-center">
											{(selectedFilters.onSale ? 1 : 0) +
												(selectedFilters.newArrivals
													? 1
													: 0)}
										</Badge>
									)}
									<ChevronDown className="ml-2 h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="start"
								className="w-56">
								<div className="p-2">
									<div className="space-y-2">
										<div className="flex items-center space-x-2">
											<Checkbox
												id="on-sale"
												checked={selectedFilters.onSale}
												onCheckedChange={() =>
													handleFilterChange("onSale")
												}
											/>
											<label
												htmlFor="on-sale"
												className="text-sm">
												{t("filters.onSale")}
											</label>
										</div>

										<div className="flex items-center space-x-2">
											<Checkbox
												id="new-arrivals"
												checked={
													selectedFilters.newArrivals
												}
												onCheckedChange={() =>
													handleFilterChange("newArrivals")
												}
											/>
											<label
												htmlFor="new-arrivals"
												className="text-sm">
												{t("filters.newArrivals")}
											</label>
										</div>
									</div>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Clear Filters */}
						{hasActiveFilters && (
							<Button
								variant="ghost"
								size="sm"
								onClick={clearAllFilters}
								className="text-muted-foreground hover:text-foreground">
								<X className="h-4 w-4 mr-2" />
								{t("filters.clearAll")}
							</Button>
						)}
					</div>
				</div>

				{/* Sorting */}
				<div className="w-full lg:w-auto">
					<Select
						value={sortBy}
						onValueChange={(value) =>
							setSortBy(value as SortOption)
						}>
						<SelectTrigger className="w-full lg:w-[220px]">
							<SelectValue
								placeholder={t("filters.sortBy")}
							/>
						</SelectTrigger>
						<SelectContent>
							{sortOptions.map((option) => (
								<SelectItem
									key={option.value}
									value={option.value}>
									{t(`filters.${option.value}`)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Active filters display */}
			{hasActiveFilters && (
				<div className="flex flex-wrap gap-2 mb-6">
					{selectedFilters.onSale && (
						<Badge
							variant="secondary"
							className="px-3 py-1">
							{t("filters.onSale")}
							<button
								className="ml-2"
								onClick={() =>
									handleFilterChange("onSale")
								}>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}

					{selectedFilters.newArrivals && (
						<Badge
							variant="secondary"
							className="px-3 py-1">
							{t("filters.newArrivals")}
							<button
								className="ml-2"
								onClick={() =>
									handleFilterChange("newArrivals")
								}>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}

					{priceRange.includes("under50") && (
						<Badge
							variant="secondary"
							className="px-3 py-1">
							{t("filters.under")} $50
							<button
								className="ml-2"
								onClick={() =>
									handlePriceRangeChange("under50")
								}>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}

					{priceRange.includes("50to100") && (
						<Badge
							variant="secondary"
							className="px-3 py-1">
							$50 - $100
							<button
								className="ml-2"
								onClick={() =>
									handlePriceRangeChange("50to100")
								}>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}

					{priceRange.includes("100to200") && (
						<Badge
							variant="secondary"
							className="px-3 py-1">
							$100 - $200
							<button
								className="ml-2"
								onClick={() =>
									handlePriceRangeChange("100to200")
								}>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}

					{priceRange.includes("over200") && (
						<Badge
							variant="secondary"
							className="px-3 py-1">
							{t("filters.over")} $200
							<button
								className="ml-2"
								onClick={() =>
									handlePriceRangeChange("over200")
								}>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					)}
				</div>
			)}

			{/* Products Grid */}
			{products && products.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{products.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							onAddToCart={() => handleAddToCart(product)}
						/>
					))}
				</div>
			) : (
				<div className="text-center py-16">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
						<ShoppingCart className="h-8 w-8 text-muted-foreground" />
					</div>
					<h2 className="text-xl font-medium mb-2">
						{hasActiveFilters
							? t("category.noFilteredProducts")
							: t("category.noProducts")}
					</h2>
					<p className="text-muted-foreground max-w-md mx-auto mb-6">
						{hasActiveFilters
							? t("category.noFilteredProductsDescription")
							: t("category.noProductsDescription")}
					</p>
					{hasActiveFilters ? (
						<Button onClick={clearAllFilters}>
							{t("filters.clearAll")}
						</Button>
					) : (
						<Button asChild>
							<Link to="/products">
								{t("category.browseAllProducts")}
							</Link>
						</Button>
					)}
				</div>
			)}
		</div>
	);
};

export default CategoryPage;
