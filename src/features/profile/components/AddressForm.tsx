import { useForm } from "react-hook-form";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Address } from "@/features/profile/types";
import { useLanguage } from "@/context/LanguageContext";

// Define form schema
const addressSchema = z.object({
	full_name: z.string().min(2, {
		message: "Full name must be at least 2 characters",
	}),
	street_address: z.string().min(5, {
		message: "Address must be at least 5 characters",
	}),
	city: z.string().min(2, {
		message: "City must be at least 2 characters",
	}),
	state: z.string().min(2, {
		message: "State/Province must be at least 2 characters",
	}),
	postal_code: z.string().min(3, {
		message: "Postal code must be at least 3 characters",
	}),
	country: z.string().min(2, {
		message: "Country must be at least 2 characters",
	}),
	phone_number: z.string().min(5, {
		message: "Phone number must be at least 5 characters",
	}),
	is_default: z.boolean().default(false),
});

export type AddressFormValues = z.infer<
	typeof addressSchema
>;

interface AddressFormProps {
	onSubmit: (data: AddressFormValues) => void;
	address?: Address;
	isSubmitting: boolean;
}

export const AddressForm = ({
	onSubmit,
	address,
	isSubmitting,
}: AddressFormProps) => {
	const { t } = useTranslation();
	const [isDefault, setIsDefault] = useState(
		address?.is_default || false,
	);
	const { isRTL } = useLanguage();

	// Initialize form with default values
	const form = useForm<AddressFormValues>({
		resolver: zodResolver(addressSchema),
		defaultValues: {
			full_name: address?.full_name || "",
			street_address: address?.street_address || "",
			city: address?.city || "",
			state: address?.state || "",
			postal_code: address?.postal_code || "",
			country: address?.country || "",
			phone_number: address?.phone_number || "",
			is_default: address?.is_default || false,
		},
	});

	// Handle form submission
	const handleSubmit = (data: AddressFormValues) => {
		onSubmit({ ...data, is_default: isDefault });
	};

	return (
		<Form {...form}>
			<form
				dir={isRTL ? "rtl" : "ltr"}
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-4">
				{/* Full Name */}
				<FormField
					control={form.control}
					name="full_name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{t("checkout.fullName")}
							</FormLabel>
							<FormControl>
								<Input
									placeholder={t(
										"checkout.fullNamePlaceholder",
									)}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Street Address */}
				<FormField
					control={form.control}
					name="street_address"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("checkout.address")}</FormLabel>
							<FormControl>
								<Input
									placeholder={t(
										"checkout.addressPlaceholder",
									)}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* City */}
				<FormField
					control={form.control}
					name="city"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("checkout.city")}</FormLabel>
							<FormControl>
								<Input
									placeholder={t(
										"checkout.cityPlaceholder",
									)}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Two columns for State and Postal Code */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="state"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("checkout.state")}</FormLabel>
								<FormControl>
									<Input
										placeholder={t(
											"checkout.statePlaceholder",
										)}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="postal_code"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									{t("checkout.zipCode")}
								</FormLabel>
								<FormControl>
									<Input
										placeholder={t(
											"checkout.zipCodePlaceholder",
										)}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Country */}
				<FormField
					control={form.control}
					name="country"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("checkout.country")}</FormLabel>
							<FormControl>
								<Input
									placeholder={t(
										"checkout.countryPlaceholder",
									)}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Phone Number */}
				<FormField
					control={form.control}
					name="phone_number"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("checkout.phone")}</FormLabel>
							<FormControl>
								<Input
									placeholder={t(
										"checkout.phonePlaceholder",
									)}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Default Address Checkbox */}
				<div className="flex items-center gap-x-2 pt-2">
					<Checkbox
						id="is_default"
						checked={isDefault}
						onCheckedChange={(checked) => {
							setIsDefault(checked === true);
							form.setValue("is_default", checked === true);
						}}
					/>
					<label
						htmlFor="is_default"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						{t("profile.setAsDefaultAddress")}
					</label>
				</div>

				<div className="pt-4 flex justify-end">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting
							? t("common.saving")
							: address
							? t("common.update")
							: t("common.save")}
					</Button>
				</div>
			</form>
		</Form>
	);
};
