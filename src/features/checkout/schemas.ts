import { z } from "zod";

export const checkoutFormSchema = z.object({
	// Shipping Information
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	phone: z
		.string()
		.min(10, "Phone number must be at least 10 digits"),
	address: z.string().min(1, "Address is required"),
	apartment: z.string().optional(),
	city: z.string().min(1, "City is required"),
	state: z.string().min(1, "State is required"),
	zipCode: z.string().min(1, "ZIP code is required"),
	country: z.string().min(1, "Country is required"),
	saveAddress: z.boolean().default(false),

	// Shipping Method
	shippingMethod: z
		.enum(["standard", "express"])
		.default("standard"),

	// Payment Information
	sameAsBilling: z.boolean().default(true),
	cardNumber: z.string().min(1, "Card number is required"),
	expiryDate: z.string().min(1, "Expiry date is required"),
	cvv: z
		.string()
		.min(3, "CVV is required")
		.max(4, "CVV must be 3-4 digits"),
	cardholderName: z
		.string()
		.min(1, "Cardholder name is required"),
	saveCard: z.boolean().default(false),

	// Additional Options
	giftWrap: z.boolean().default(false),
	giftMessage: z.string().optional(),
	deliveryInstructions: z.string().optional(),
});

export type CheckoutFormValues = z.infer<
	typeof checkoutFormSchema
>;
