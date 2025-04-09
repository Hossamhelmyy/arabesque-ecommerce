import type { Product } from "@/features/products/types";

export interface CartItemDetail {
	id?: string;
	product_id: string;
	quantity: number;
	name: string;
	name_ar: string;
	price: number;
	image: string;
	product?: Product;
}

export interface CartSummary {
	subtotal: number;
	shipping: number;
	tax: number;
	total: number;
}

export interface CartState {
	items: CartItemDetail[];
	summary: CartSummary;
}

export interface CartUpdateAction {
	product_id: string;
	quantity: number;
}

export interface CartContextType {
	cartItems: CartItemDetail[];
	addToCart: (
		product: Omit<CartItemDetail, "id">,
	) => Promise<void>;
	removeFromCart: (productId: string) => Promise<void>;
	updateCartItemQuantity: (
		productId: string,
		quantity: number,
	) => Promise<void>;
	clearCart: () => Promise<void>;
	isLoading: boolean;
}

// Re-export all types
export type { CartItemDetail as CartItem } from "./cart-item";
