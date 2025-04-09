import * as z from "zod";

export const profileFormSchema = z.object({
	firstName: z
		.string()
		.min(2, "First name must be at least 2 characters"),
	lastName: z
		.string()
		.min(2, "Last name must be at least 2 characters"),
	firstName_ar: z.string().optional(),
	lastName_ar: z.string().optional(),
	phone: z.string().optional(),
});

export const passwordFormSchema = z
	.object({
		currentPassword: z
			.string()
			.min(6, "Password must be at least 6 characters"),
		newPassword: z
			.string()
			.min(6, "Password must be at least 6 characters"),
		confirmPassword: z
			.string()
			.min(6, "Password must be at least 6 characters"),
	})
	.refine(
		(data) => data.newPassword === data.confirmPassword,
		{
			message: "Passwords do not match",
			path: ["confirmPassword"],
		},
	);
