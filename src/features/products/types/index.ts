export interface Product {
	id: string;
	name: string;
	name_ar: string;
	description?: string;
	description_ar?: string;
	price: number;
	original_price?: number | null;
	image: string;
	images?: string[];
	slug: string;
	category_id?: string | null;
	is_new?: boolean | null;
	is_on_sale?: boolean | null;
	is_featured?: boolean | null;
	created_at?: string;
	stock_quantity?: number;
}

export interface Category {
	id: string;
	name: string;
	name_ar: string;
	slug: string;
}

export type SortOptions =
	| "newest"
	| "oldest"
	| "price_asc"
	| "price_desc";

export interface FilterState {
	search: string;
	category: string;
	minPrice: number;
	maxPrice: number;
	isNew: boolean;
	isOnSale: boolean;
	isFeatured: boolean;
}

export interface ProductsData {
	filters: FilterState;
	sort: SortOptions;
	setSort: (sort: SortOptions) => void;
	filterOpen: boolean;
	setFilterOpen: (open: boolean) => void;
	products: Product[] | undefined;
	categories: Category[] | undefined;
	isLoading: boolean;
	error: unknown;
	refetch: () => void;
	wishlistItems: { product_id: string }[] | undefined;
	handleAddToWishlist: (product: Product) => void;
	handleFilterChange: (
		key: keyof FilterState,
		value: FilterState[keyof FilterState],
	) => void;
	handleQuickSearch: (
		e: React.FormEvent<HTMLFormElement>,
	) => void;
	clearFilters: () => void;
	handleAddToCart: (product: Product) => void;
	countActiveFilters: () => number;
	handlePriceChange: (values: number[]) => void;
}
