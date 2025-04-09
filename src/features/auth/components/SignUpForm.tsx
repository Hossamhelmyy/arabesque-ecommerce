import React from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	CardHeader,
	CardContent,
	CardFooter,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "../hooks";
import {
	signUpSchema,
	SignUpFormValues,
} from "../schemas/sign-up-schema";

const SignUpForm: React.FC = () => {
	const { t } = useTranslation();
	const { signUp, isLoading } = useAuthActions();

	const form = useForm<SignUpFormValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onChange",
	});

	const handleSubmit = async (values: SignUpFormValues) => {
		await signUp({
			email: values.email.trim(),
			password: values.password,
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<CardHeader>
					<CardTitle>{t("auth.signUp")}</CardTitle>
					<CardDescription>
						{t("auth.signUpDescription")}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("auth.email")}</FormLabel>
								<FormControl>
									<Input
										placeholder={t("auth.emailPlaceholder")}
										type="email"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("auth.password")}</FormLabel>
								<FormControl>
									<Input type="password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</CardContent>
				<CardFooter>
					<Button
						type="submit"
						className="w-full"
						disabled={isLoading || !form.formState.isValid}>
						{isLoading
							? t("auth.signingUp")
							: t("auth.signUp")}
					</Button>
				</CardFooter>
			</form>
		</Form>
	);
};

export default SignUpForm;
