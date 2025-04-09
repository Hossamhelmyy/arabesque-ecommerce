import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutFormSchema } from "../schemas";
import type { CheckoutFormData } from "../types";
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
import {
	Loader2,
	CreditCard,
	Gift,
	Truck,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
	RadioGroup,
	RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface CheckoutFormProps {
	isSubmitting: boolean;
	isProcessingPayment: boolean;
	onSubmit: (data: CheckoutFormData) => void;
}

export function CheckoutForm({
	isSubmitting,
	isProcessingPayment,
	onSubmit,
}: CheckoutFormProps) {
	const { t } = useTranslation();
	const form = useForm<CheckoutFormData>({
		resolver: zodResolver(checkoutFormSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			address: "",
			city: "",
			state: "",
			zipCode: "",
			country: "",
			sameAsBilling: true,
			cardNumber: "",
			expiryDate: "",
			cvv: "",
			cardholderName: "",
			saveCard: false,
			saveAddress: false,
			deliveryInstructions: "",
			giftMessage: "",
			giftWrap: false,
			shippingMethod: "standard",
		},
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8">
				{/* Shipping Information */}
				<Card>
					<CardHeader>
						<CardTitle>
							{t("checkout.shippingInfo")}
						</CardTitle>
						<CardDescription>
							{t("checkout.shippingDesc")}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("checkout.firstName")}
										</FormLabel>
										<FormControl>
											<Input
												placeholder={t(
													"checkout.firstNamePlaceholder",
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
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("checkout.lastName")}
										</FormLabel>
										<FormControl>
											<Input
												placeholder={t(
													"checkout.lastNamePlaceholder",
												)}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("checkout.email")}
										</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder={t(
													"checkout.emailPlaceholder",
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
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("checkout.phone")}
										</FormLabel>
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
						</div>

						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("checkout.address")}
									</FormLabel>
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

						<FormField
							control={form.control}
							name="apartment"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("checkout.apartment")}
									</FormLabel>
									<FormControl>
										<Input
											placeholder={t(
												"checkout.apartmentPlaceholder",
											)}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="city"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("checkout.city")}
										</FormLabel>
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
							<FormField
								control={form.control}
								name="state"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("checkout.state")}
										</FormLabel>
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
						</div>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="zipCode"
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
							<FormField
								control={form.control}
								name="country"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("checkout.country")}
										</FormLabel>
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
						</div>

						<FormField
							control={form.control}
							name="saveAddress"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start  gap-3 space-y-0">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>
											{t("checkout.saveAddress")}
										</FormLabel>
									</div>
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>

				{/* Shipping Method */}
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<Truck className="h-5 w-5" />
							<CardTitle>
								{t("checkout.shippingMethod")}
							</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<FormField
							control={form.control}
							name="shippingMethod"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className="flex flex-col space-y-4">
											<div className="flex items-center space-x-3">
												<RadioGroupItem
													value="standard"
													id="standard"
												/>
												<Label
													htmlFor="standard"
													className="flex-1">
													<div className="font-medium">
														{t("checkout.standardShipping")}
													</div>
													<div className="text-sm text-muted-foreground">
														{t(
															"checkout.estimatedDelivery",
														)}
														: 3-5{" "}
														{t("checkout.businessDays")}
													</div>
												</Label>
											</div>
											<div className="flex items-center space-x-3">
												<RadioGroupItem
													value="express"
													id="express"
												/>
												<Label
													htmlFor="express"
													className="flex-1">
													<div className="font-medium">
														{t("checkout.expressShipping")}
													</div>
													<div className="text-sm text-muted-foreground">
														{t(
															"checkout.estimatedDelivery",
														)}
														: 1-2{" "}
														{t("checkout.businessDays")}
													</div>
												</Label>
											</div>
										</RadioGroup>
									</FormControl>
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>

				{/* Payment Information */}
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<CreditCard className="h-5 w-5" />
							<CardTitle>
								{t("checkout.billingInfo")}
							</CardTitle>
						</div>
						<CardDescription>
							{t("checkout.billingDesc")}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<FormField
							control={form.control}
							name="sameAsBilling"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start  gap-3 space-y-0">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>
											{t("checkout.sameAsShipping")}
										</FormLabel>
									</div>
								</FormItem>
							)}
						/>

						<Separator />

						<FormField
							control={form.control}
							name="cardNumber"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("checkout.cardNumber")}
									</FormLabel>
									<FormControl>
										<Input
											placeholder={t(
												"checkout.cardNumberPlaceholder",
											)}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-3 gap-4">
							<FormField
								control={form.control}
								name="expiryDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("checkout.expiryDate")}
										</FormLabel>
										<FormControl>
											<Input
												placeholder={t(
													"checkout.expiryDatePlaceholder",
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
								name="cvv"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("checkout.cvv")}
										</FormLabel>
										<FormControl>
											<Input
												placeholder={t(
													"checkout.cvvPlaceholder",
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
								name="cardholderName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("checkout.cardholderName")}
										</FormLabel>
										<FormControl>
											<Input
												placeholder={t(
													"checkout.cardholderNamePlaceholder",
												)}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="saveCard"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start  gap-3 space-y-0">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>
											{t("checkout.saveCard")}
										</FormLabel>
									</div>
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>

				{/* Additional Options */}
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<Gift className="h-5 w-5" />
							<CardTitle>
								{t("checkout.giftOptions")}
							</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						<FormField
							control={form.control}
							name="giftWrap"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start  gap-3 space-y-0">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>
											{t("checkout.giftWrap")}
										</FormLabel>
									</div>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="giftMessage"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("checkout.giftMessage")}
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder={t(
												"checkout.giftMessagePlaceholder",
											)}
											className="resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="deliveryInstructions"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("checkout.deliveryInstructions")}
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder={t(
												"checkout.deliveryInstructionsPlaceholder",
											)}
											className="resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>

				<Button
					type="submit"
					className="w-full"
					disabled={isSubmitting}>
					{isSubmitting && (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					)}
					{t("checkout.placeOrder")}
				</Button>
			</form>
		</Form>
	);
}
