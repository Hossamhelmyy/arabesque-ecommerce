import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ShippingSettings } from "../../types";

interface ShippingSettingsFormProps {
	initialValues: ShippingSettings;
	onSubmit: (values: ShippingSettings) => Promise<void>;
	isSubmitting: boolean;
}

const shippingSettingsSchema = z.object({
	enable_shipping: z.boolean(),
	free_shipping_threshold: z.string().optional(),
	default_shipping_rate: z
		.string()
		.min(1, "validation.defaultShippingRateRequired"),
	allow_international_shipping: z.boolean(),
	shipping_countries: z.array(z.string()).optional(),
	shipping_zones: z
		.array(
			z.object({
				name: z.string(),
				countries: z.array(z.string()),
				rate: z.string(),
			}),
		)
		.optional(),
});

export const ShippingSettingsForm = ({
	initialValues,
	onSubmit,
	isSubmitting,
}: ShippingSettingsFormProps) => {
	const { t } = useTranslation();
	const form = useForm<ShippingSettings>({
		resolver: zodResolver(shippingSettingsSchema),
		defaultValues: initialValues,
	});

	const handleSubmit = async (values: ShippingSettings) => {
		await onSubmit(values);
	};

	const enableShipping = form.watch("enable_shipping");
	const allowInternational = form.watch(
		"allow_international_shipping",
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("admin.shippingSettings")}</CardTitle>
				<CardDescription>
					{t("admin.shippingSettingsDescription")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6">
						<FormField
							control={form.control}
							name="enable_shipping"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											{t("admin.enableShipping")}
										</FormLabel>
										<FormDescription>
											{t("admin.enableShippingDescription")}
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											disabled={isSubmitting}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						{enableShipping && (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<FormField
										control={form.control}
										name="default_shipping_rate"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{t("admin.defaultShippingRate")}
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														{...field}
														min="0"
														step="0.01"
													/>
												</FormControl>
												<FormDescription>
													{t(
														"admin.defaultRateDescription",
													)}
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="free_shipping_threshold"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{t("admin.freeShippingThreshold")}
												</FormLabel>
												<FormControl>
													<Input
														type="number"
														{...field}
														value={field.value || ""}
														min="0"
														step="0.01"
													/>
												</FormControl>
												<FormDescription>
													{t(
														"admin.freeShippingDescription",
													)}
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name="allow_international_shipping"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
											<div className="space-y-0.5">
												<FormLabel className="text-base">
													{t(
														"admin.allowInternationalShipping",
													)}
												</FormLabel>
												<FormDescription>
													{t(
														"admin.internationalShippingDescription",
													)}
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
													disabled={isSubmitting}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</>
						)}

						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting
								? t("common.saving")
								: t("common.save")}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
