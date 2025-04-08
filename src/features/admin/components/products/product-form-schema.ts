import { z } from "zod";

// Schema for product form validation
export const productSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	name_ar: z.string().min(2, {
		message: "Arabic name must be at least 2 characters.",
	}),
	description: z.string().optional(),
	description_ar: z.string().optional(),
	price: z.coerce.number().min(0, {
		message: "Price must be a positive number.",
	}),
	original_price: z.coerce
		.number()
		.min(0)
		.optional()
		.nullable(),
	stock_quantity: z.coerce.number().min(0, {
		message: "Stock quantity must be a positive number.",
	}),
	image: z
		.string()
		.url({ message: "Please enter a valid image URL." }),
	images: z.array(z.string().url()).optional(),
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
