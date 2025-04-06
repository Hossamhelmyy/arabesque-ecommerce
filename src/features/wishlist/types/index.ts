import type { Product } from "@/features/products/types";

export type WishlistItem = {
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

export type WishlistGroupedByDate = {
	date: string;
	items: WishlistItem[];
};

export type WishlistContextType = {
	wishlistItems: WishlistItem[] | null;
	isLoading: boolean;
	addToWishlist: (productId: string) => Promise<void>;
	removeFromWishlist: (productId: string) => Promise<void>;
	isInWishlist: (productId: string) => boolean;
};
