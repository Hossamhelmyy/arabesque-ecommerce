export type PaymentMethod = "card" | "cash";

export type ShippingMethod = {
	id: string;
	name: string;
	name_ar: string;
	price: number;
	estimated_days: number;
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
};

export type CheckoutFormData = {
	shippingAddress: Address;
	billingAddress: Address;
	shippingMethod: string;
	paymentMethod: PaymentMethod;
	sameAsBilling: boolean;
	saveAddress: boolean;
};
