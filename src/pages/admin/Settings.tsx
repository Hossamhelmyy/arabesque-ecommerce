import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Save } from "lucide-react";
import { useSettings } from "@/features/admin/hooks/useSettings";
import { ShippingSettings } from "@/features/admin/types";

// Form schemas
const storeSettingsSchema = z.object({
	storeName: z.string().min(2, {
		message: "Store name must be at least 2 characters.",
	}),
	storeEmail: z.string().email({
		message: "Please enter a valid email address.",
	}),
	storePhone: z.string().optional(),
	storeAddress: z.string().optional(),
	storeCurrency: z
		.string()
		.min(1, { message: "Please select a currency." }),
	storeLanguage: z
		.string()
		.min(1, { message: "Please select a language." }),
});

const emailSettingsSchema = z.object({
	smtpHost: z
		.string()
		.min(1, { message: "validation.smtpHostRequired" }),
	smtpPort: z
		.string()
		.regex(/^\d+$/, { message: "validation.invalidPort" }),
	smtpUser: z
		.string()
		.min(1, { message: "validation.smtpUsernameRequired" }),
	smtpPassword: z
		.string()
		.min(1, { message: "validation.smtpPasswordRequired" }),
	senderName: z
		.string()
		.min(1, { message: "validation.senderNameRequired" }),
	senderEmail: z.string().email({
		message: "validation.email",
	}),
});

const shippingSettingsSchema = z.object({
	enableShipping: z.boolean(),
	freeShippingThreshold: z
		.string()
		.regex(/^\d+(\.\d{1,2})?$/, {
			message: "validation.invalidAmount",
		})
		.optional(),
	defaultShippingRate: z
		.string()
		.regex(/^\d+(\.\d{1,2})?$/, {
			message: "validation.invalidAmount",
		}),
	allowInternationalShipping: z.boolean(),
});

