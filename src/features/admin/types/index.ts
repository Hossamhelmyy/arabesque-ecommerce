import { User as AuthUser } from "@/features/auth/types";
import { User as SupabaseUser } from "@supabase/supabase-js";

export type Address = {
	street: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
};

export type UserProfile = {
	id: string;
	userId: string;
	firstName: string;
	lastName: string;
	email: string;
	address: Address;
	phoneNumber: string;
	avatar: string;
	createdAt: string;
	updatedAt: string;
};

export type ShippingAddress = {
	name: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	postal_code: string;
	country: string;
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
	product: {
		id: string;
		name: string;
		image: string;
		slug: string;
		price: number;
		stock_quantity?: number;
		description?: string;
	};
	quantity: number;
	unit_price: number;
	total_price: number;
};

export type Order = {
	id: string;
	user_id: string;
	status: string;
	created_at: string;
	updated_at?: string | null;
	total: number;
	subtotal: number;
	shipping_fee: number;
	tax: number;
	shipping_address: ShippingAddress;
	payment_method: string;
	tracking_number?: string;
	items?: OrderItem[];
	user?: OrderUser;
};

export type Category = {
	id: string;
	name: string;
	name_ar: string;
	slug: string;
	description: string | null;
	description_ar: string | null;
	image: string | null;
	created_at: string;
	updated_at: string | null;
};

export interface Product {
	id: string;
	name: string;
	name_ar?: string;
	description?: string;
	description_ar?: string;
	price: number;
	original_price?: number | null;
	stock_quantity: number;
	image: string;
	images?: string[] | Record<string, string>;
	category_id: string | null;
	is_featured?: boolean;
	is_new?: boolean;
	is_on_sale?: boolean;
	created_at: string;
	updated_at?: string;
}

export type Profile = {
	id: string;
	user_id: string;
	first_name?: string;
	first_name_ar?: string;
	last_name?: string;
	last_name_ar?: string;
	avatar_url?: string;
	phone?: string;
	address?: {
		address?: string;
		city?: string;
		postal_code?: string;
		country?: string;
	};
	created_at: string;
	updated_at: string;
	role: string;
	email: string;
};

export type AdminUser = SupabaseUser & {
	profile?: Profile;
	orders?: Order[];
	orders_count?: number;
	total_spent?: number;
	role?: string;
};

export type BannerItem = {
	id: string;
	title: string;
	subtitle: string;
	image: string;
	link: string;
	active: boolean;
	position: number;
	created_at: string;
	updated_at: string;
};

export type Promotion = {
	id: string;
	title: string;
	description: string;
	code: string;
	image?: string;
	discount?: string;
	startDate: string;
	endDate: string;
	active: boolean;
	created_at: string;
	updated_at: string;
};

export type DashboardStats = {
	totalUsers: number;
	totalProducts: number;
	totalOrders: number;
	totalRevenue: number;
	totalSales: number;
	revenue: number;
	revenueTrend: { value: number; isPositive: boolean };
	ordersTrend: { value: number; isPositive: boolean };
	customersTrend: { value: number; isPositive: boolean };
	pendingOrders?: number;
	processingOrders?: number;
	shippedOrders?: number;
	deliveredOrders?: number;
	cancelledOrders?: number;
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
	id: string;
	name: string;
	sales: number;
	revenue: number;
	price: number;
	image: string;
	category: string;
};

export type ProductFormData = {
	name: string;
	price: number;
	description: string;
	category_id: string;
	image?: File;
	stock: number;
};

export type CategoryFormData = {
	name: string;
	description: string;
	image?: File;
};

export type UseProductsOptions = {
	initialProducts?: Product[];
	initialCategories?: Category[];
};

export type UseProductTableOptions = {
	products: Product[];
	isLoading: boolean;
	formatDate: (date: string) => string;
};

export interface OrderStatus {
	value: string;
	label: string;
	icon?: React.ReactNode;
}

export type TopProduct = {
	id: string;
	name: string;
	category: string;
	price: number;
	quantity: number;
	total: number;
	image: string;
};

export type RecentOrder = {
	id: string;
	orderNumber: string;
	customerName: string;
	date: string;
	total: number;
	status: string;
};

// Dashboard Types
export interface ChartData {
	name: string;
	total: number;
}

// User Types
export interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	avatar?: string;
	lastLogin?: string;
	createdAt: string;
	profiles?: {
		first_name?: string;
		last_name?: string;
		avatar_url?: string;
		email: string;
	};
}

export interface UsersData {
	users: User[];
	selectedUser: User | null;
	isLoading: boolean;
	isSubmitting: boolean;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	fetchUsers: () => Promise<void>;
	viewUserDetails: (user: User) => void;
	updateUserRole: (
		userId: string,
		role: string,
	) => Promise<boolean>;
	formatDate: (dateString: string) => string;
	formatCurrency: (amount: number) => string;
	getInitials: (user: User) => string;
	getFullName: (user: User) => string;
}

export type StoreSettings = {
	store_name: string;
	store_description?: string;
	contact_email: string;
	contact_phone?: string;
	address?: string;
	logo_url?: string;
	favicon_url?: string;
	currency: string;
};

export type EmailSettings = {
	smtp_host: string;
	smtp_port: string;
	smtp_user: string;
	smtp_password: string;
	sender_name: string;
	sender_email: string;
	email_template?: string;
};

export type ShippingSettings = {
	enable_shipping: boolean;
	free_shipping_threshold?: string;
	default_shipping_rate: string;
	allow_international_shipping: boolean;
	shipping_countries?: string[];
	shipping_zones?: ShippingZone[];
};

export type ShippingZone = {
	name: string;
	countries: string[];
	rate: string;
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
	setSearchQuery: (query: string) => void;
	setStatusFilter: (status: string) => void;
	setSelectedOrder: (order: Order | null) => void;
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
	getStatusBadge: (status: string) => React.ReactElement;
	formatCurrency: (value: number) => string;
	handleSearch: (query: string) => void;
	handleStatusFilter: (status: string) => void;
}
