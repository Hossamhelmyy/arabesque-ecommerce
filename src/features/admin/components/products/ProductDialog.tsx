import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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

const productSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	name_ar: z.string().min(2, {
		message: "Arabic name must be at least 2 characters.",
	}),
	description: z.string().optional(),
	description_ar: z.string().optional(),
	price: z.coerce.number().min(0, {
		message: "Price must be a positive number.",
	}),
	original_price: z.coerce
		.number()
		.min(0)
		.optional()
		.nullable(),
	stock_quantity: z.coerce.number().min(0, {
		message: "Stock quantity must be a positive number.",
	}),
	image: z
		.string()
		.url({ message: "Please enter a valid image URL." }),
	images: z.array(z.string().url()).optional(),
	category_id: z.string().optional().nullable(),
	is_featured: z.boolean().optional().nullable(),
	is_new: z.boolean().optional().nullable(),
	is_on_sale: z.boolean().optional().nullable(),
	slug: z.string().optional(),
});

interface ProductDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	selectedProduct: Product | null;
	categories: Category[];
	isSubmitting: boolean;
	onSubmit: (
		data: z.infer<typeof productSchema>,
	) => Promise<void>;
}

export const ProductDialog = ({
	open,
	onOpenChange,
	selectedProduct,
	categories,
	isSubmitting,
	onSubmit,
}: ProductDialogProps) => {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState("english");

	const form = useForm<z.infer<typeof productSchema>>({
		resolver: zodResolver(productSchema),
		defaultValues: {
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
	});

	useEffect(() => {
		if (selectedProduct) {
			form.reset({
				name: selectedProduct.name,
				name_ar: selectedProduct.name_ar || "",
				description: selectedProduct.description || "",
				description_ar:
					selectedProduct.description_ar || "",
				price: selectedProduct.price,
				original_price:
					selectedProduct.original_price || null,
				stock_quantity: selectedProduct.stock_quantity || 0,
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
			});
		} else {
			form.reset({
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
			});
		}
	}, [selectedProduct, form]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
				<DialogHeader>
					<DialogTitle>
						{selectedProduct
							? t("admin.editProductTitle")
							: t("admin.addNewProduct")}
					</DialogTitle>
					<DialogDescription>
						{selectedProduct
							? t("admin.editProductDescription")
							: t("admin.addProductDescription")}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
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
															...(form.watch("images") ||
																[]),
														].filter(Boolean)}
														onChange={(urls) => {
															if (
																typeof urls === "string"
															) {
																form.setValue(
																	"image",
																	urls,
																);
																form.setValue("images", []);
															} else if (urls.length > 0) {
																form.setValue(
																	"image",
																	urls[0],
																);
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
												<FormDescription>
													{t(
														"admin.productImagesDescription",
													)}
												</FormDescription>
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
												{t("admin.name")} (
												{t("common.arabic")})
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
											<FormLabel>
												{t("admin.price")}
											</FormLabel>
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
												{t(
													"admin.originalPriceDescription",
												)}
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
												<FormItem className="flex flex-row items-start space-x-3 space-y-0">
													<FormControl>
														<Checkbox
															checked={field.value || false}
															onCheckedChange={
																field.onChange
															}
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
												<FormItem className="flex flex-row items-start space-x-3 space-y-0">
													<FormControl>
														<Checkbox
															checked={field.value || false}
															onCheckedChange={
																field.onChange
															}
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
												<FormItem className="flex flex-row items-start space-x-3 space-y-0">
													<FormControl>
														<Checkbox
															checked={field.value || false}
															onCheckedChange={
																field.onChange
															}
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

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}>
								{t("admin.cancel")}
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								{selectedProduct
									? t("admin.saveChanges")
									: t("admin.addProduct")}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
