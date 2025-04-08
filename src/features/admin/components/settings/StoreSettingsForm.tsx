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
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { StoreSettings } from "../../types";

interface StoreSettingsFormProps {
	initialValues: StoreSettings;
	onSubmit: (values: StoreSettings) => Promise<void>;
	isSubmitting: boolean;
}

const storeSettingsSchema = z.object({
	store_name: z.string().min(1, "Store name is required"),
	store_description: z.string().optional(),
	contact_email: z
		.string()
		.email("Invalid email address")
		.min(1, "Contact email is required"),
	contact_phone: z.string().optional(),
	address: z.string().optional(),
	logo_url: z.string().optional(),
	favicon_url: z.string().optional(),
	currency: z.string().min(1, "Currency is required"),
});

export const StoreSettingsForm = ({
	initialValues,
	onSubmit,
	isSubmitting,
}: StoreSettingsFormProps) => {
	const { t } = useTranslation();
	const form = useForm<StoreSettings>({
		resolver: zodResolver(storeSettingsSchema),
		defaultValues: initialValues,
	});

	const handleSubmit = async (values: StoreSettings) => {
		await onSubmit(values);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("admin.storeSettings")}</CardTitle>
				<CardDescription>
					{t("admin.storeSettingsDescription")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="store_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("admin.storeName")}
										</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="currency"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("admin.currency")}
										</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormDescription>
											{t("admin.currencyDescription")}
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="store_description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("admin.storeDescription")}
									</FormLabel>
									<FormControl>
										<Textarea
											rows={4}
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="contact_email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("admin.contactEmail")}
										</FormLabel>
										<FormControl>
											<Input type="email" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="contact_phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("admin.contactPhone")}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={field.value || ""}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("admin.address")}
									</FormLabel>
									<FormControl>
										<Textarea
											rows={3}
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="logo_url"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("admin.logoUrl")}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={field.value || ""}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="favicon_url"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("admin.faviconUrl")}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={field.value || ""}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

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
