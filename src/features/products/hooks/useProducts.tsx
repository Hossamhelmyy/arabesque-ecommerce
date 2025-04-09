import React, { useState, useEffect } from "react";
import {
	useSearchParams,
	useNavigate,
	useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
	useQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
	FilterState,
	SortOptions,
	Product,
	Category,
	ProductsData,
} from "../types";

// Create a safer navigation function to use in the hook
const useSafeNavigate = () => {
	try {
		// This will throw an error if used outside of Router context
		return useNavigate();
	} catch (error) {
		// Return a dummy navigate function that logs the error
		return (path: string) => {
			console.error(
				"Navigation attempted outside Router context to:",
				path,
			);
			return false;
		};
	}
};

// Create a safer version of useSearchParams
const useSafeSearchParams = () => {
	try {
		// This will throw if used outside of Router context
		return useSearchParams();
	} catch (error) {
		// Create a more complete mock of URLSearchParams
		const mockParams: URLSearchParams = {
			append: () => {},
			delete: () => {},
			entries: () => new URLSearchParams().entries(),
			forEach: () => {},
			get: () => null,
			getAll: () => [],
			has: () => false,
			keys: () => new URLSearchParams().keys(),
			set: () => {},
			sort: () => {},
			toString: () => "",
			values: () => new URLSearchParams().values(),
			[Symbol.iterator]: function* () {
				yield* [];
			},
			size: 0,
		} as unknown as URLSearchParams;

		// Return dummy implementations that won't throw
		return [mockParams, () => {}] as const;
	}
};

const useProducts = (): ProductsData => {
	const { t } = useTranslation();
	const { addToCart } = useCart();
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const navigate = useSafeNavigate();
	const [searchParams, setSearchParams] =
		useSafeSearchParams();

	const initialSearch = searchParams.get("search") || "";
	const initialCategory =
		searchParams.get("category") || "";
	const initialFilters = searchParams.get("filter") || "";

	const [filters, setFilters] = useState<FilterState>({
		search: initialSearch,
		category: initialCategory,
		minPrice: Number(searchParams.get("min_price")) || 0,
		maxPrice:
			Number(searchParams.get("max_price")) || 10000,
		isNew: initialFilters?.includes("new") || false,
		isOnSale: initialFilters?.includes("sale") || false,
		isFeatured:
			initialFilters?.includes("featured") || false,
	});

	const [sort, setSort] = useState<SortOptions>(
		(searchParams.get("sort") as SortOptions) || "newest",
	);

	const [filterOpen, setFilterOpen] = useState(false);

	// Fetch categories
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

	// Fetch products with filters
	const {
		data: products,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["products", filters, sort],
		queryFn: async () => {
			let query = supabase.from("products").select("*");
			console.log(query, "query");
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
			console.log(data, "data");
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
		refetchInterval: 60000,
		refetchOnWindowFocus: true,
		staleTime: 30000,
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
					<ToastAction
						altText={t("product.viewWishlist")}
						onClick={() => {
							navigate(
								`/favorites?highlight=${result.productId}`,
							);
						}}>
						{t("product.viewWishlist")}
					</ToastAction>
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
		try {
			const params = new URLSearchParams();

			if (filters.search)
				params.set("search", filters.search);
			if (filters.category)
				params.set("category", filters.category);

			// Only add price parameters if they're not at default values
			if (filters.minPrice > 0)
				params.set(
					"min_price",
					filters.minPrice.toString(),
				);
			if (filters.maxPrice < 10000)
				params.set(
					"max_price",
					filters.maxPrice.toString(),
				);

			const activeFilters: string[] = [];
			if (filters.isNew) activeFilters.push("new");
			if (filters.isOnSale) activeFilters.push("sale");
			if (filters.isFeatured)
				activeFilters.push("featured");

			if (activeFilters.length > 0) {
				params.set("filter", activeFilters.join(","));
			}

			if (sort !== "newest") {
				params.set("sort", sort);
			}

			setSearchParams(params);
		} catch (error) {
			// Ignore errors that occur when not in a Router context
			console.debug("URL params update skipped:", error);
		}
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
			maxPrice: 10000,
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
		if (filters.maxPrice < 10000) count++;
		if (filters.isNew) count++;
		if (filters.isOnSale) count++;
		if (filters.isFeatured) count++;
		return count;
	};

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

	return {
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
	};
};

export default useProducts;
