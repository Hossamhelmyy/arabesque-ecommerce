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

const SignUpForm: React.FC = () => {
	const { t } = useTranslation();
	const { signUp, isLoading } = useAuthActions();
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
			[id.replace("-signup", "")]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await signUp(formValues);
	};

	return (
		<form onSubmit={handleSubmit}>
			<CardHeader>
				<CardTitle>{t("auth.signUp")}</CardTitle>
				<CardDescription>
					{t("auth.signUpDescription")}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="email-signup">
						{t("auth.email")}
					</Label>
					<Input
						id="email-signup"
						type="email"
						placeholder="name@example.com"
						value={formValues.email}
						onChange={handleInputChange}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="password-signup">
						{t("auth.password")}
					</Label>
					<Input
						id="password-signup"
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
						? t("auth.signingUp")
						: t("auth.signUp")}
				</Button>
			</CardFooter>
		</form>
	);
};

export default SignUpForm;
