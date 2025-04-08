import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import {
	StoreSettings,
	EmailSettings,
	ShippingSettings,
} from "../types";

export type Settings = {
	store: StoreSettings;
	email: EmailSettings;
	shipping: ShippingSettings;
};

export const useSettings = () => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch settings
	const { data: settings, isLoading } = useQuery({
		queryKey: ["settings"],
		queryFn: async () => {
			try {
				// In a real app, we would fetch this from the database
				// For now, we'll return dummy data
				const dummySettings: Settings = {
					store: {
						store_name: "Arabesque",
						store_description:
							"An elegant e-commerce store for exotic goods",
						contact_email: "contact@arabesque.com",
						contact_phone: "+1 234 567 890",
						address:
							"123 Oasis Street, Suite 100, Marrakech",
						logo_url: "/images/logo.png",
						favicon_url: "/images/favicon.ico",
						currency: "USD",
					},
					email: {
						smtp_host: "smtp.example.com",
						smtp_port: "587",
						smtp_user: "user@example.com",
						smtp_password: "password",
						sender_name: "Arabesque Store",
						sender_email: "no-reply@arabesque.com",
						email_template:
							"<h1>{{subject}}</h1><p>{{message}}</p>",
					},
					shipping: {
						enable_shipping: true,
						free_shipping_threshold: "100",
						default_shipping_rate: "10",
						allow_international_shipping: false,
						shipping_countries: ["US", "CA", "MX"],
						shipping_zones: [
							{
								name: "North America",
								countries: ["US", "CA", "MX"],
								rate: "10",
							},
							{
								name: "Europe",
								countries: ["UK", "FR", "DE", "ES", "IT"],
								rate: "25",
							},
						],
					},
				};

				// Simulate API delay
				await new Promise((resolve) =>
					setTimeout(resolve, 500),
				);

				return dummySettings;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to fetch settings";
				setError(errorMessage);
				toast({
					title: t("Error"),
					description: errorMessage,
					variant: "destructive",
				});
				return null;
			}
		},
	});

	// Update store settings
	const storeSettingsMutation = useMutation({
		mutationFn: async (storeSettings: StoreSettings) => {
			setIsSubmitting(true);
			try {
				// In a real app, we would save to the database
				// For now, we'll simulate an API call
				await new Promise((resolve) =>
					setTimeout(resolve, 1000),
				);
				return storeSettings;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to update store settings";
				throw new Error(errorMessage);
			} finally {
				setIsSubmitting(false);
			}
		},
		onSuccess: (data) => {
			queryClient.setQueryData(
				["settings"],
				(oldData: Settings | undefined) => {
					if (oldData) {
						return {
							...oldData,
							store: data,
						};
					}
					return oldData;
				},
			);
			toast({
				title: t("Success"),
				description: t("Store settings have been updated."),
			});
		},
		onError: (error: Error) => {
			toast({
				title: t("Error"),
				description:
					error.message ||
					t("Failed to update store settings."),
				variant: "destructive",
			});
		},
	});

	// Update email settings
	const emailSettingsMutation = useMutation({
		mutationFn: async (emailSettings: EmailSettings) => {
			setIsSubmitting(true);
			try {
				// In a real app, we would save to the database
				// For now, we'll simulate an API call
				await new Promise((resolve) =>
					setTimeout(resolve, 1000),
				);
				return emailSettings;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to update email settings";
				throw new Error(errorMessage);
			} finally {
				setIsSubmitting(false);
			}
		},
		onSuccess: (data) => {
			queryClient.setQueryData(
				["settings"],
				(oldData: Settings | undefined) => {
					if (oldData) {
						return {
							...oldData,
							email: data,
						};
					}
					return oldData;
				},
			);
			toast({
				title: t("Success"),
				description: t("Email settings have been updated."),
			});
		},
		onError: (error: Error) => {
			toast({
				title: t("Error"),
				description:
					error.message ||
					t("Failed to update email settings."),
				variant: "destructive",
			});
		},
	});

	// Update shipping settings
	const shippingSettingsMutation = useMutation({
		mutationFn: async (
			shippingSettings: ShippingSettings,
		) => {
			setIsSubmitting(true);
			try {
				// In a real app, we would save to the database
				// For now, we'll simulate an API call
				await new Promise((resolve) =>
					setTimeout(resolve, 1000),
				);
				return shippingSettings;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to update shipping settings";
				throw new Error(errorMessage);
			} finally {
				setIsSubmitting(false);
			}
		},
		onSuccess: (data) => {
			queryClient.setQueryData(
				["settings"],
				(oldData: Settings | undefined) => {
					if (oldData) {
						return {
							...oldData,
							shipping: data,
						};
					}
					return oldData;
				},
			);
			toast({
				title: t("Success"),
				description: t(
					"Shipping settings have been updated.",
				),
			});
		},
		onError: (error: Error) => {
			toast({
				title: t("Error"),
				description:
					error.message ||
					t("Failed to update shipping settings."),
				variant: "destructive",
			});
		},
	});

	// Wrapper functions that return Promise<void> to satisfy component props
	const updateStoreSettings = async (
		data: StoreSettings,
	): Promise<void> => {
		await storeSettingsMutation.mutateAsync(data);
	};

	const updateEmailSettings = async (
		data: EmailSettings,
	): Promise<void> => {
		await emailSettingsMutation.mutateAsync(data);
	};

	const updateShippingSettings = async (
		data: ShippingSettings,
	): Promise<void> => {
		await shippingSettingsMutation.mutateAsync(data);
	};

	// Get settings values for forms
	const getStoreSettingsValues =
		(): StoreSettings | null => {
			if (!settings) return null;
			return settings.store;
		};

	const getEmailSettingsValues =
		(): EmailSettings | null => {
			if (!settings) return null;
			return settings.email;
		};

	const getShippingSettingsValues =
		(): ShippingSettings | null => {
			if (!settings) return null;
			return settings.shipping;
		};

	return {
		settings,
		isLoading,
		isSubmitting,
		error,
		updateStoreSettings,
		updateEmailSettings,
		updateShippingSettings,
		getStoreSettingsValues,
		getEmailSettingsValues,
		getShippingSettingsValues,
	};
};
