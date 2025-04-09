import { z } from "zod";

export const signUpSchema = z.object({
	email: z
		.string()
		.min(1, { message: "validation.required" })
		.email({ message: "validation.email" }),
	password: z
		.string()
		.min(1, { message: "validation.required" })
		.min(6, {
			message: "validation.passwordMinLength",
		}),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
