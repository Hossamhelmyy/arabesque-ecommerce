import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import {
	AuthCredentials,
	SignInResponse,
	SignUpResponse,
} from "../types";

export const useAuthActions = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const signIn = async ({
		email,
		password,
	}: AuthCredentials): Promise<SignInResponse> => {
		setIsLoading(true);

		try {
			const { error } =
				await supabase.auth.signInWithPassword({
					email,
					password,
				});

			if (error) {
				toast({
					title: t("auth.errorSigningIn"),
					description: error.message,
					variant: "destructive",
				});
				return { success: false, error: error.message };
			} else {
				toast({
					title: t("auth.success"),
					description: t("auth.successSignedIn"),
				});
				navigate("/");
				return { success: true };
			}
		} catch (error) {
			console.error("Error during sign in:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: String(error);
			toast({
				title: t("auth.unexpectedError"),
				description: t("auth.tryAgainError"),
				variant: "destructive",
			});
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	};

	const signUp = async ({
		email,
		password,
	}: AuthCredentials): Promise<SignUpResponse> => {
		setIsLoading(true);

		try {
			const { error } = await supabase.auth.signUp({
				email,
				password,
			});

			if (error) {
				toast({
					title: t("auth.errorSigningUp"),
					description: error.message,
					variant: "destructive",
				});
				return { success: false, error: error.message };
			} else {
				toast({
					title: t("auth.success"),
					description: t("auth.checkEmail"),
				});
				return { success: true, confirmation: true };
			}
		} catch (error) {
			console.error("Error during sign up:", error);
			const errorMessage =
				error instanceof Error
					? error.message
					: String(error);
			toast({
				title: t("auth.unexpectedError"),
				description: t("auth.tryAgainError"),
				variant: "destructive",
			});
			return { success: false, error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	};

	return {
		signIn,
		signUp,
		isLoading,
	};
};
