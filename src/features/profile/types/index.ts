export type UserProfile = {
	id: string;
	email: string;
	full_name?: string;
	avatar_url?: string;
	phone?: string;
	created_at: string;
};

export type Order = {
	id: string;
	user_id: string;
	status:
		| "pending"
		| "processing"
		| "shipped"
		| "delivered"
		| "cancelled";
	created_at: string;
	total: number;
	shipping_address?: string;
	payment_method: string;
	tracking_number?: string;
};

export type OrderItem = {
	id: string;
	order_id: string;
	product_id: string;
	quantity: number;
	price: number;
	product: {
		name: string;
		name_ar: string;
		image: string;
		slug: string;
	};
};

export type ProfileFormValues = {
	firstName: string;
	lastName: string;
	firstName_ar?: string;
	lastName_ar?: string;
	phone?: string;
};

export type PasswordFormValues = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};

export type Address = {
	id?: string;
	user_id?: string;
	full_name: string;
	street_address: string;
	city: string;
	state: string;
	postal_code: string;
	country: string;
	phone_number: string;
	is_default?: boolean;
	created_at?: string;
};
