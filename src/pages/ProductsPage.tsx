import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
	Link,
	useSearchParams,
	useNavigate,
} from "react-router-dom";
import {
	useQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetHeader,
	SheetTitle,
	SheetFooter,
	SheetClose,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import {
	Heart,
	ShoppingCart,
	Search,
	Filter,
	X,
	ChevronDown,
	ArrowUpDown,
	Check,
	SlidersHorizontal,
	AlertCircle,
	RefreshCw,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
	ProductCard,
	ProductCardSkeleton,
} from "@/components/product";

// Type definitions
type Product = {
	id: string;
	name: string;
	name_ar: string;
	description: string;
	description_ar: string;
	price: number;
	original_price: number | null;
	image: string;
	slug: string;
	is_featured: boolean | null;
	is_new: boolean | null;
	is_on_sale: boolean | null;
	category_id: string | null;
	created_at: string;
};

type Category = {
	id: string;
	name: string;
	name_ar: string;
	slug: string;
};

type SortOptions =
	| "newest"
	| "oldest"
	| "price_asc"
	| "price_desc";

type FilterState = {
	search: string;
	category: string;
	minPrice: number;
	maxPrice: number;
	isNew: boolean;
	isOnSale: boolean;
	isFeatured: boolean;
};

const ProductsPage = () => {
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const { isRTL } = useLanguage();
	const { addToCart } = useCart();
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	const initialSearch = searchParams.get("search") || "";
	const initialCategory =
		searchParams.get("category") || "";
	const initialFilters = searchParams.get("filter") || "";

	const [filters, setFilters] = useState<FilterState>({
		search: initialSearch,
		category: initialCategory,
		minPrice: Number(searchParams.get("min_price")) || 0,
		maxPrice: Number(searchParams.get("max_price")) || 1000,
		isNew: initialFilters.includes("new"),
		isOnSale: initialFilters.includes("sale"),
		isFeatured: initialFilters.includes("featured"),
	});

	const [sort, setSort] = useState<SortOptions>(
		(searchParams.get("sort") as SortOptions) || "newest",
	);
	const [filterOpen, setFilterOpen] = useState(false);

	const { data: categories } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("categories")
				.select("id, name, name_ar, slug")
				.order("name");

			if (error) throw error;
			return data as Category[];
		},
	});

	const {
		data: products,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["products", filters, sort],
		queryFn: async () => {
			let query = supabase.from("products").select("*");

			if (filters.search) {
				query = query.or(
					`name.ilike.%${filters.search}%,name_ar.ilike.%${filters.search}%`,
				);
			}

			if (filters.category) {
				const categoryObj = categories?.find(
					(c) => c.slug === filters.category,
				);
				if (categoryObj) {
					query = query.eq("category_id", categoryObj.id);
				}
			}

			if (filters.isNew) {
				query = query.eq("is_new", true);
			}

			if (filters.isOnSale) {
				query = query.eq("is_on_sale", true);
			}

			if (filters.isFeatured) {
				query = query.eq("is_featured", true);
			}

			query = query
				.gte("price", filters.minPrice)
				.lte("price", filters.maxPrice);

			switch (sort) {
				case "price_asc":
					query = query.order("price", { ascending: true });
					break;
				case "price_desc":
					query = query.order("price", {
						ascending: false,
					});
					break;
				case "newest":
					query = query.order("created_at", {
						ascending: false,
					});
					break;
				case "oldest":
					query = query.order("created_at", {
						ascending: true,
					});
					break;
				default:
					query = query.order("created_at", {
						ascending: false,
					});
			}

			const { data, error } = await query;

			if (error) {
				toast({
					title: t("common.error"),
					description: error.message,
					variant: "destructive",
				});
				throw error;
			}

			return data as Product[];
		},
		enabled: !!categories,
	});

	// Query to fetch wishlist items
	const {
		data: wishlistItems,
		isLoading: isLoadingWishlist,
	} = useQuery({
		queryKey: ["wishlist", user?.id],
		queryFn: async () => {
			if (!user) return [];

			const { data, error } = await supabase
				.from("wish_list")
				.select("product_id")
				.eq("user_id", user.id);

			if (error) {
				console.error("Error fetching wishlist:", error);
				return [];
			}
			return data || [];
		},
		enabled: !!user,
	});

	// Create a Set of product IDs for easy lookup
	const wishlistProductIds = new Set(
		wishlistItems?.map((item) => item.product_id) || [],
	);

	// Mutation to add item to wishlist
	const addToWishlistMutation = useMutation({
		mutationFn: async (productId: string) => {
			if (!user) throw new Error("User not authenticated");

			const { data, error } = await supabase
				.from("wish_list")
				.insert([
					{ user_id: user.id, product_id: productId },
				]);

			if (error) throw error;
			return { data, productId };
		},
		onSuccess: (result) => {
			queryClient.invalidateQueries({
				queryKey: ["wishlist"],
			});
			queryClient.invalidateQueries({
				queryKey: ["favorites"],
			});

			toast({
				title: t("product.addedToWishlist"),
				description: t(
					"product.addedToWishlistDescription",
				),
				action: (
					<Button
						size="sm"
						variant="outline"
						onClick={() => {
							navigate(
								`/favorites?highlight=${result.productId}`,
							);
						}}>
						{t("product.viewWishlist")}
					</Button>
				),
			});
		},
		onError: (error) => {
			toast({
				title: t("common.error"),
				description: error.message,
				variant: "destructive",
			});
		},
	});

	// Mutation to remove item from wishlist
	const removeFromWishlistMutation = useMutation({
		mutationFn: async (productId: string) => {
			if (!user) throw new Error("User not authenticated");

			const { data, error } = await supabase
				.from("wish_list")
				.delete()
				.eq("user_id", user.id)
				.eq("product_id", productId);

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["wishlist"],
			});
			queryClient.invalidateQueries({
				queryKey: ["favorites"],
			});
			toast({
				title: t("product.removedFromWishlist"),
				description: t(
					"product.removedFromWishlistDescription",
				),
			});
		},
		onError: (error) => {
			toast({
				title: t("common.error"),
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const handleAddToWishlist = (product: Product) => {
		if (!user) {
			toast({
				title: t("auth.requiredTitle"),
				description: t("auth.requiredToFavorite"),
				variant: "destructive",
			});
			return;
		}

		const isInWishlist = wishlistProductIds.has(product.id);

		if (isInWishlist) {
			removeFromWishlistMutation.mutate(product.id);
		} else {
			addToWishlistMutation.mutate(product.id);
		}
	};

	useEffect(() => {
		const params = new URLSearchParams();

		if (filters.search)
			params.set("search", filters.search);
		if (filters.category)
			params.set("category", filters.category);

		// Only add price parameters if they're not at default values
		if (filters.minPrice > 0)
			params.set("min_price", filters.minPrice.toString());
		if (filters.maxPrice < 1000)
			params.set("max_price", filters.maxPrice.toString());

		const activeFilters = [];
		if (filters.isNew) activeFilters.push("new");
		if (filters.isOnSale) activeFilters.push("sale");
		if (filters.isFeatured) activeFilters.push("featured");

		if (activeFilters.length > 0) {
			params.set("filter", activeFilters.join(","));
		}

		if (sort !== "newest") {
			params.set("sort", sort);
		}

		setSearchParams(params);
	}, [filters, sort, setSearchParams]);

	const handleFilterChange = (
		key: keyof FilterState,
		value: FilterState[keyof FilterState],
	) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const handleQuickSearch = (
		e: React.FormEvent<HTMLFormElement>,
	) => {
		e.preventDefault();
	};

	const clearFilters = () => {
		setFilters({
			search: "",
			category: "",
			minPrice: 0,
			maxPrice: 1000,
			isNew: false,
			isOnSale: false,
			isFeatured: false,
		});
		setSort("newest");
	};

	const handleAddToCart = (product: Product) => {
		addToCart({
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
		});
	};

	const countActiveFilters = () => {
		let count = 0;
		if (filters.search) count++;
		if (filters.category) count++;
		if (filters.minPrice > 0) count++;
		if (filters.maxPrice < 1000) count++;
		if (filters.isNew) count++;
		if (filters.isOnSale) count++;
		if (filters.isFeatured) count++;
		return count;
	};

	const hasActiveFilters = countActiveFilters() > 0;

	// Handle price range change
	const handlePriceChange = (values: number[]) => {
		if (values.length === 2) {
			setFilters((prev) => ({
				...prev,
				minPrice: values[0],
				maxPrice: values[1],
			}));
		}
	};

	// Empty results component
	const EmptyResults = ({
		onClearFilters,
	}: {
		onClearFilters: () => void;
	}) => {
		const { t } = useTranslation();

		return (
			<div className="text-center py-16">
				<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
					<Search className="h-8 w-8 text-muted-foreground" />
				</div>
				<h2 className="text-xl font-medium mb-2">
					{t("products.noResults")}
				</h2>
				<p className="text-muted-foreground max-w-md mx-auto mb-6">
					{t("products.noResultsDescription")}
				</p>
				<Button onClick={onClearFilters}>
					{t("products.clearFilters")}
				</Button>
			</div>
		);
	};

	// Loading state component
	const ProductsLoading = () => {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{[...Array(8)].map((_, index) => (
					<ProductCardSkeleton key={index} />
				))}
			</div>
		);
	};

	// Error state component
	const ProductsError = ({
		error,
		onRetry,
	}: {
		error: Error;
		onRetry: () => void;
	}) => {
		const { t } = useTranslation();
		return (
			<div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
				<AlertCircle className="w-12 h-12 text-destructive" />
				<h3 className="text-xl font-semibold">
					{t("products.errorLoadingProducts")}
				</h3>
				<p className="text-muted-foreground max-w-md">
					{error.message}
				</p>
				<Button onClick={onRetry} variant="secondary">
					<RefreshCw className="w-4 h-4 mr-2" />
					{t("common.tryAgain")}
				</Button>
			</div>
		);
	};

	// Products grid component
	const ProductsGrid = ({
		products,
		handleAddToCart,
		handleAddToWishlist,
		wishlistItems,
	}: {
		products: Product[];
		handleAddToCart: (product: Product) => void;
		handleAddToWishlist: (product: Product) => void;
		wishlistItems: { product_id: string }[] | null;
	}) => {
		const wishlistProductIds = new Set(
			wishlistItems?.map((item) => item.product_id) || [],
		);

		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						onAddToCart={() => handleAddToCart(product)}
						onAddToWishlist={() =>
							handleAddToWishlist(product)
						}
						isInWishlist={wishlistProductIds.has(
							product.id,
						)}
					/>
				))}
			</div>
		);
	};

	// Product filter sheet for mobile
	const FilterSheet = () => {
		return (
			<Sheet open={filterOpen} onOpenChange={setFilterOpen}>
				<SheetContent
					side={isRTL ? "right" : "left"}
					className="overflow-y-auto">
					<SheetHeader>
						<SheetTitle>{t("filters.title")}</SheetTitle>
					</SheetHeader>

					<div className="py-6 space-y-6">
						{/* Categories */}
						<div className="space-y-3">
							<h3 className="text-sm font-medium">
								{t("products.categories")}
							</h3>
							<div className="space-y-3 pl-2">
								<div className="flex items-center">
									<Button
										variant="ghost"
										className={`w-full justify-start px-2 ${
											!filters.category
												? "font-bold text-primary"
												: ""
										}`}
										onClick={() => {
											handleFilterChange("category", "");
											setFilterOpen(false);
										}}>
										{t("products.allCategories")}
									</Button>
								</div>
								{categories?.map((category) => (
									<div
										key={category.id}
										className="flex items-center">
										<Button
											variant="ghost"
											className={`w-full justify-start px-2 ${
												filters.category === category.slug
													? "font-bold text-primary"
													: ""
											}`}
											onClick={() => {
												handleFilterChange(
													"category",
													category.slug,
												);
												setFilterOpen(false);
											}}>
											{i18n.language === "ar"
												? category.name_ar
												: category.name}
										</Button>
									</div>
								))}
							</div>
						</div>

						<Separator />

						{/* Price Range */}
						<div className="space-y-3">
							<h3 className="text-sm font-medium">
								{t("filters.priceRange")}
							</h3>
							<div className="space-y-5 px-2">
								<Slider
									defaultValue={[
										filters.minPrice,
										filters.maxPrice,
									]}
									max={1000}
									min={0}
									step={10}
									value={[
										filters.minPrice,
										filters.maxPrice,
									]}
									onValueChange={handlePriceChange}
									className="mb-6"
								/>
								<div className="flex items-center justify-between">
									<div className="border rounded-md p-2 w-20">
										<p className="text-[10px] text-muted-foreground">
											Min
										</p>
										<p className="font-medium">
											${filters.minPrice}
										</p>
									</div>
									<div className="border rounded-md p-2 w-20">
										<p className="text-[10px] text-muted-foreground">
											Max
										</p>
										<p className="font-medium">
											${filters.maxPrice}
										</p>
									</div>
								</div>
							</div>
						</div>

						<Separator />

						{/* Product State */}
						<div className="space-y-3">
							<h3 className="text-sm font-medium">
								{t("filters.productState")}
							</h3>
							<div className="space-y-3 px-2">
								<div className="flex items-center space-x-2 rtl:space-x-reverse">
									<Checkbox
										id="mobile-filter-new"
										checked={filters.isNew}
										onCheckedChange={(checked) =>
											handleFilterChange(
												"isNew",
												checked === true,
											)
										}
									/>
									<label
										htmlFor="mobile-filter-new"
										className="text-sm cursor-pointer">
										{t("product.new")}
									</label>
								</div>
								<div className="flex items-center space-x-2 rtl:space-x-reverse">
									<Checkbox
										id="mobile-filter-sale"
										checked={filters.isOnSale}
										onCheckedChange={(checked) =>
											handleFilterChange(
												"isOnSale",
												checked === true,
											)
										}
									/>
									<label
										htmlFor="mobile-filter-sale"
										className="text-sm cursor-pointer">
										{t("product.sale")}
									</label>
								</div>
								<div className="flex items-center space-x-2 rtl:space-x-reverse">
									<Checkbox
										id="mobile-filter-featured"
										checked={filters.isFeatured}
										onCheckedChange={(checked) =>
											handleFilterChange(
												"isFeatured",
												checked === true,
											)
										}
									/>
									<label
										htmlFor="mobile-filter-featured"
										className="text-sm cursor-pointer">
										{t("home.featured")}
									</label>
								</div>
							</div>
						</div>
					</div>

					<SheetFooter className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
						<div className="flex justify-between w-full gap-4">
							<Button
								variant="outline"
								className="flex-1"
								onClick={clearFilters}
								disabled={countActiveFilters() === 0}>
								<X className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
								{t("filters.clearAll")}
							</Button>
							<SheetClose asChild>
								<Button className="flex-1">
									{t("filters.apply")} (
									{countActiveFilters()})
								</Button>
							</SheetClose>
						</div>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		);
	};

	// Determine main content based on state
	let content;

	if (isLoading) {
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
	if (!isLoading && products?.length === 0) {
		content = (
			<EmptyResults onClearFilters={clearFilters} />
		);
	}

	if (products && products?.length > 0) {
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

			<div className="flex flex-col md:flex-row gap-6">
				<div className="flex-1">
					<div className="flex flex-col md:flex-row gap-6">
						<div className="flex-1">
							<div className="flex flex-col gap-4 mb-6">
								<div className="flex items-center gap-4">
									<form
										onSubmit={handleQuickSearch}
										className="flex-1">
										<div className="relative">
											<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
											<Input
												placeholder={t(
													"products.searchPlaceholder",
												)}
												value={filters.search}
												onChange={(e) =>
													handleFilterChange(
														"search",
														e.target.value,
													)
												}
												className="pl-9"
											/>
										</div>
									</form>

									<Sheet
										open={filterOpen}
										onOpenChange={setFilterOpen}>
										<SheetTrigger asChild>
											<Button
												variant="outline"
												size="icon"
												className="h-10 w-10">
												<SlidersHorizontal className="h-4 w-4" />
												<span className="sr-only">
													{t("filters.title")}
												</span>
											</Button>
										</SheetTrigger>
										<SheetContent
											side={isRTL ? "right" : "left"}
											className="overflow-y-auto">
											<SheetHeader>
												<SheetTitle>
													{t("filters.title")}
												</SheetTitle>
											</SheetHeader>

											<div className="py-6 space-y-6">
												{/* Categories */}
												<div className="space-y-3">
													<h3 className="text-sm font-medium">
														{t("products.categories")}
													</h3>
													<div className="space-y-3 pl-2">
														<div className="flex items-center">
															<Button
																variant="ghost"
																className={`w-full justify-start px-2 ${
																	!filters.category
																		? "font-bold text-primary"
																		: ""
																}`}
																onClick={() => {
																	handleFilterChange(
																		"category",
																		"",
																	);
																	setFilterOpen(false);
																}}>
																{t(
																	"products.allCategories",
																)}
															</Button>
														</div>
														{categories?.map((category) => (
															<div
																key={category.id}
																className="flex items-center">
																<Button
																	variant="ghost"
																	className={`w-full justify-start px-2 ${
																		filters.category ===
																		category.slug
																			? "font-bold text-primary"
																			: ""
																	}`}
																	onClick={() => {
																		handleFilterChange(
																			"category",
																			category.slug,
																		);
																		setFilterOpen(false);
																	}}>
																	{i18n.language === "ar"
																		? category.name_ar
																		: category.name}
																</Button>
															</div>
														))}
													</div>
												</div>

												<Separator />

												{/* Price Range */}
												<div className="space-y-3">
													<h3 className="text-sm font-medium">
														{t("filters.priceRange")}
													</h3>
													<div className="space-y-5 px-2">
														<Slider
															defaultValue={[
																filters.minPrice,
																filters.maxPrice,
															]}
															max={1000}
															min={0}
															step={10}
															value={[
																filters.minPrice,
																filters.maxPrice,
															]}
															onValueChange={
																handlePriceChange
															}
															className="mb-6"
														/>
														<div className="flex items-center justify-between">
															<div className="border rounded-md p-2 w-20">
																<p className="text-[10px] text-muted-foreground">
																	Min
																</p>
																<p className="font-medium">
																	${filters.minPrice}
																</p>
															</div>
															<div className="border rounded-md p-2 w-20">
																<p className="text-[10px] text-muted-foreground">
																	Max
																</p>
																<p className="font-medium">
																	${filters.maxPrice}
																</p>
															</div>
														</div>
													</div>
												</div>

												<Separator />

												{/* Product State */}
												<div className="space-y-3">
													<h3 className="text-sm font-medium">
														{t("filters.productState")}
													</h3>
													<div className="space-y-3 px-2">
														<div className="flex items-center space-x-2 rtl:space-x-reverse">
															<Checkbox
																id="mobile-filter-new"
																checked={filters.isNew}
																onCheckedChange={(
																	checked,
																) =>
																	handleFilterChange(
																		"isNew",
																		checked === true,
																	)
																}
															/>
															<label
																htmlFor="mobile-filter-new"
																className="text-sm cursor-pointer">
																{t("product.new")}
															</label>
														</div>
														<div className="flex items-center space-x-2 rtl:space-x-reverse">
															<Checkbox
																id="mobile-filter-sale"
																checked={filters.isOnSale}
																onCheckedChange={(
																	checked,
																) =>
																	handleFilterChange(
																		"isOnSale",
																		checked === true,
																	)
																}
															/>
															<label
																htmlFor="mobile-filter-sale"
																className="text-sm cursor-pointer">
																{t("product.sale")}
															</label>
														</div>
														<div className="flex items-center space-x-2 rtl:space-x-reverse">
															<Checkbox
																id="mobile-filter-featured"
																checked={filters.isFeatured}
																onCheckedChange={(
																	checked,
																) =>
																	handleFilterChange(
																		"isFeatured",
																		checked === true,
																	)
																}
															/>
															<label
																htmlFor="mobile-filter-featured"
																className="text-sm cursor-pointer">
																{t("home.featured")}
															</label>
														</div>
													</div>
												</div>
											</div>

											<SheetFooter className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
												<div className="flex justify-between w-full gap-4">
													<Button
														variant="outline"
														className="flex-1"
														onClick={clearFilters}
														disabled={
															countActiveFilters() === 0
														}>
														<X className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
														{t("filters.clearAll")}
													</Button>
													<SheetClose asChild>
														<Button className="flex-1">
															{t("filters.apply")} (
															{countActiveFilters()})
														</Button>
													</SheetClose>
												</div>
											</SheetFooter>
										</SheetContent>
									</Sheet>
								</div>

								{/* Active filters */}
								{hasActiveFilters && (
									<div className="flex flex-wrap gap-2">
										{filters.search && (
											<Badge
												variant="secondary"
												className="gap-1">
												{t("products.search")}:{" "}
												{filters.search}
												<Button
													variant="ghost"
													size="icon"
													className="h-4 w-4 p-0 hover:bg-transparent"
													onClick={() =>
														handleFilterChange("search", "")
													}>
													<X className="h-3 w-3" />
												</Button>
											</Badge>
										)}
										{filters.category && (
											<Badge
												variant="secondary"
												className="gap-1">
												{t("products.category")}:{" "}
												{i18n.language === "ar"
													? categories?.find(
															(c) =>
																c.slug === filters.category,
													  )?.name_ar
													: categories?.find(
															(c) =>
																c.slug === filters.category,
													  )?.name}
												<Button
													variant="ghost"
													size="icon"
													className="h-4 w-4 p-0 hover:bg-transparent"
													onClick={() =>
														handleFilterChange(
															"category",
															"",
														)
													}>
													<X className="h-3 w-3" />
												</Button>
											</Badge>
										)}
										{(filters.minPrice > 0 ||
											filters.maxPrice < 1000) && (
											<Badge
												variant="secondary"
												className="gap-1">
												{t("filters.priceRange")}: $
												{filters.minPrice} - $
												{filters.maxPrice}
												<Button
													variant="ghost"
													size="icon"
													className="h-4 w-4 p-0 hover:bg-transparent"
													onClick={() =>
														handleFilterChange(
															"minPrice",
															0,
														)
													}>
													<X className="h-3 w-3" />
												</Button>
											</Badge>
										)}
										{filters.isNew && (
											<Badge
												variant="secondary"
												className="gap-1">
												{t("product.new")}
												<Button
													variant="ghost"
													size="icon"
													className="h-4 w-4 p-0 hover:bg-transparent"
													onClick={() =>
														handleFilterChange(
															"isNew",
															false,
														)
													}>
													<X className="h-3 w-3" />
												</Button>
											</Badge>
										)}
										{filters.isOnSale && (
											<Badge
												variant="secondary"
												className="gap-1">
												{t("product.sale")}
												<Button
													variant="ghost"
													size="icon"
													className="h-4 w-4 p-0 hover:bg-transparent"
													onClick={() =>
														handleFilterChange(
															"isOnSale",
															false,
														)
													}>
													<X className="h-3 w-3" />
												</Button>
											</Badge>
										)}
										{filters.isFeatured && (
											<Badge
												variant="secondary"
												className="gap-1">
												{t("home.featured")}
												<Button
													variant="ghost"
													size="icon"
													className="h-4 w-4 p-0 hover:bg-transparent"
													onClick={() =>
														handleFilterChange(
															"isFeatured",
															false,
														)
													}>
													<X className="h-3 w-3" />
												</Button>
											</Badge>
										)}
									</div>
								)}
							</div>
							{content}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductsPage;
