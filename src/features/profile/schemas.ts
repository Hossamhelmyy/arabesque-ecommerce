import * as z from "zod";

export const profileFormSchema = z.object({
	firstName: z
		.string()
		.min(2, "validation.firstNameMinLength"),
	lastName: z
		.string()
		.min(2, "validation.lastNameMinLength"),
	firstName_ar: z.string().optional(),
	lastName_ar: z.string().optional(),
	phone: z.string().optional(),
});

export const passwordFormSchema = z
	.object({
		currentPassword: z
			.string()
			.min(6, "validation.passwordMinLength"),
		newPassword: z
			.string()
			.min(6, "validation.passwordMinLength"),
		confirmPassword: z
			.string()
			.min(6, "validation.passwordMinLength"),
	})
	.refine(
		(data) => data.newPassword === data.confirmPassword,
		{
			message: "validation.passwordsDoNotMatch",
			path: ["confirmPassword"],
		},
	);
