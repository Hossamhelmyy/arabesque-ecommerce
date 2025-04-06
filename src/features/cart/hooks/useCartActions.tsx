import React from "react";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "react-i18next";
import { toast } from "@/components/ui/use-toast";
import type {
	CartItemDetail,
	CartUpdateAction,
} from "../types";

export const useCartActions = () => {
	const { t } = useTranslation();
	const {
		cartItems: items,
		addToCart,
		updateCartItemQuantity,
		removeFromCart,
		clearCart,
	} = useCart();

	const handleAddToCart = (
		item: Omit<CartItemDetail, "id">,
	) => {
		addToCart(item);

		toast({
			title: t("cart.addedToCart"),
			description: t("cart.addedToCartDescription"),
		});
	};

	const handleUpdateQuantity = ({
		product_id,
		quantity,
	}: CartUpdateAction) => {
		updateCartItemQuantity(product_id, quantity);

		if (quantity === 0) {
			toast({
				title: t("cart.itemRemoved"),
				description: t("cart.itemRemovedDescription"),
			});
		} else {
			toast({
				title: t("cart.quantityUpdated"),
				description: t("cart.quantityUpdatedDescription"),
			});
		}
	};

	const handleRemoveItem = (product_id: string) => {
		removeFromCart(product_id);

		toast({
			title: t("cart.itemRemoved"),
			description: t("cart.itemRemovedDescription"),
		});
	};

	const handleClearCart = () => {
		clearCart();

		toast({
			title: t("cart.cartCleared"),
			description: t("cart.cartClearedDescription"),
		});
	};

	return {
		items,
		addToCart: handleAddToCart,
		updateQuantity: handleUpdateQuantity,
		removeItem: handleRemoveItem,
		clearCart: handleClearCart,
	};
};
