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
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
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
	const [activeTab, setActiveTab] = useState("english");

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
					image: selectedProduct.image,
					images: Array.isArray(selectedProduct.images)
						? selectedProduct.images
						: selectedProduct.images
						? Object.values(selectedProduct.images)
						: [],
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
					image: "",
					images: [],
					category_id: null,
					is_featured: false,
					is_new: true,
					is_on_sale: false,
			  },
		mode: "onChange", // Validate on change for better UX
	});

	// Track if the form is valid
	const isValid = form.formState.isValid;
	const isDirty = form.formState.isDirty;

	// Handle form submission
	const handleSubmit = async (
		values: ProductFormValues,
	) => {
		try {
			setLoading(true);

			if (selectedProduct) {
				await updateProduct(selectedProduct.id, values);
				toast({
					title: t("admin.productUpdated"),
					description: t("admin.productUpdatedMessage"),
				});
			} else {
				await createProduct(values);
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
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-6">
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="english">
							{t("admin.englishDetails")}
						</TabsTrigger>
						<TabsTrigger value="arabic">
							{t("admin.arabicDetails")}
						</TabsTrigger>
					</TabsList>

					<TabsContent
						value="english"
						className="space-y-4 pt-4">
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("admin.name")} (
											{t("common.english")})
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
												value={[
													form.watch("image"),
													...(form.watch("images") || []),
												].filter(Boolean)}
												onChange={(urls) => {
													if (typeof urls === "string") {
														form.setValue("image", urls);
														form.setValue("images", []);
													} else if (urls.length > 0) {
														form.setValue("image", urls[0]);
														form.setValue(
															"images",
															urls.slice(1),
														);
													} else {
														form.setValue("image", "");
														form.setValue("images", []);
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

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</TabsContent>

					<TabsContent
						value="arabic"
						className="space-y-4 pt-4">
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
					</TabsContent>
				</Tabs>

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
													{category.name}
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
										<FormItem className="flex flex-row items-start space-x-3 space-y-0 gap-2">
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
										<FormItem className="flex flex-row items-start space-x-3 space-y-0 gap-2">
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
										<FormItem className="flex flex-row items-start space-x-3 space-y-0 gap-2">
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
