import React, {
	createContext,
	useContext,
	useState,
	useEffect,
} from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import {
	type CartItemDetail,
	type CartContextType,
} from "@/features/cart/types";

const CartContext = createContext<
	CartContextType | undefined
>(undefined);

export const CartProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [cartItems, setCartItems] = useState<
		CartItemDetail[]
	>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { user } = useAuth();

	// Fetch cart items when user changes
	useEffect(() => {
		if (user) {
			fetchCartItems();
		} else {
			setCartItems([]);
		}
	}, [user]);

	const fetchCartItems = async () => {
		if (!user) return;

		setIsLoading(true);
		try {
			const { data, error } = await supabase
				.from("cart")
				.select(
					`
          id,
          product_id,
          quantity,
          products (
            name,
            name_ar,
            price,
            image
          )
        `,
				)
				.eq("user_id", user.id);

			if (error) {
				throw error;
			}

			if (data) {
				const formattedCartItems = data.map((item) => ({
					id: item.id,
					product_id: item.product_id,
					quantity: item.quantity,
					name: item.products.name,
					name_ar: item.products.name_ar,
					price: item.products.price,
					image: item.products.image,
				}));

				setCartItems(formattedCartItems);
			}
		} catch (error) {
			console.error("Error fetching cart items:", error);
			toast({
				title: "Error",
				description: "Failed to load your cart items",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

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

		setIsLoading(true);
		try {
			// Check if product already exists in cart
			const existingItem = cartItems.find(
				(item) => item.product_id === product.product_id,
			);

			if (existingItem) {
				// Update quantity
				await updateCartItemQuantity(
					product.product_id,
					existingItem.quantity + product.quantity,
				);
			} else {
				// Add new item
				const { error, data } = await supabase
					.from("cart")
					.insert({
						user_id: user.id,
						product_id: product.product_id,
						quantity: product.quantity,
					})
					.select();

				if (error) throw error;

				// Refresh cart items
				await fetchCartItems();

				toast({
					title: "Added to cart",
					description: "Item has been added to your cart",
				});
			}
		} catch (error) {
			console.error("Error adding to cart:", error);
			toast({
				title: "Error",
				description: "Failed to add item to cart",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const removeFromCart = async (productId: string) => {
		if (!user) return;

		setIsLoading(true);
		try {
			const { error } = await supabase
				.from("cart")
				.delete()
				.eq("user_id", user.id)
				.eq("product_id", productId);

			if (error) throw error;

			// Update local state
			setCartItems(
				cartItems.filter(
					(item) => item.product_id !== productId,
				),
			);

			toast({
				title: "Removed from cart",
				description: "Item has been removed from your cart",
			});
		} catch (error) {
			console.error("Error removing from cart:", error);
			toast({
				title: "Error",
				description: "Failed to remove item from cart",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const updateCartItemQuantity = async (
		productId: string,
		quantity: number,
	) => {
		if (!user) return;

		if (quantity <= 0) {
			return removeFromCart(productId);
		}

		setIsLoading(true);
		try {
			const { error } = await supabase
				.from("cart")
				.update({ quantity })
				.eq("user_id", user.id)
				.eq("product_id", productId);

			if (error) throw error;

			// Update local state
			setCartItems(
				cartItems.map((item) =>
					item.product_id === productId
						? { ...item, quantity }
						: item,
				),
			);

			toast({
				title: "Cart updated",
				description: "Item quantity has been updated",
			});
		} catch (error) {
			console.error("Error updating cart:", error);
			toast({
				title: "Error",
				description: "Failed to update cart",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const clearCart = async () => {
		if (!user) return;

		setIsLoading(true);
		try {
			const { error } = await supabase
				.from("cart")
				.delete()
				.eq("user_id", user.id);

			if (error) throw error;

			setCartItems([]);

			toast({
				title: "Cart cleared",
				description:
					"All items have been removed from your cart",
			});
		} catch (error) {
			console.error("Error clearing cart:", error);
			toast({
				title: "Error",
				description: "Failed to clear cart",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
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
