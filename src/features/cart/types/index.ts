import type { Product } from "@/features/products/types";

export type CartItemDetail = {
	id?: string;
	product_id: string;
	quantity: number;
	name: string;
	name_ar: string;
	price: number;
	image: string;
	product?: Product;
};

export type CartSummary = {
	subtotal: number;
	shipping: number;
	tax: number;
	total: number;
};

export type CartState = {
	items: CartItemDetail[];
	summary: CartSummary;
};

export type CartUpdateAction = {
	product_id: string;
	quantity: number;
};

export type CartContextType = {
	cartItems: CartItemDetail[];
	addToCart: (
		item: Omit<CartItemDetail, "id">,
	) => Promise<void>;
	removeFromCart: (productId: string) => Promise<void>;
	updateCartItemQuantity: (
		productId: string,
		quantity: number,
	) => Promise<void>;
	clearCart: () => Promise<void>;
	isLoading: boolean;
};
