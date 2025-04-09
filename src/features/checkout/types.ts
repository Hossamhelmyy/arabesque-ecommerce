import { z } from "zod";
import { checkoutFormSchema } from "./schemas";

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

export type CheckoutFormValues = z.infer<
	typeof checkoutFormSchema
>;

export type ShippingMethod = "standard" | "express";

export interface CartItem {
	id: string;
	quantity: number;
	product: {
		id: string;
		name: string;
		price: number;
		image_url: string;
	};
}

export interface OrderSummary {
	subtotal: number;
	shipping: number;
	tax: number;
	total: number;
}

export interface OrderItem {
	id: string;
	name: string;
	price: number;
	quantity: number;
	image: string;
}

export interface Order {
	id: string;
	userId: string;
	items: OrderItem[];
	summary: OrderSummary;
	shippingInfo: Omit<
		CheckoutFormValues,
		| "cardNumber"
		| "expiryDate"
		| "cvv"
		| "cardholderName"
		| "saveCard"
		| "sameAsBilling"
	>;
	status:
		| "pending"
		| "processing"
		| "completed"
		| "cancelled";
	createdAt: string;
	updatedAt: string;
}

export interface CheckoutFormData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
	apartment?: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
	sameAsBilling: boolean;
	cardNumber: string;
	expiryDate: string;
	cvv: string;
	cardholderName: string;
	saveCard: boolean;
	saveAddress: boolean;
	deliveryInstructions: string;
	giftMessage: string;
	giftWrap: boolean;
	shippingMethod: "standard" | "express";
}
