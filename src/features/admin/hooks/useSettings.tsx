import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export type StoreSettings = {
	store_name: string;
	store_email: string;
	store_phone?: string;
	store_address?: string;
	currency: string;
	language: string;
};

export type EmailSettings = {
	smtp_host: string;
	smtp_port: string;
	smtp_user: string;
	smtp_password: string;
	sender_name: string;
	sender_email: string;
};

export type ShippingSettings = {
	enable_shipping: boolean;
	free_shipping_threshold?: string;
	default_shipping_rate: string;
	allow_international_shipping: boolean;
};

export type Settings = {
	store: StoreSettings;
	email: EmailSettings;
	shipping: ShippingSettings;
};

export interface StoreFormValues {
	storeName: string;
	storeEmail: string;
	storePhone: string;
	storeAddress: string;
	storeCurrency: string;
	storeLanguage: string;
}

export interface EmailFormValues {
	smtpHost: string;
	smtpPort: string;
	smtpUser: string;
	smtpPassword: string;
	senderName: string;
	senderEmail: string;
}

export interface ShippingFormValues {
	enableShipping: boolean;
	freeShippingThreshold: string;
	defaultShippingRate: string;
	allowInternationalShipping: boolean;
}

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
						store_email: "contact@arabesque.com",
						store_phone: "+1 234 567 890",
						store_address:
							"123 Oasis Street, Suite 100, Marrakech",
						currency: "USD",
						language: "en",
					},
					email: {
						smtp_host: "smtp.example.com",
						smtp_port: "587",
						smtp_user: "user@example.com",
						smtp_password: "password",
						sender_name: "Arabesque Store",
						sender_email: "no-reply@arabesque.com",
					},
					shipping: {
						enable_shipping: true,
						free_shipping_threshold: "100",
						default_shipping_rate: "10",
						allow_international_shipping: false,
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
	const updateStoreSettings = useMutation({
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
	const updateEmailSettings = useMutation({
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
	const updateShippingSettings = useMutation({
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

	// Format settings for forms
	const getStoreSettingsValues =
		(): StoreFormValues | null => {
			if (!settings) return null;

			return {
				storeName: settings.store.store_name,
				storeEmail: settings.store.store_email,
				storePhone: settings.store.store_phone || "",
				storeAddress: settings.store.store_address || "",
				storeCurrency: settings.store.currency,
				storeLanguage: settings.store.language,
			};
		};

	const getEmailSettingsValues =
		(): EmailFormValues | null => {
			if (!settings) return null;

			return {
				smtpHost: settings.email.smtp_host,
				smtpPort: settings.email.smtp_port,
				smtpUser: settings.email.smtp_user,
				smtpPassword: settings.email.smtp_password,
				senderName: settings.email.sender_name,
				senderEmail: settings.email.sender_email,
			};
		};

	const getShippingSettingsValues =
		(): ShippingFormValues | null => {
			if (!settings) return null;

			return {
				enableShipping: settings.shipping.enable_shipping,
				freeShippingThreshold:
					settings.shipping.free_shipping_threshold || "",
				defaultShippingRate:
					settings.shipping.default_shipping_rate,
				allowInternationalShipping:
					settings.shipping.allow_international_shipping,
			};
		};

	// Map form values back to API format
	const mapStoreFormToApi = (
		formData: StoreFormValues,
	): StoreSettings => {
		return {
			store_name: formData.storeName,
			store_email: formData.storeEmail,
			store_phone: formData.storePhone,
			store_address: formData.storeAddress,
			currency: formData.storeCurrency,
			language: formData.storeLanguage,
		};
	};

	const mapEmailFormToApi = (
		formData: EmailFormValues,
	): EmailSettings => {
		return {
			smtp_host: formData.smtpHost,
			smtp_port: formData.smtpPort,
			smtp_user: formData.smtpUser,
			smtp_password: formData.smtpPassword,
			sender_name: formData.senderName,
			sender_email: formData.senderEmail,
		};
	};

	const mapShippingFormToApi = (
		formData: ShippingFormValues,
	): ShippingSettings => {
		return {
			enable_shipping: formData.enableShipping,
			free_shipping_threshold:
				formData.freeShippingThreshold,
			default_shipping_rate: formData.defaultShippingRate,
			allow_international_shipping:
				formData.allowInternationalShipping,
		};
	};

	return {
		settings,
		isLoading,
		isSubmitting,
		error,
		updateStoreSettings: (formData: StoreFormValues) =>
			updateStoreSettings.mutate(
				mapStoreFormToApi(formData),
			),
		updateEmailSettings: (formData: EmailFormValues) =>
			updateEmailSettings.mutate(
				mapEmailFormToApi(formData),
			),
		updateShippingSettings: (
			formData: ShippingFormValues,
		) =>
			updateShippingSettings.mutate(
				mapShippingFormToApi(formData),
			),
		getStoreSettingsValues,
		getEmailSettingsValues,
		getShippingSettingsValues,
	};
};
