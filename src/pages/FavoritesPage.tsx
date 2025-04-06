import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
	Link,
	useLocation,
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
import { useCart } from "@/context/CartContext";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
	Heart,
	Loader2,
	ShoppingBag,
	Trash2,
	Share2,
	ShoppingCart,
	ArrowLeft,
} from "lucide-react";
import {
	ProductCard,
	ProductCardSkeleton,
} from "@/components/product";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

type FavoriteProduct = {
	id: string;
	user_id: string;
	product_id: string;
	created_at: string;
	products: {
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
	};
};

const FavoritesPage = () => {
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const { isRTL } = useLanguage();
	const { user } = useAuth();
	const { addToCart } = useCart();
	const queryClient = useQueryClient();
	const location = useLocation();
	const navigate = useNavigate();
	const [highlightedProductId, setHighlightedProductId] =
		useState<string | null>(null);
	const [showClearConfirm, setShowClearConfirm] =
		useState(false);
	const [selectedItems, setSelectedItems] = useState<
		string[]
	>([]);
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
          products (
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

			return data as FavoriteProduct[];
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
				<Button
					size="sm"
					variant="outline"
					onClick={() => navigate("/cart")}>
					{t("cart.title")}
				</Button>
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
				addToCart({
					product_id: product.id,
					quantity: 1,
					name: product.name,
					name_ar: product.name_ar,
					price: product.price,
					image: product.image,
				});
			});

			toast({
				title: t("product.addedToCart"),
				description: `${favorites.length} ${t(
					"product.moveAllToCart",
				)}`,
				action: (
					<Button
						size="sm"
						variant="outline"
						onClick={() => navigate("/cart")}>
						{t("cart.title")}
					</Button>
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
							i18n.language === "ar"
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
	const groupFavoritesByDate = () => {
		if (!favorites) return {};

		const grouped: Record<string, FavoriteProduct[]> = {};

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

	if (!user) {
		return (
			<div className="container py-12">
				<div className="text-center py-16">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
						<Heart className="h-8 w-8 text-muted-foreground" />
					</div>
					<h2 className="text-xl font-medium mb-2">
						{t("profile.notLoggedIn")}
					</h2>
					<p className="text-muted-foreground max-w-md mx-auto mb-6">
						{t("profile.notLoggedInMessage")}
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button asChild>
							<Link to="/auth">
								{t("profile.signInButton")}
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link to="/auth?signup=true">
								{t("profile.createAccountButton")}
							</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="container py-8 md:py-12">
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
					<div>
						<h1 className="text-3xl font-bold mb-2">
							{t("favorites.title")}
						</h1>
						<p className="text-muted-foreground">
							{t("common.loading")}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{[...Array(8)].map((_, index) => (
						<ProductCardSkeleton key={index} />
					))}
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
				<Button
					variant="outline"
					className="mt-4"
					onClick={() => window.location.reload()}>
					{t("common.retry")}
				</Button>
			</div>
		);
	}

	if (!favorites || favorites.length === 0) {
		return (
			<div className="container py-12">
				<div className="flex items-center mb-6">
					<Button
						variant="ghost"
						size="sm"
						className="mr-2"
						asChild>
						<Link to="/products">
							<ArrowLeft className="h-4 w-4 mr-2" />
							{t("products.title")}
						</Link>
					</Button>
				</div>
				<div className="text-center py-16">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
						<Heart className="h-8 w-8 text-muted-foreground" />
					</div>
					<h2 className="text-xl font-medium mb-2">
						{t("favorites.empty")}
					</h2>
					<p className="text-muted-foreground max-w-md mx-auto mb-6">
						{t("favorites.emptyMessage")}
					</p>
					<Button asChild>
						<Link to="/products">
							{t("favorites.startBrowsing")}
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container py-8 md:py-12">
			<div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
				<div>
					<div className="flex items-center">
						<Button
							variant="ghost"
							size="sm"
							className="mr-2 -ml-2 mb-2"
							asChild>
							<Link to="/products">
								<ArrowLeft className="h-4 w-4 mr-2" />
								{t("products.title")}
							</Link>
						</Button>
					</div>
					<h1 className="text-3xl font-bold mb-2">
						{t("favorites.title")}
					</h1>
					<p className="text-muted-foreground">
						{favorites.length}{" "}
						{favorites.length === 1
							? t("cart.item")
							: t("cart.items")}
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={handleShareWishlist}
						className="flex items-center">
						<Share2 className="mr-2 h-4 w-4" />
						{t("product.shareWishlist")}
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={handleMoveAllToCart}
						disabled={
							isBulkMovingToCart || favorites.length === 0
						}
						className="flex items-center">
						{isBulkMovingToCart ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<ShoppingCart className="mr-2 h-4 w-4" />
						)}
						{t("product.moveAllToCart")}
					</Button>

					<AlertDialog
						open={showClearConfirm}
						onOpenChange={setShowClearConfirm}>
						<AlertDialogTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="flex items-center">
								<Trash2 className="mr-2 h-4 w-4" />
								{t("favorites.removeAll")}
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									{t("favorites.removeAll")}
								</AlertDialogTitle>
								<AlertDialogDescription>
									{t("favorites.confirmRemoveAll")}
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>
									{t("common.cancel")}
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={clearAllFavorites}
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
									{t("favorites.removeAll")}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>

			{/* Display favorites grouped by date */}
			{Object.entries(groupedFavorites).map(
				([dateKey, items]) => (
					<div key={dateKey} className="mb-10">
						<h3 className="text-sm font-medium text-muted-foreground mb-4">
							{formatDate(dateKey)}
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{items.map((favorite) => {
								const product = favorite.products;
								const isHighlighted =
									highlightedProductId === product.id;

								return (
									<ProductCard
										key={favorite.id}
										product={product}
										onAddToCart={() =>
											handleAddToCart(product)
										}
										onAddToWishlist={() =>
											handleRemoveFromFavorites(favorite.id)
										}
										isInWishlist={true}
										className={`relative transition-all duration-500 ${
											isHighlighted
												? "ring-4 ring-primary ring-opacity-70 scale-105 animate-heartbeat"
												: ""
										}`}
									/>
								);
							})}
						</div>
					</div>
				),
			)}
		</div>
	);
};

export default FavoritesPage;
