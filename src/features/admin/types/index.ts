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
	product: Product;
	quantity: number;
	unit_price: number;
	total_price: number;
};

export type Order = {
	id: string;
	user_id: string;
	status: string;
	total: number;
	items: OrderItem[];
	shipping_address: ShippingAddress;
	created_at: string;
	updated_at: string;
};

export type Category = {
	id: string;
	name: string;
	slug: string;
	description: string;
	image: string;
	created_at: string;
	updated_at: string;
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
	last_name?: string;
	address?: {
		address?: string;
		city?: string;
		postal_code?: string;
		country?: string;
	};
	phone?: string;
	avatar_url?: string;
	created_at: string;
	updated_at: string;
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
};

export type DashboardStats = {
	totalUsers: number;
	totalProducts: number;
	totalOrders: number;
	totalRevenue: number;
	totalSales?: number;
	revenue?: number;
	revenueTrend?: { value: number; isPositive: boolean };
	ordersTrend?: { value: number; isPositive: boolean };
	customersTrend?: { value: number; isPositive: boolean };
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

export interface RecentOrder {
	id: string;
	orderNumber: string;
	customerName: string;
	date: string;
	total: number;
	status: string;
}

// Dashboard Types
export interface ChartData {
	name: string;
	total: number;
}

export interface TopProduct {
	id: string;
	name: string;
	price: number;
	quantity: number;
	total: number;
	image: string;
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
	};
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
