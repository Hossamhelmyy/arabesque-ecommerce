import { z } from "zod";

// Schema for category form validation - making fields optional to match CategoryFormValues in useCategories.ts
export const categorySchema = z.object({
	name: z.string().min(2, {
		message: "validation.nameMinLength",
	}),
	name_ar: z.string().min(2, {
		message: "validation.arabicNameMinLength",
	}),
	description: z.string().optional().nullable(),
	description_ar: z.string().optional().nullable(),
	image: z.string().optional().nullable(),
});

// Type based on the schema
export type CategoryFormValues = {
	name: string;
	name_ar: string;
	description?: string | null;
	description_ar?: string | null;
	image?: string | null;
};
