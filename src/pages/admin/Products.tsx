import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Search,
	Plus,
	Pencil,
	Trash2,
	MoreHorizontal,
	Loader2,
	Image,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/features/admin/hooks/useProducts";
import type {
	Product,
	Category,
} from "@/features/admin/types";
import { generateSlug } from "@/utils/string";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { FileUpload } from "@/components/ui/file-upload";
import {
	uploadFile,
	uploadMultipleFiles,
} from "@/utils/supabase-uploads";

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

const Products = () => {
	const { t } = useTranslation();
	const {
		products,
		categories,
		filteredProducts,
		isLoading,
		isSubmitting,
		searchQuery,
		selectedProduct,
		setSearchQuery,
		setSelectedProduct,
		createProduct,
		updateProduct,
		deleteProduct,
		formatDate,
		formatPrice,
	} = useProducts();

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
		useState(false);
	const [productToDelete, setProductToDelete] = useState<
		string | null
	>(null);
	const { toast } = useToast();
	const [isAddEditDialogOpen, setIsAddEditDialogOpen] =
		useState(false);
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

	const handleSearch = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		setSearchQuery(e.target.value);
	};

	const handleEdit = (product: Product) => {
		setSelectedProduct(product);
		form.reset({
			name: product.name,
			name_ar: product.name_ar || "",
			description: product.description || "",
			description_ar: product.description_ar || "",
			price: product.price,
			original_price: product.original_price || null,
			stock_quantity: product.stock_quantity || 0,
			image: product.image,
			images: Array.isArray(product.images)
				? product.images
				: product.images
				? Object.values(product.images)
				: [],
			category_id: product.category_id,
			is_featured: product.is_featured || false,
			is_new: product.is_new || false,
			is_on_sale: product.is_on_sale || false,
		});
		setActiveTab("english");
		setIsAddEditDialogOpen(true);
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteProduct(id);
			setIsDeleteDialogOpen(false);
			setProductToDelete(null);

			toast({
				title: t("admin.deleteProduct"),
				description: t("admin.productDeleted"),
			});
		} catch (error) {
			console.error("Error deleting product:", error);
			toast({
				title: t("common.error"),
				description: t("admin.deleteProductError"),
				variant: "destructive",
			});
		}
	};

	const onSubmit = async (
		data: z.infer<typeof productSchema>,
	) => {
		try {
			if (selectedProduct) {
				const updatedData = {
					...data,
					images: Array.isArray(data.images)
						? data.images
						: [],
					category_id:
						data.category_id === "none"
							? null
							: data.category_id,
				};

				await updateProduct(
					selectedProduct.id,
					updatedData,
				);
				toast({
					title: t("admin.productUpdated"),
					description: t("admin.productUpdatedMessage"),
				});
			} else {
				await createProduct({
					name: data.name,
					name_ar: data.name_ar,
					description: data.description || "",
					description_ar: data.description_ar,
					price: data.price,
					original_price: data.original_price,
					stock_quantity: data.stock_quantity,
					image: data.image,
					images: data.images || [],
					category_id:
						data.category_id === "none"
							? null
							: data.category_id,
					is_featured: data.is_featured || false,
					is_new: data.is_new || false,
					is_on_sale: data.is_on_sale || false,
				});
				toast({
					title: t("admin.productCreated"),
					description: t("admin.productCreatedMessage"),
				});
			}
			setIsAddEditDialogOpen(false);
			form.reset();
			setSelectedProduct(null);
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
		}
	};

	const handleDeleteClick = (id: string) => {
		setProductToDelete(id);
		setIsDeleteDialogOpen(true);
	};

	const handleAddNewClick = () => {
		setSelectedProduct(null);
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
		setActiveTab("english");
		setIsAddEditDialogOpen(true);
	};

	const getCategoryName = (categoryId: string | null) => {
		if (!categoryId) return t("admin.uncategorized");
		const category = categories.find(
			(c) => c.id === categoryId,
		);
		return category?.name || t("admin.uncategorized");
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					{t("admin.products")}
				</h1>
				<p className="text-muted-foreground">
					{t("admin.manageProducts")}
				</p>
			</div>

			<div className="flex items-center justify-between">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder={t("admin.searchProducts")}
						className="pl-8"
						value={searchQuery}
						onChange={handleSearch}
					/>
				</div>

				<Button onClick={handleAddNewClick}>
					<Plus className="mr-2 h-4 w-4" />
					{t("admin.addProduct")}
				</Button>
			</div>

			<div className="rounded-md border shadow-sm bg-card">
				<div className="relative w-full overflow-auto">
					<Table>
						<TableHeader className="bg-muted/50">
							<TableRow>
								<TableHead className="text-start">
									{t("admin.product")}
								</TableHead>
								<TableHead className="text-start">
									{t("admin.category")}
								</TableHead>
								<TableHead className="text-start">
									{t("admin.status")}
								</TableHead>
								<TableHead className="text-start">
									{t("admin.price")}
								</TableHead>
								<TableHead className="text-start">
									{t("admin.created")}
								</TableHead>
								<TableHead className="text-right">
									{t("admin.actions")}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								Array.from({ length: 5 }).map(
									(_, index) => (
										<TableRow key={index}>
											<TableCell>
												<div className="flex items-center gap-3">
													<Skeleton className="h-10 w-10 rounded-md" />
													<div className="space-y-1">
														<Skeleton className="h-4 w-[150px]" />
														<Skeleton className="h-3 w-[120px]" />
													</div>
												</div>
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-[80px]" />
											</TableCell>
											<TableCell>
												<div className="flex flex-wrap gap-1">
													<Skeleton className="h-5 w-16 rounded-full" />
												</div>
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-[60px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-[80px]" />
											</TableCell>
											<TableCell className="text-right">
												<div className="flex items-center justify-end gap-2">
													<Skeleton className="h-8 w-8 rounded-md" />
													<Skeleton className="h-8 w-8 rounded-md" />
												</div>
											</TableCell>
										</TableRow>
									),
								)
							) : filteredProducts.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={6}
										className="h-24 text-center">
										{t("admin.noProductsFound")}
									</TableCell>
								</TableRow>
							) : (
								filteredProducts.map((product) => (
									<TableRow
										key={product.id}
										className="group hover:bg-muted/50">
										<TableCell>
											<div className="flex items-center gap-3">
												<div className="h-10 w-10 rounded-md overflow-hidden bg-background">
													{product.image ? (
														<img
															src={product.image}
															alt={product.name}
															className="h-full w-full object-cover"
															onError={(e) => {
																(
																	e.target as HTMLImageElement
																).src = "/placeholder.svg";
															}}
														/>
													) : (
														<div className="h-full w-full flex items-center justify-center bg-muted">
															<Image className="h-5 w-5 text-muted-foreground" />
														</div>
													)}
												</div>
												<div>
													<div className="font-medium">
														{product.name}
													</div>
													<div className="text-sm text-muted-foreground">
														{product.name_ar}
													</div>
												</div>
											</div>
										</TableCell>
										<TableCell>
											{getCategoryName(product.category_id)}
										</TableCell>
										<TableCell>
											<div className="flex flex-wrap gap-1">
												{product.is_featured && (
													<Badge variant="outline">
														{t("admin.featured")}
													</Badge>
												)}
												{product.is_new && (
													<Badge variant="outline">
														{t("admin.new")}
													</Badge>
												)}
												{product.is_on_sale && (
													<Badge variant="outline">
														{t("admin.onSale")}
													</Badge>
												)}
												{!product.is_featured &&
													!product.is_new &&
													!product.is_on_sale && (
														<span className="text-sm text-muted-foreground">
															-
														</span>
													)}
											</div>
										</TableCell>
										<TableCell>
											<div className="font-medium text-sm">
												{formatPrice(product.price)}
											</div>
											{product.original_price &&
												product.is_on_sale && (
													<div className="text-xs text-muted-foreground line-through">
														{formatPrice(
															product.original_price,
														)}
													</div>
												)}
										</TableCell>
										<TableCell>
											{formatDate(product.created_at)}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
												<Button
													variant="ghost"
													size="sm"
													onClick={() =>
														handleEdit(product)
													}>
													<Pencil className="h-4 w-4 mr-1" />
													{t("admin.edit")}
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="text-destructive hover:text-destructive"
													onClick={() =>
														handleDeleteClick(product.id)
													}>
													<Trash2 className="h-4 w-4 mr-1" />
													{t("admin.delete")}
												</Button>
											</div>

											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="sm"
														className="md:hidden">
														<MoreHorizontal className="h-4 w-4" />
														<span className="sr-only">
															{t("admin.actions")}
														</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem
														onClick={() =>
															handleEdit(product)
														}>
														<Pencil className="h-4 w-4 mr-2" />
														{t("admin.edit")}
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															handleDeleteClick(product.id)
														}
														className="text-destructive focus:text-destructive">
														<Trash2 className="h-4 w-4 mr-2" />
														{t("admin.delete")}
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			{/* Add/Edit Product Dialog */}
			<Dialog
				open={isAddEditDialogOpen}
				onOpenChange={setIsAddEditDialogOpen}>
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
																	form.setValue(
																		"images",
																		[],
																	);
																} else if (
																	urls.length > 0
																) {
																	form.setValue(
																		"image",
																		urls[0],
																	);
																	form.setValue(
																		"images",
																		urls.slice(1),
																	);
																} else {
																	form.setValue(
																		"image",
																		"",
																	);
																	form.setValue(
																		"images",
																		[],
																	);
																}
															}}
															onFilesAdded={async (
																files,
															) => {
																return await uploadMultipleFiles(
																	files,
																	"products",
																);
															}}
															multiple
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
																checked={
																	field.value || false
																}
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
																checked={
																	field.value || false
																}
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
																checked={
																	field.value || false
																}
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
									onClick={() =>
										setIsAddEditDialogOpen(false)
									}>
									{t("admin.cancel")}
								</Button>
								<Button
									type="submit"
									disabled={isSubmitting}>
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

			{/* Delete Product Dialog */}
			<Dialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>
							{t("admin.confirmDeleteTitle")}
						</DialogTitle>
						<DialogDescription>
							{t("admin.confirmDeleteDescription")}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsDeleteDialogOpen(false)}>
							{t("admin.cancel")}
						</Button>
						<Button
							variant="destructive"
							onClick={() =>
								productToDelete &&
								handleDelete(productToDelete)
							}
							disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t("common.loading")}
								</>
							) : (
								t("admin.delete")
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Products;
