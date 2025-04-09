import { z } from "zod";

export const checkoutFormSchema = z.object({
	// Shipping Information
	firstName: z.string().min(1, "validation.required"),
	lastName: z.string().min(1, "validation.required"),
	email: z.string().email("validation.email"),
	phone: z.string().min(10, "validation.phoneMinDigits"),
	address: z.string().min(1, "validation.required"),
	apartment: z.string().optional(),
	city: z.string().min(1, "validation.required"),
	state: z.string().min(1, "validation.required"),
	zipCode: z.string().min(1, "validation.required"),
	country: z.string().min(1, "validation.required"),
	saveAddress: z.boolean().default(false),

	// Shipping Method
	shippingMethod: z
		.enum(["standard", "express"])
		.default("standard"),

	// Payment Information
	sameAsBilling: z.boolean().default(true),
	cardNumber: z
		.string()
		.min(1, "validation.cardNumberRequired"),
	expiryDate: z
		.string()
		.min(1, "validation.expiryDateRequired"),
	cvv: z
		.string()
		.min(3, "validation.cvvRequired")
		.max(4, "validation.cvvRequired"),
	cardholderName: z
		.string()
		.min(1, "validation.cardholderNameRequired"),
	saveCard: z.boolean().default(false),

	// Additional Options
	giftWrap: z.boolean().default(false),
	giftMessage: z.string().optional(),
	deliveryInstructions: z.string().optional(),
});

export type CheckoutFormValues = z.infer<
	typeof checkoutFormSchema
>;
