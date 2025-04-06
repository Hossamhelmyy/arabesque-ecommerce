// Common entity types
export type User = {
	id: string;
	email: string;
	name?: string;
	avatar_url?: string;
	created_at: string;
};

export type CartItem = {
	id?: string;
	product_id: string;
	quantity: number;
	name: string;
	name_ar: string;
	price: number;
	image: string;
};

// Common response types
export type ApiError = {
	message: string;
	status: number;
};

// UI types
export type SortDirection = "asc" | "desc";

// Create re-exports of existing feature-specific types to avoid circular dependencies
export * from "../../features/products/types";
