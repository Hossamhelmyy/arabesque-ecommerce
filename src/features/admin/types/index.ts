import { User } from "@/features/auth/types";

export type Address = {
	address: string;
	city: string;
	postal_code: string;
	country: string;
} | null;

export type UserProfile = {
	id: string;
	first_name: string | null;
	last_name: string | null;
	phone: string | null;
	avatar_url: string | null;
	address: Address;
};

export type AdminUser = User & {
	orders_count?: number;
	total_spent?: number;
};

export type ShippingAddress = {
	address: string;
	city: string;
	postal_code: string;
	country: string;
	name: string;
	phone: string;
	email: string;
};

export type OrderUser = {
	email?: string;
	profile?: {
		first_name?: string | null;
		last_name?: string | null;
	};
};

export type OrderItem = {
	id: string;
	order_id: string;
	product_id: string;
	price: number;
	quantity: number;
	product: {
		name: string;
		image: string;
		slug: string;
	};
};

export type Order = {
	id: string;
	created_at: string;
	updated_at: string | null;
	user_id: string;
	status: string;
	total: number;
	payment_method: string;
	shipping_address:
		| ShippingAddress
		| Record<string, unknown>;
	user?: OrderUser | null;
	items?: OrderItem[];
};

export type BannerItem = {
	id: string;
	title: string;
	subtitle: string;
	image: string;
	link: string;
	active: boolean;
	position: number;
};

export type Promotion = {
	id: string;
	title: string;
	description: string;
	code: string;
	startDate: string;
	endDate: string;
	active: boolean;
};

export type DashboardStats = {
	totalUsers: number;
	totalProducts: number;
	totalOrders: number;
	totalRevenue: number;
};

export type OrderStatusOption = {
	value: string;
	label: string;
	color: string;
};

export type SalesDataPoint = {
	month: string;
	sales: number;
};

export type ProductPerformancePoint = {
	name: string;
	sales: number;
	revenue: number;
};

export interface OrdersData {
	orders: Order[];
	filteredOrders: Order[];
	selectedOrder: Order | null;
	orderItems: OrderItem[];
	isLoading: boolean;
	isSubmitting: boolean;
	isItemsLoading: boolean;
	statusFilter: string;
	searchQuery: string;
	setSelectedOrder: (order: Order | null) => void;
	setSearchQuery: (query: string) => void;
	setStatusFilter: (status: string) => void;
	fetchOrderItems: (
		orderId: string,
	) => Promise<OrderItem[]>;
	viewOrderDetails: (order: Order) => Promise<void>;
	updateOrderStatus: (
		orderId: string,
		status: string,
	) => Promise<void>;
	getShippingAddressProperty: (
		order: Order,
		property: keyof ShippingAddress,
		fallback?: string,
	) => string;
	formatDate: (dateString: string) => string;
	formatTime: (dateString: string) => string;
	formatCurrency: (value: number) => string;
	getStatusBadge: (status: string) => JSX.Element;
	handleSearch: (query: string) => void;
	handleStatusFilter: (status: string) => void;
}

export interface UsersData {
	users: AdminUser[];
	selectedUser: AdminUser | null;
	isLoading: boolean;
	isSubmitting: boolean;
	searchQuery: string;
	setSelectedUser: (user: AdminUser | null) => void;
	setSearchQuery: (query: string) => void;
	viewUserDetails: (user: AdminUser) => Promise<void>;
	updateUserRole: (
		userId: string,
		role: string,
	) => Promise<void>;
	userOrders: Order[];
	isOrdersLoading: boolean;
	formatDate: (dateString: string) => string;
	formatCurrency: (value: number) => string;
	getInitials: (user: AdminUser) => string;
	getFullName: (user: AdminUser) => string;
	filteredUsers?: AdminUser[];
	getUserInitials?: (user: AdminUser) => string;
	getUserFullName?: (user: AdminUser) => string;
	isLoadingOrders?: boolean;
}

export interface DashboardData {
	stats: DashboardStats;
	isLoading: boolean;
	salesData: SalesDataPoint[];
	productPerformance: ProductPerformancePoint[];
	formatCurrency: (value: number) => string;
}

export interface ProductsData {
	products: Product[];
	categories: Category[];
	filteredProducts: Product[];
	isLoading: boolean;
	isSubmitting: boolean;
	selectedProduct: Product | null;
	searchQuery: string;
	categoryFilter: string;
	handleSearch: (query: string) => void;
	handleCategoryFilter: (categoryId: string) => void;
	setSelectedProduct: (product: Product | null) => void;
	setSearchQuery: (query: string) => void;
	createProduct: (
		productData: Omit<
			Product,
			"id" | "created_at" | "updated_at" | "slug"
		>,
	) => Promise<void>;
	updateProduct: (
		id: string,
		productData: Partial<Product>,
	) => Promise<void>;
	deleteProduct: (id: string) => Promise<void>;
	formatDate: (date: string) => string;
	formatPrice: (price: number) => string;
}

export interface Category {
	id: string;
	name: string;
	slug: string;
	description?: string;
	image_url?: string;
	created_at: string;
	updated_at: string;
	parent_id?: string;
	products_count?: number;
	name_ar?: string;
	description_ar?: string;
}

export interface Product {
	id: string;
	name: string;
	name_ar?: string;
	slug: string;
	description: string;
	description_ar?: string;
	price: number;
	original_price?: number | null;
	stock_quantity?: number;
	category_id: string;
	image: string;
	images?: string[] | Record<string, string>;
	in_stock?: boolean;
	is_featured?: boolean;
	is_new?: boolean;
	is_on_sale?: boolean;
	created_at: string;
	updated_at: string | null;
	category?: Category;
}

export interface CategoriesData {
	categories: Category[];
	filteredCategories: Category[];
	isLoading: boolean;
	selectedCategory: Category | null;
	setSelectedCategory: (category: Category | null) => void;
	createCategory: (
		category: Omit<
			Category,
			"id" | "created_at" | "updated_at" | "products_count"
		>,
	) => Promise<void>;
	updateCategory: (
		id: string,
		category: Partial<
			Omit<Category, "id" | "created_at" | "updated_at">
		>,
	) => Promise<void>;
	deleteCategory: (id: string) => Promise<void>;
	isSubmitting: boolean;
	error: string | null;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	formatDate: (date: string) => string;
}
