import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

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

// Define interface for Profile with typed address
export interface UserProfile {
	id: string;
	first_name: string | null;
	last_name: string | null;
	email: string | null;
	phone: string | null;
	address: {
		street?: string;
		city?: string;
		state?: string;
		zipCode?: string;
		country?: string;
	} | null;
	avatar_url: string | null;
}

// Define form schema
export const checkoutFormSchema = z.object({
	fullName: z
		.string()
		.min(2, { message: "Full name is required" }),
	email: z
		.string()
		.email({ message: "Invalid email address" }),
	phone: z
		.string()
		.min(5, { message: "Phone number is required" }),
	address: z
		.string()
		.min(5, { message: "Address is required" }),
	city: z.string().min(2, { message: "City is required" }),
	state: z
		.string()
		.min(2, { message: "State is required" }),
	zipCode: z
		.string()
		.min(3, { message: "ZIP code is required" }),
	country: z
		.string()
		.min(2, { message: "Country is required" }),
	paymentMethod: z.enum([
		"credit_card",
		"cash_on_delivery",
	]),
	notes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<
	typeof checkoutFormSchema
>;

export interface CartItem {
	id: string;
	name: string;
	price: number;
	quantity: number;
	images?: string[];
	color?: string;
	size?: string;
}

export interface ShippingAddress {
	fullName: string;
	email: string;
	phone: string;
	street: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
}

export interface UseCheckoutReturn {
	isSubmitting: boolean;
	isProcessingPayment: boolean;
	userProfile: UserProfile | null;
	isLoadingProfile: boolean;
	form: UseFormReturn<CheckoutFormValues>;
	cartItems: CartItem[];
	calculateSubtotal: () => number;
	shippingCost: number;
	taxRate: number;
	taxAmount: number;
	totalAmount: number;
	onSubmit: (values: CheckoutFormValues) => Promise<void>;
}

export interface OrderSummary {
	items: CartItem[];
	subtotal: number;
	shippingCost: number;
	taxAmount: number;
	total: number;
}

export interface Order extends OrderSummary {
	id: string;
	userId: string;
	orderNumber: string;
	status:
		| "pending"
		| "processing"
		| "shipped"
		| "delivered"
		| "cancelled";
	shippingDetails: Omit<
		CheckoutFormData,
		"paymentMethod" | "notes"
	>;
	paymentMethod: PaymentMethod;
	paymentStatus: "pending" | "paid" | "failed";
	notes?: string;
	createdAt: string;
	updatedAt: string;
}
