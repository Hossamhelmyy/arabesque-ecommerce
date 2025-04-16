import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { Loader2 } from "lucide-react";
import { uploadMultipleFiles } from "@/utils/supabase-uploads";
import type { Product, Category } from "../../types";
import {
	productSchema,
	ProductFormValues,
} from "./product-form-schema";
import { useProducts } from "../../hooks/useProducts";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from "@/context/LanguageContext";

interface ProductFormProps {
	selectedProduct: Product | null;
	categories: Category[];
	onOpenChange: (open: boolean) => void;
}

export function ProductForm({
	selectedProduct,
	categories,
	onOpenChange,
}: ProductFormProps) {
	const { t } = useTranslation();
	const { createProduct, updateProduct, isSubmitting } =
		useProducts();
	const [loading, setLoading] = useState(false);
	const { isRTL } = useLanguage();
	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema),
		defaultValues: selectedProduct
			? {
					name: selectedProduct.name,
					name_ar: selectedProduct.name_ar || "",
					description: selectedProduct.description || "",
					description_ar:
						selectedProduct.description_ar || "",
					price: selectedProduct.price,
					original_price:
						selectedProduct.original_price || null,
					stock_quantity:
						selectedProduct.stock_quantity || 0,
					images: [
						selectedProduct.image,
						...(Array.isArray(selectedProduct.images)
							? selectedProduct.images
							: selectedProduct.images
							? Object.values(selectedProduct.images)
							: []),
					].filter(Boolean),
					category_id: selectedProduct.category_id,
					is_featured: selectedProduct.is_featured || false,
					is_new: selectedProduct.is_new || false,
					is_on_sale: selectedProduct.is_on_sale || false,
			  }
			: {
					name: "",
					name_ar: "",
					description: "",
					description_ar: "",
					price: 0,
					original_price: null,
					stock_quantity: 0,
					images: [],
					category_id: null,
					is_featured: false,
					is_new: true,
					is_on_sale: false,
			  },
		mode: "onChange",
	});

	const isValid = form.formState.isValid;
	const isDirty = form.formState.isDirty;
	console.log(form.watch());
	const handleSubmit = async (
		values: ProductFormValues,
	) => {
		try {
			setLoading(true);

			if (values.images.length === 0) {
				toast({
					title: t("common.error"),
					description: t("admin.imageRequired"),
					variant: "destructive",
				});
				setLoading(false);
				return;
			}

			if (selectedProduct) {
				await updateProduct(selectedProduct.id, {
					...values,
					image: values.images[0],
					images: values.images.slice(1),
				});
				toast({
					title: t("admin.productUpdated"),
					description: t("admin.productUpdatedMessage"),
				});
			} else {
				const productData = {
					name: values.name,
					name_ar: values.name_ar || "",
					description: values.description || "",
					description_ar: values.description_ar || "",
					price: values.price,
					original_price: values.original_price,
					stock_quantity: values.stock_quantity || 0,
					image: values.images[0],
					images: values.images.slice(1),
					category_id: values.category_id || null,
					is_featured: values.is_featured || false,
					is_new: values.is_new || false,
					is_on_sale: values.is_on_sale || false,
				};

				await createProduct(productData);
				toast({
					title: t("admin.productCreated"),
					description: t("admin.productCreatedMessage"),
				});
			}
			onOpenChange(false);
		} catch (error) {
			console.error(
				`Error ${
					selectedProduct ? "updating" : "creating"
				} product:`,
				error,
			);
			toast({
				title: t("common.error"),
				description: t("admin.productSaveError"),
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form
				dir={isRTL ? "rtl" : "ltr"}
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("admin.name")} ({t("common.english")}
										)
									</FormLabel>
									<FormControl>
										<Input
											placeholder={t(
												"admin.inputNamePlaceholder",
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
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("admin.description")} (
										{t("common.english")})
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder={t(
												"admin.inputDescriptionPlaceholder",
											)}
											{...field}
											rows={5}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="space-y-4">
						<FormField
							control={form.control}
							name="name_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("admin.name")} ({t("common.arabic")})
									</FormLabel>
									<FormControl>
										<Input
											placeholder={t(
												"admin.inputNamePlaceholder",
											)}
											{...field}
											dir="rtl"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description_ar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("admin.description")} (
										{t("common.arabic")})
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder={t(
												"admin.inputDescriptionPlaceholder",
											)}
											{...field}
											rows={5}
											dir="rtl"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<FormField
					control={form.control}
					name="images"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								{t("admin.productImages")}
							</FormLabel>
							<FormControl>
								<FileUpload
									value={form.watch("images")}
									onChange={(urls) => {
										if (typeof urls === "string") {
											form.setValue("images", [urls]);
										} else {
											form.setValue("images", urls);
										}
									}}
									onFilesAdded={async (files) => {
										return await uploadMultipleFiles(
											files,
											"products",
										);
									}}
									multiple={true}
									maxFiles={6}
								/>
							</FormControl>
							<FormDescription>
								{t("admin.firstImageMain")}
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("admin.price")}</FormLabel>
									<FormControl>
										<Input
											type="number"
											{...field}
											min={0}
											step={0.01}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="original_price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("admin.originalPrice")}
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											{...field}
											value={field.value ?? ""}
											onChange={(e) => {
												const value = e.target.value;
												field.onChange(
													value === ""
														? null
														: parseFloat(value),
												);
											}}
											min={0}
											step={0.01}
										/>
									</FormControl>
									<FormDescription>
										{t("admin.originalPriceDescription")}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="stock_quantity"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("admin.stockQuantity")}
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											{...field}
											min={0}
											step={1}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="space-y-4">
						<FormField
							control={form.control}
							name="category_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("admin.category")}
									</FormLabel>
									<Select
										dir={isRTL ? "rtl" : "ltr"}
										onValueChange={field.onChange}
										value={field.value || undefined}>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													placeholder={t(
														"admin.selectCategory",
													)}
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="none">
												{t("admin.uncategorized")}
											</SelectItem>
											{categories.map((category) => (
												<SelectItem
													key={category.id}
													value={category.id}>
													{isRTL
														? category.name_ar
														: category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormItem className="border rounded-md p-4 space-y-3">
							<FormLabel>
								{t("admin.productState")}
							</FormLabel>
							<div className="space-y-2">
								<FormField
									control={form.control}
									name="is_featured"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start gap-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value || false}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel>
													{t("admin.featured")}
												</FormLabel>
											</div>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="is_new"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start gap-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value || false}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel>
													{t("admin.new")}
												</FormLabel>
											</div>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="is_on_sale"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start gap-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value || false}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel>
													{t("admin.onSale")}
												</FormLabel>
											</div>
										</FormItem>
									)}
								/>
							</div>
						</FormItem>
					</div>
				</div>

				<div className="flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}>
						{t("admin.cancel")}
					</Button>
					<Button
						type="submit"
						disabled={
							loading ||
							isSubmitting ||
							!isValid ||
							!isDirty
						}>
						{(loading || isSubmitting) && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						{selectedProduct
							? t("admin.saveChanges")
							: t("admin.addProduct")}
					</Button>
				</div>
			</form>
		</Form>
	);
}
