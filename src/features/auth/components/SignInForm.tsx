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
	signInSchema,
	SignInFormValues,
} from "../schemas/sign-in-schema";

const SignInForm: React.FC = () => {
	const { t } = useTranslation();
	const { signIn, isLoading } = useAuthActions();

	const form = useForm<SignInFormValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onChange",
	});

	const handleSubmit = async (values: SignInFormValues) => {
		await signIn({
			email: values.email.trim(),
			password: values.password,
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<CardHeader>
					<CardTitle>{t("auth.signIn")}</CardTitle>
					<CardDescription>
						{t("auth.signInDescription")}
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
								<div className="flex items-center justify-between">
									<FormLabel>
										{t("auth.password")}
									</FormLabel>
									<Button
										variant="link"
										className="p-0 h-auto text-xs">
										{t("auth.forgotPassword")}
									</Button>
								</div>
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
							? t("auth.signingIn")
							: t("auth.signIn")}
					</Button>
				</CardFooter>
			</form>
		</Form>
	);
};

export default SignInForm;
