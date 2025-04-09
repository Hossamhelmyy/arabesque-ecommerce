import { z } from "zod";

// Schema for product form validation
export const productSchema = z.object({
	name: z.string().min(2, {
		message: "validation.nameMinLength",
	}),
	name_ar: z.string().min(2, {
		message: "validation.arabicNameMinLength",
	}),
	description: z.string().optional(),
	description_ar: z.string().optional(),
	price: z.coerce.number().min(1, {
		message: "validation.positiveNumber",
	}),
	original_price: z.coerce
		.number()
		.min(1)
		.optional()
		.nullable(),
	stock_quantity: z.coerce.number().min(0, {
		message: "validation.positiveNumber",
	}),
	images: z.array(z.string().url()).min(1, {
		message: "validation.atLeastOneImage",
	}),
	category_id: z.string().optional().nullable(),
	is_featured: z.boolean().optional().nullable(),
	is_new: z.boolean().optional().nullable(),
	is_on_sale: z.boolean().optional().nullable(),
	slug: z.string().optional(),
});

// Type based on the schema
export type ProductFormValues = z.infer<
	typeof productSchema
>;
