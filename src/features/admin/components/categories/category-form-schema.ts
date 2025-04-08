import { z } from "zod";

// Schema for category form validation - making fields optional to match CategoryFormValues in useCategories.tsx
export const categorySchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	name_ar: z.string().min(2, {
		message: "Arabic name must be at least 2 characters.",
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
