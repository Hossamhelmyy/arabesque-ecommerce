export interface FavoriteProduct {
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
}

export interface GroupedFavorites {
	[dateKey: string]: FavoriteProduct[];
}

export interface UseFavoritesReturn {
	favorites: FavoriteProduct[] | undefined;
	isLoading: boolean;
	error: unknown;
	groupedFavorites: GroupedFavorites;
	highlightedProductId: string | null;
	showClearConfirm: boolean;
	setShowClearConfirm: (show: boolean) => void;
	isBulkMovingToCart: boolean;
	handleAddToCart: (
		product: FavoriteProduct["products"],
	) => void;
	handleRemoveFromFavorites: (favoriteId: string) => void;
	handleMoveAllToCart: () => void;
	handleShareWishlist: () => Promise<void>;
	clearAllFavorites: () => Promise<void>;
	formatDate: (dateString: string) => string;
}