const Settings = () => {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState("store");

	const {
		settings,
		isLoading,
		isSubmitting,
		updateStoreSettings,
		updateEmailSettings,
		updateShippingSettings,
		getStoreSettingsValues,
		getEmailSettingsValues,
		getShippingSettingsValues,
	} = useSettings();

	// Store settings form
	const storeSettingsForm = useForm<
		z.infer<typeof storeSettingsSchema>
	>({
		resolver: zodResolver(storeSettingsSchema),
		defaultValues: {
			storeName: "",
			storeEmail: "",
			storePhone: "",
			storeAddress: "",
			storeCurrency: "USD",
			storeLanguage: "en",
		},
	});

	// Email settings form
	const emailSettingsForm = useForm<
		z.infer<typeof emailSettingsSchema>
	>({
		resolver: zodResolver(emailSettingsSchema),
		defaultValues: {
			smtpHost: "",
			smtpPort: "",
			smtpUser: "",
			smtpPassword: "",
			senderName: "",
			senderEmail: "",
		},
	});

	// Shipping settings form
	const shippingSettingsForm = useForm<
		z.infer<typeof shippingSettingsSchema>
	>({
		resolver: zodResolver(shippingSettingsSchema),
		defaultValues: {
			enableShipping: true,
			freeShippingThreshold: "",
			defaultShippingRate: "",
			allowInternationalShipping: false,
		},
	});

	// Load settings into forms when available
	useEffect(() => {
		if (settings) {
			const storeValues = getStoreSettingsValues();
			if (storeValues) {
				storeSettingsForm.reset({
					storeName: storeValues.store_name,
					storeEmail: storeValues.contact_email,
					storePhone: storeValues.contact_phone || "",
					storeAddress: storeValues.address || "",
					storeCurrency: storeValues.currency,
					storeLanguage: "en", // Default language, not in the StoreSettings type
				});
			}

			const emailValues = getEmailSettingsValues();
			if (emailValues) {
				emailSettingsForm.reset({
					smtpHost: emailValues.smtp_host,
					smtpPort: emailValues.smtp_port,
					smtpUser: emailValues.smtp_user,
					smtpPassword: emailValues.smtp_password,
					senderName: emailValues.sender_name,
					senderEmail: emailValues.sender_email,
				});
			}

			const shippingValues = getShippingSettingsValues();
			if (shippingValues) {
				shippingSettingsForm.reset({
					enableShipping: shippingValues.enable_shipping,
					freeShippingThreshold:
						shippingValues.free_shipping_threshold || "",
					defaultShippingRate:
						shippingValues.default_shipping_rate,
					allowInternationalShipping:
						shippingValues.allow_international_shipping,
				});
			}
		}
	}, [
		emailSettingsForm,
		getEmailSettingsValues,
		getShippingSettingsValues,
		getStoreSettingsValues,
		settings,
		shippingSettingsForm,
		storeSettingsForm,
	]);

	// Handle store settings submit
	const onStoreSettingsSubmit = async (
		data: z.infer<typeof storeSettingsSchema>,
	) => {
		updateStoreSettings({
			store_name: data.storeName,
			contact_email: data.storeEmail,
			contact_phone: data.storePhone || "",
			address: data.storeAddress || "",
			currency: data.storeCurrency,
			// Include other required properties from StoreSettings
			store_description: "",
			logo_url: "",
			favicon_url: "",
		});
	};

	// Handle email settings submit
	const onEmailSettingsSubmit = async (
		data: z.infer<typeof emailSettingsSchema>,
	) => {
		updateEmailSettings({
			smtp_host: data.smtpHost,
			smtp_port: data.smtpPort,
			smtp_user: data.smtpUser,
			smtp_password: data.smtpPassword,
			sender_name: data.senderName,
			sender_email: data.senderEmail,
			// Include optional properties
			email_template: "",
		});
	};

	// Handle shipping settings submit
	const onShippingSettingsSubmit = async (
		data: z.infer<typeof shippingSettingsSchema>,
	) => {
		// Create an object with the correct property names
		const settingsData: ShippingSettings = {
			enable_shipping: data.enableShipping,
			free_shipping_threshold:
				data.freeShippingThreshold || "",
			default_shipping_rate: data.defaultShippingRate,
			allow_international_shipping:
				data.allowInternationalShipping,
			shipping_countries: [],
			shipping_zones: [],
		};

		// Update settings with the properly typed object
		updateShippingSettings(settingsData);
	};

	if (isLoading) {
		return (
			<div className="p-6 flex justify-center items-center h-[calc(100vh-100px)]">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">
				{t("Settings")}
			</h1>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-4">
				<TabsList>
					<TabsTrigger value="store">
						{t("Store")}
					</TabsTrigger>
					<TabsTrigger value="email">
						{t("Email")}
					</TabsTrigger>
					<TabsTrigger value="shipping">
						{t("Shipping")}
					</TabsTrigger>
				</TabsList>

				{/* Store Settings */}
				<TabsContent value="store">
					<Card>
						<CardHeader>
							<CardTitle>{t("Store Settings")}</CardTitle>
							<CardDescription>
								{t(
									"Configure your store information and preferences.",
								)}
							</CardDescription>
						</CardHeader>
						<Form {...storeSettingsForm}>
							<form
								onSubmit={storeSettingsForm.handleSubmit(
									onStoreSettingsSubmit,
								)}>
								<CardContent className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<FormField
											control={storeSettingsForm.control}
											name="storeName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t("Store Name")}
													</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={storeSettingsForm.control}
											name="storeEmail"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t("Store Email")}
													</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={storeSettingsForm.control}
											name="storePhone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t("Store Phone")}
													</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={storeSettingsForm.control}
											name="storeAddress"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t("Store Address")}
													</FormLabel>
													<FormControl>
														<Textarea {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<FormField
											control={storeSettingsForm.control}
											name="storeCurrency"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t("Currency")}
													</FormLabel>
													<FormControl>
														<select
															className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
															{...field}>
															<option value="USD">
																USD - US Dollar
															</option>
															<option value="EUR">
																EUR - Euro
															</option>
															<option value="GBP">
																GBP - British Pound
															</option>
															<option value="AED">
																AED - UAE Dirham
															</option>
														</select>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={storeSettingsForm.control}
											name="storeLanguage"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t("Language")}
													</FormLabel>
													<FormControl>
														<select
															className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
															{...field}>
															<option value="en">
																English
															</option>
															<option value="ar">
																Arabic
															</option>
															<option value="fr">
																French
															</option>
														</select>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
								<CardFooter>
									<Button
										type="submit"
										disabled={isSubmitting}>
										{isSubmitting ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												{t("Saving...")}
											</>
										) : (
											<>
												<Save className="mr-2 h-4 w-4" />
												{t("Save Settings")}
											</>
										)}
									</Button>
								</CardFooter>
							</form>
						</Form>
					</Card>
				</TabsContent>

				{/* Email Settings */}
				<TabsContent value="email">
					<Card>
						<CardHeader>
							<CardTitle>{t("Email Settings")}</CardTitle>
							<CardDescription>
								{t(
									"Configure your email server for notifications and customer communications.",
								)}
							</CardDescription>
						</CardHeader>
						<Form {...emailSettingsForm}>
							<form
								onSubmit={emailSettingsForm.handleSubmit(
									onEmailSettingsSubmit,
								)}>
								<CardContent className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<FormField
											control={emailSettingsForm.control}
											name="smtpHost"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t("SMTP Host")}
													</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={emailSettingsForm.control}
											name="smtpPort"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t("SMTP Port")}
													</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={emailSettingsForm.control}
											name="smtpUser"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t("SMTP Username")}
													</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={emailSettingsForm.control}
											name="smtpPassword"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t("SMTP Password")}
													</FormLabel>
													<FormControl>
														<Input
															type="password"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={emailSettingsForm.control}
											name="senderName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t("Sender Name")}
													</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={emailSettingsForm.control}
											name="senderEmail"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t("Sender Email")}
													</FormLabel>
													<FormControl>
														<Input {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
								<CardFooter>
									<Button
										type="submit"
										disabled={isSubmitting}>
										{isSubmitting ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												{t("Saving...")}
											</>
										) : (
											<>
												<Save className="mr-2 h-4 w-4" />
												{t("Save Settings")}
											</>
										)}
									</Button>
								</CardFooter>
							</form>
						</Form>
					</Card>
				</TabsContent>

				{/* Shipping Settings */}
				<TabsContent value="shipping">
					<Card>
						<CardHeader>
							<CardTitle>
								{t("Shipping Settings")}
							</CardTitle>
							<CardDescription>
								{t(
									"Configure your store's shipping options and rates.",
								)}
							</CardDescription>
						</CardHeader>
						<Form {...shippingSettingsForm}>
							<form
								onSubmit={shippingSettingsForm.handleSubmit(
									onShippingSettingsSubmit,
								)}>
								<CardContent className="space-y-6">
									<FormField
										control={shippingSettingsForm.control}
										name="enableShipping"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
												<div className="space-y-0.5">
													<FormLabel className="text-base">
														{t("Enable Shipping")}
													</FormLabel>
													<FormDescription>
														{t(
															"Enable shipping options for your products.",
														)}
													</FormDescription>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
											</FormItem>
										)}
									/>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<FormField
											control={shippingSettingsForm.control}
											name="defaultShippingRate"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t("Default Shipping Rate")}
													</FormLabel>
													<FormControl>
														<div className="flex">
															<span className="flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted">
																$
															</span>
															<Input
																className="rounded-l-none"
																{...field}
															/>
														</div>
													</FormControl>
													<FormDescription>
														{t(
															"The default shipping rate for orders.",
														)}
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={shippingSettingsForm.control}
											name="freeShippingThreshold"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t("Free Shipping Threshold")}
													</FormLabel>
													<FormControl>
														<div className="flex">
															<span className="flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted">
																$
															</span>
															<Input
																className="rounded-l-none"
																{...field}
															/>
														</div>
													</FormControl>
													<FormDescription>
														{t(
															"Orders above this amount qualify for free shipping.",
														)}
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={shippingSettingsForm.control}
										name="allowInternationalShipping"
										render={({ field }) => (
											<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
												<div className="space-y-0.5">
													<FormLabel className="text-base">
														{t(
															"Allow International Shipping",
														)}
													</FormLabel>
													<FormDescription>
														{t(
															"Allow shipping to international destinations.",
														)}
													</FormDescription>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</CardContent>
								<CardFooter>
									<Button
										type="submit"
										disabled={isSubmitting}>
										{isSubmitting ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												{t("Saving...")}
											</>
										) : (
											<>
												<Save className="mr-2 h-4 w-4" />
												{t("Save Settings")}
											</>
										)}
									</Button>
								</CardFooter>
							</form>
						</Form>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Settings;
