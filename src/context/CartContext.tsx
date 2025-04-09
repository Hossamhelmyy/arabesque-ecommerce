import React, { createContext, useContext } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type {
	CartItemDetail,
	CartContextType,
} from "@/features/cart/types/index";
import {
	useQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";

const CART_QUERY_KEY = ["cart"] as const;

const CartContext = createContext<
	CartContextType | undefined
>(undefined);

interface CartProduct {
	name: string;
	name_ar: string;
	price: number;
	image: string;
}

interface CartItem {
	id: string;
	product_id: string;
	quantity: number;
	products: CartProduct;
}

type SupabaseCartResponse = {
	id: string;
	product_id: string;
	quantity: number;
	created_at: string;
	products: {
		name: string;
		name_ar: string;
		price: number;
		image: string;
	};
}[];

// API functions
const fetchCartItemsFromAPI = async (userId: string) => {
	const { data, error } = await supabase
		.from("cart")
		.select(
			`
			id,
			product_id,
			quantity,
			created_at,
			products (
				name,
				name_ar,
				price,
				image
			)
		`,
		)
		.eq("user_id", userId)
		.order("created_at", { ascending: true });

	if (error) throw error;

	// Safe type assertion for Supabase response
	const cartData =
		data as unknown as (SupabaseCartResponse[0] & {
			created_at: string;
		})[];
	return (
		cartData?.map((item) => ({
			id: item.id,
			product_id: item.product_id,
			quantity: item.quantity,
			name: item.products.name,
			name_ar: item.products.name_ar,
			price: item.products.price,
			image: item.products.image,
			created_at: item.created_at,
		})) ?? []
	);
};

export const CartProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const { user } = useAuth();
	const queryClient = useQueryClient();

	// Query for cart items
	const { data: cartItems = [], isLoading } = useQuery({
		queryKey: CART_QUERY_KEY,
		queryFn: () =>
			user ? fetchCartItemsFromAPI(user.id) : [],
		enabled: !!user,
	});

	// Add to cart mutation
	const addToCartMutation = useMutation({
		mutationFn: async (
			product: Omit<CartItemDetail, "id">,
		) => {
			if (!user) throw new Error("User not authenticated");

			const existingItem = cartItems.find(
				(item) => item.product_id === product.product_id,
			);

			if (existingItem) {
				const { error } = await supabase
					.from("cart")
					.update({
						quantity:
							existingItem.quantity + product.quantity,
					})
					.eq("user_id", user.id)
					.eq("product_id", product.product_id);

				if (error) throw error;
			} else {
				const { error } = await supabase
					.from("cart")
					.insert({
						user_id: user.id,
						product_id: product.product_id,
						quantity: product.quantity,
					});

				if (error) throw error;
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: CART_QUERY_KEY,
			});
			toast({
				title: "Added to cart",
				description: "Item has been added to your cart",
			});
		},
		onError: (error) => {
			console.error("Error adding to cart:", error);
			toast({
				title: "Error",
				description: "Failed to add item to cart",
				variant: "destructive",
			});
		},
	});

	// Remove from cart mutation
	const removeFromCartMutation = useMutation({
		mutationFn: async (productId: string) => {
			if (!user) throw new Error("User not authenticated");

			const { error } = await supabase
				.from("cart")
				.delete()
				.eq("user_id", user.id)
				.eq("product_id", productId);

			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: CART_QUERY_KEY,
			});
			toast({
				title: "Removed from cart",
				description: "Item has been removed from your cart",
			});
		},
		onError: (error) => {
			console.error("Error removing from cart:", error);
			toast({
				title: "Error",
				description: "Failed to remove item from cart",
				variant: "destructive",
			});
		},
	});

	// Update quantity mutation
	const updateQuantityMutation = useMutation({
		mutationFn: async ({
			productId,
			quantity,
		}: {
			productId: string;
			quantity: number;
		}) => {
			if (!user) throw new Error("User not authenticated");

			if (quantity <= 0) {
				return removeFromCartMutation.mutateAsync(
					productId,
				);
			}

			const { error } = await supabase
				.from("cart")
				.update({
					quantity,
					updated_at: new Date().toISOString(),
				})
				.eq("user_id", user.id)
				.eq("product_id", productId);

			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: CART_QUERY_KEY,
			});
			toast({
				title: "Cart updated",
				description: "Item quantity has been updated",
			});
		},
		onError: (error) => {
			console.error("Error updating cart:", error);
			toast({
				title: "Error",
				description: "Failed to update cart",
				variant: "destructive",
			});
		},
	});

	// Clear cart mutation
	const clearCartMutation = useMutation({
		mutationFn: async () => {
			if (!user) throw new Error("User not authenticated");

			const { error } = await supabase
				.from("cart")
				.delete()
				.eq("user_id", user.id);

			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: CART_QUERY_KEY,
			});
			toast({
				title: "Cart cleared",
				description:
					"All items have been removed from your cart",
			});
		},
		onError: (error) => {
			console.error("Error clearing cart:", error);
			toast({
				title: "Error",
				description: "Failed to clear cart",
				variant: "destructive",
			});
		},
	});

	const addToCart = async (
		product: Omit<CartItemDetail, "id">,
	) => {
		if (!user) {
			toast({
				title: "Authentication required",
				description:
					"Please sign in to add items to your cart",
				variant: "destructive",
			});
			return;
		}
		await addToCartMutation.mutateAsync(product);
	};

	const removeFromCart = async (productId: string) => {
		if (!user) return;
		await removeFromCartMutation.mutateAsync(productId);
	};

	const updateCartItemQuantity = async (
		productId: string,
		quantity: number,
	) => {
		if (!user) return;
		await updateQuantityMutation.mutateAsync({
			productId,
			quantity,
		});
	};

	const clearCart = async () => {
		if (!user) return;
		await clearCartMutation.mutateAsync();
	};

	return (
		<CartContext.Provider
			value={{
				cartItems,
				addToCart,
				removeFromCart,
				updateCartItemQuantity,
				clearCart,
				isLoading,
			}}>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error(
			"useCart must be used within a CartProvider",
		);
	}
	return context;
};
