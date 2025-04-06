import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	CardHeader,
	CardContent,
	CardFooter,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "../hooks";
import { AuthFormValues } from "../types";

const SignInForm: React.FC = () => {
	const { t } = useTranslation();
	const { signIn, isLoading } = useAuthActions();
	const [formValues, setFormValues] =
		useState<AuthFormValues>({
			email: "",
			password: "",
		});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const { id, value } = e.target;
		setFormValues((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await signIn(formValues);
	};

	return (
		<form onSubmit={handleSubmit}>
			<CardHeader>
				<CardTitle>{t("auth.signIn")}</CardTitle>
				<CardDescription>
					{t("auth.signInDescription")}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="email">{t("auth.email")}</Label>
					<Input
						id="email"
						type="email"
						placeholder="name@example.com"
						value={formValues.email}
						onChange={handleInputChange}
						required
					/>
				</div>
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label htmlFor="password">
							{t("auth.password")}
						</Label>
						<Button
							variant="link"
							className="p-0 h-auto text-xs">
							{t("auth.forgotPassword")}
						</Button>
					</div>
					<Input
						id="password"
						type="password"
						value={formValues.password}
						onChange={handleInputChange}
						required
					/>
				</div>
			</CardContent>
			<CardFooter>
				<Button
					type="submit"
					className="w-full"
					disabled={isLoading}>
					{isLoading
						? t("auth.signingIn")
						: t("auth.signIn")}
				</Button>
			</CardFooter>
		</form>
	);
};

export default SignInForm;
