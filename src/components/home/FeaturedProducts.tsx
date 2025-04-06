import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
	Card,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	useQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import {
	ProductCard,
	ProductCardSkeleton,
} from "@/components/product";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

type Product = {
	id: string;
	name: string;
	name_ar: string;
	price: number;
	original_price: number | null;
	image: string;
	slug: string;
	is_featured: boolean;
	is_new: boolean;
	is_on_sale: boolean;
};

const FeaturedProducts = () => {
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const { addToCart } = useCart();
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const {
		data: products,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["featuredProducts"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("products")
				.select("*")
				.eq("is_featured", true)
				.limit(8);

			if (error) {
				toast({
					title: "Error loading products",
					description: error.message,
					variant: "destructive",
				});
				throw error;
			}

			return data as Product[];
		},
	});

	// Query to fetch wishlist items
	const { data: wishlistItems } = useQuery({
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

	if (error) {
		console.error("Error fetching products:", error);
	}

	return (
		<section className="py-16">
			<div className="container">
				<h2 className="font-heading text-3xl md:text-4xl font-bold mb-8 text-center">
					{t("home.featured")}
				</h2>

				{isLoading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{[...Array(8)].map((_, index) => (
							<ProductCardSkeleton key={index} />
						))}
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{products?.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								onAddToCart={() => {
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
										description: t(
											"product.addedToCartDescription",
										),
									});
								}}
								onAddToWishlist={() =>
									handleAddToWishlist(product)
								}
								isInWishlist={wishlistProductIds.has(
									product.id,
								)}
							/>
						))}
					</div>
				)}

				<div className="mt-12 text-center">
					<Link
						to="/products"
						className="inline-flex items-center justify-center h-10 px-6 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
						{t("common.viewAll")}
					</Link>
				</div>
			</div>
		</section>
	);
};

export default FeaturedProducts;
