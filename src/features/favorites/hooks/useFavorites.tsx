import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
	useQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import type {
	FavoriteProduct,
	GroupedFavorites,
	UseFavoritesReturn,
} from "../types";

// Define the product shape as expected from Supabase
interface ProductData {
	id: string;
	name: string;
	name_ar: string;
	price: number;
	original_price: number | null;
	image: string;
	slug: string;
	is_new: boolean | null;
	is_on_sale: boolean | null;
	category_id?: string | null;
}

// Define the shape of raw data from Supabase
interface SupabaseFavoriteProduct {
	id: string;
	user_id: string;
	product_id: string;
	created_at: string;
	products: ProductData[] | ProductData;
}

export const useFavorites = (): UseFavoritesReturn => {
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const { user } = useAuth();
	const { addToCart } = useCart();
	const queryClient = useQueryClient();
	const location = useLocation();
	const navigate = useNavigate();
	const [highlightedProductId, setHighlightedProductId] =
		useState<string | null>(null);
	const [showClearConfirm, setShowClearConfirm] =
		useState(false);
	const [isBulkMovingToCart, setIsBulkMovingToCart] =
		useState(false);

	// Check for the product_id in the URL query parameter
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const productId = params.get("highlight");
		if (productId) {
			setHighlightedProductId(productId);
			// Clear the highlight after 3 seconds
			setTimeout(() => {
				setHighlightedProductId(null);
			}, 3000);
		}
	}, [location]);

	// Fetch favorites
	const {
		data: favorites,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["favorites", user?.id],
		queryFn: async () => {
			if (!user) return [];

			const { data, error } = await supabase
				.from("wish_list")
				.select(
					`
          id,
          user_id,
          product_id,
          created_at,
          products:products (
            id,
            name,
            name_ar,
            price,
            original_price,
            image,
            slug,
            is_new,
            is_on_sale,
            category_id
          )
        `,
				)
				.eq("user_id", user.id)
				.order("created_at", { ascending: false });

			if (error) {
				throw error;
			}

			// Transform the data to handle Supabase's response format
			// where products could be an array but our type expects a single object
			return (data as SupabaseFavoriteProduct[]).map(
				(item) => ({
					...item,
					products:
						Array.isArray(item.products) &&
						item.products.length > 0
							? item.products[0] // Take the first product if it's an array
							: (item.products as ProductData),
				}),
			) as FavoriteProduct[];
		},
		enabled: !!user,
	});

	// Remove from favorites mutation
	const removeMutation = useMutation({
		mutationFn: async (favoriteId: string) => {
			const { error } = await supabase
				.from("wish_list")
				.delete()
				.eq("id", favoriteId);

			if (error) {
				throw error;
			}

			return favoriteId;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["favorites", user?.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["wishlist"],
			});
			toast({
				title: t("product.removedFromFavorites"),
				description: t(
					"product.removedFromFavoritesDescription",
				),
			});
		},
		onError: (error) => {
			console.error(
				"Error removing from favorites:",
				error,
			);
			toast({
				title: t("common.error"),
				description: "Failed to remove from favorites",
				variant: "destructive",
			});
		},
	});

	const clearAllFavorites = async () => {
		if (!user) return;

		try {
			const { error } = await supabase
				.from("wish_list")
				.delete()
				.eq("user_id", user.id);

			if (error) throw error;

			queryClient.invalidateQueries({
				queryKey: ["favorites", user?.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["wishlist"],
			});

			toast({
				title: t("favorites.removeAll"),
				description: "All favorites have been removed",
			});

			setShowClearConfirm(false);
		} catch (error) {
			console.error("Error clearing favorites:", error);
			toast({
				title: t("common.error"),
				description: "Failed to clear favorites",
				variant: "destructive",
			});
		}
	};

	const handleAddToCart = (
		product: FavoriteProduct["products"],
	) => {
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
			action: (
				<button
					className="rounded bg-primary px-3 py-1 text-primary-foreground"
					onClick={() => navigate("/cart")}>
					{t("cart.title")}
				</button>
			),
		});
	};

	const handleRemoveFromFavorites = (
		favoriteId: string,
	) => {
		removeMutation.mutate(favoriteId);
	};

	const handleMoveAllToCart = () => {
		if (!favorites || favorites.length === 0) return;

		setIsBulkMovingToCart(true);

		try {
			favorites.forEach((favorite) => {
				const product = favorite.products;
				if (product) {
					addToCart({
						product_id: product.id,
						quantity: 1,
						name: product.name,
						name_ar: product.name_ar,
						price: product.price,
						image: product.image,
					});
				}
			});

			toast({
				title: t("product.addedToCart"),
				description: `${favorites.length} ${t(
					"product.moveAllToCart",
				)}`,
				action: (
					<button
						className="rounded bg-primary px-3 py-1 text-primary-foreground"
						onClick={() => navigate("/cart")}>
						{t("cart.title")}
					</button>
				),
			});
		} catch (error) {
			console.error("Error moving all to cart:", error);
			toast({
				title: t("common.error"),
				description: "Failed to move items to cart",
				variant: "destructive",
			});
		} finally {
			setIsBulkMovingToCart(false);
		}
	};

	// Share wishlist functionality
	const handleShareWishlist = async () => {
		if (!favorites || favorites.length === 0) return;

		try {
			// Generate share text with list of products
			const shareText = `${t("product.shareWishlist")} ${
				window.location.origin
			}/favorites\n\n${t(
				"product.wishlistSummary",
			)}:\n${favorites
				.map(
					(fav, index) =>
						`${index + 1}. ${
							i18n.language === "ar" && fav.products.name_ar
								? fav.products.name_ar
								: fav.products.name
						}`,
				)
				.join("\n")}`;

			if (navigator.share) {
				await navigator.share({
					title: t("favorites.title"),
					text: shareText,
					url: window.location.href,
				});
			} else {
				// Fallback for browsers that don't support the Web Share API
				await navigator.clipboard.writeText(shareText);
				toast({
					title: t("common.success"),
					description: "Wishlist copied to clipboard",
				});
			}
		} catch (error) {
			console.error("Error sharing wishlist:", error);
			// User probably canceled share dialogue, no need for error toast
		}
	};

	// Format date with appropriate locale
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return format(date, "PPP", {
			locale: i18n.language === "ar" ? ar : enUS,
		});
	};

	// Group favorites by date added
	const groupFavoritesByDate = (): GroupedFavorites => {
		if (!favorites) return {};

		const grouped: GroupedFavorites = {};

		favorites.forEach((favorite) => {
			const dateKey = favorite.created_at.split("T")[0]; // YYYY-MM-DD
			if (!grouped[dateKey]) {
				grouped[dateKey] = [];
			}
			grouped[dateKey].push(favorite);
		});

		return grouped;
	};

	const groupedFavorites = groupFavoritesByDate();

	return {
		favorites,
		isLoading,
		error,
		groupedFavorites,
		highlightedProductId,
		showClearConfirm,
		setShowClearConfirm,
		isBulkMovingToCart,
		handleAddToCart,
		handleRemoveFromFavorites,
		handleMoveAllToCart,
		handleShareWishlist,
		clearAllFavorites,
		formatDate,
	};
};
