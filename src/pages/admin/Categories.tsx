import { useState } from "react";
import {
	PlusCircle,
	Edit,
	Trash2,
	Loader2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import useCategories from "@/features/admin/hooks/useCategories";
import type { Category } from "@/features/admin/types";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Search,
	Plus,
	Pencil,
	MoreHorizontal,
	Image,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { generateSlug } from "@/utils/string";
import { FileUpload } from "@/components/ui/file-upload";
import { uploadFile } from "@/utils/supabase-uploads";

// Category form schema
const categoryFormSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	slug: z.string().optional(),
	description: z.string().optional(),
	image_url: z.string().optional(),
	parent_id: z.string().optional().nullable(),
	name_ar: z.string().optional(),
	description_ar: z.string().optional(),
});

type CategoryFormValues = z.infer<
	typeof categoryFormSchema
>;

const Categories = () => {
	const { t } = useTranslation();
	const { toast } = useToast();
	const [isAddDialogOpen, setIsAddDialogOpen] =
		useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] =
		useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
		useState(false);
	const [categoryToDelete, setCategoryToDelete] =
		useState<Category | null>(null);
	const [activeTab, setActiveTab] = useState("english");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		categories,
		filteredCategories,
		isLoading,
		selectedCategory,
		setSelectedCategory,
		createCategory,
		updateCategory,
		deleteCategory,
		error,
		searchQuery,
		setSearchQuery,
		formatDate,
	} = useCategories();

	// Create form
	const createForm = useForm<CategoryFormValues>({
		resolver: zodResolver(categoryFormSchema),
		defaultValues: {
			name: "",
			slug: "",
			description: "",
			image_url: "",
			parent_id: null,
			name_ar: "",
			description_ar: "",
		},
	});

	// Edit form
	const editForm = useForm<CategoryFormValues>({
		resolver: zodResolver(categoryFormSchema),
		defaultValues: {
			name: "",
			slug: "",
			description: "",
			image_url: "",
			parent_id: null,
			name_ar: "",
			description_ar: "",
		},
	});

	// Reset form and close dialog
	const resetCreateForm = () => {
		createForm.reset();
		setIsAddDialogOpen(false);
	};

	// Reset edit form and close dialog
	const resetEditForm = () => {
		editForm.reset();
		setIsEditDialogOpen(false);
	};

	// Handle category creation
	const onCreateSubmit = async (
		data: CategoryFormValues,
	) => {
		try {
			setIsSubmitting(true);

			// Generate slug if not provided
			const slug = data.slug || generateSlug(data.name);

			// Convert "none" to null for parent_id
			const categoryData = {
				name: data.name,
				slug: slug,
				description: data.description || "",
				image_url: data.image_url || "",
				parent_id:
					data.parent_id === "none" ? null : data.parent_id,
				name_ar: data.name_ar || "",
				description_ar: data.description_ar || "",
			};

			await createCategory(categoryData);

			toast({
				description: t("admin.categoryCreatedMessage"),
			});

			setIsAddDialogOpen(false);
			resetCreateForm();
		} catch (error) {
			console.error("Error creating category:", error);
			toast({
				variant: "destructive",
				description: t("admin.categorySaveError"),
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handle category update
	const onEditSubmit = async (data: CategoryFormValues) => {
		try {
			if (!selectedCategory) return;

			setIsSubmitting(true);

			// Generate slug if not provided
			const slug = data.slug || generateSlug(data.name);

			// Convert "none" to null for parent_id
			const categoryData = {
				name: data.name,
				slug: slug,
				description: data.description || "",
				image_url: data.image_url || "",
				parent_id:
					data.parent_id === "none" ? null : data.parent_id,
				name_ar: data.name_ar || "",
				description_ar: data.description_ar || "",
			};

			await updateCategory(
				selectedCategory.id,
				categoryData,
			);

			toast({
				description: t("admin.categoryUpdatedMessage"),
			});

			setIsEditDialogOpen(false);
			resetEditForm();
		} catch (error) {
			console.error("Error updating category:", error);
			toast({
				variant: "destructive",
				description: t("admin.categorySaveError"),
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handle category deletion
	const handleDeleteCategory = async () => {
		if (!categoryToDelete) return;

		try {
			await deleteCategory(categoryToDelete.id);
			setCategoryToDelete(null);
			setIsDeleteDialogOpen(false);
		} catch (error) {
			console.error("Error deleting category:", error);
		}
	};

	// Open edit dialog with category data
	const handleEditCategory = (category: Category) => {
		setSelectedCategory(category);
		editForm.reset({
			name: category.name,
			name_ar: category.name_ar || "",
			slug: category.slug,
			description: category.description || "",
			description_ar: category.description_ar || "",
			image_url: category.image_url || "",
			parent_id: category.parent_id || "none",
		});
		setActiveTab("english");
		setIsEditDialogOpen(true);
	};

	// Open delete dialog
	const handleConfirmDelete = (category: Category) => {
		setCategoryToDelete(category);
		setIsDeleteDialogOpen(true);
	};

	// Get parent category name
	const getParentCategoryName = (parentId?: string) => {
		if (!parentId) return t("admin.noParentCategory");
		const parent = categories.find(
			(c) => c.id === parentId,
		);
		return parent
			? parent.name
			: t("admin.noParentCategory");
	};

	const handleSearch = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		setSearchQuery(e.target.value);
	};

	const handleAddNewClick = () => {
		setSelectedCategory(null);
		createForm.reset();
		setActiveTab("english");
		setIsAddDialogOpen(true);
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					{t("admin.categories")}
				</h1>
				<p className="text-muted-foreground">
					{t("admin.manageCategories")}
				</p>
			</div>

			<div className="flex items-center justify-between">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder={t("admin.searchCategories")}
						className="pl-8"
						value={searchQuery}
						onChange={handleSearch}
					/>
				</div>

				<Button onClick={handleAddNewClick}>
					<Plus className="mr-2 h-4 w-4" />
					{t("admin.addCategory")}
				</Button>
			</div>

			<div className="rounded-md border shadow-sm bg-card">
				<div className="relative w-full overflow-auto">
					<Table>
						<TableHeader className="bg-muted/50">
							<TableRow>
								<TableHead className="text-start">
									{t("admin.category")}
								</TableHead>
								<TableHead className="text-start">
									{t("admin.parentCategory")}
								</TableHead>
								<TableHead className="text-start">
									{t("admin.productsCount")}
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
												<Skeleton className="h-4 w-[100px]" />
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
							) : filteredCategories.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={5}
										className="h-24 text-center">
										{t("admin.noCategoriesFound")}
									</TableCell>
								</TableRow>
							) : (
								filteredCategories.map((category) => (
									<TableRow
										key={category.id}
										className="group hover:bg-muted/50">
										<TableCell>
											<div className="flex items-center gap-3">
												{category.image_url ? (
													<div className="h-10 w-10 rounded-md overflow-hidden bg-background">
														<img
															src={category.image_url}
															alt={category.name}
															className="h-full w-full object-cover"
															onError={(e) => {
																(
																	e.target as HTMLImageElement
																).src = "/placeholder.svg";
															}}
														/>
													</div>
												) : (
													<div className="h-10 w-10 rounded-md flex items-center justify-center bg-muted">
														<Image className="h-5 w-5 text-muted-foreground" />
													</div>
												)}
												<div>
													<div className="font-medium">
														{category.name}
													</div>
													<div className="text-sm text-muted-foreground">
														{category.name_ar ||
															category.slug}
													</div>
												</div>
											</div>
										</TableCell>
										<TableCell>
											{getParentCategoryName(
												category.parent_id,
											)}
										</TableCell>
										<TableCell>
											<Badge variant="outline">
												{category.products_count || 0}
											</Badge>
										</TableCell>
										<TableCell>
											{formatDate(category.created_at)}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
												<Button
													variant="ghost"
													size="sm"
													onClick={() =>
														handleEditCategory(category)
													}>
													<Pencil className="h-4 w-4 mr-1" />
													{t("admin.edit")}
												</Button>
												<Button
													variant="ghost"
													size="sm"
													className="text-destructive hover:text-destructive"
													onClick={() =>
														handleConfirmDelete(category)
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
															handleEditCategory(category)
														}>
														<Pencil className="h-4 w-4 mr-2" />
														{t("admin.edit")}
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															handleConfirmDelete(category)
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

			{/* Add Category Dialog */}
			<Dialog
				open={isAddDialogOpen}
				onOpenChange={setIsAddDialogOpen}>
				<DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
					<DialogHeader className="space-y-2">
						<DialogTitle className="text-2xl">
							{t("admin.addCategoryTitle")}
						</DialogTitle>
						<DialogDescription className="text-muted-foreground text-base">
							{t("admin.addCategoryDescription")}
						</DialogDescription>
					</DialogHeader>

					<div className="my-2 border-t pt-4"></div>

					<Form {...createForm}>
						<form
							onSubmit={createForm.handleSubmit(
								onCreateSubmit,
							)}
							className="space-y-6">
							<Tabs
								value={activeTab}
								onValueChange={setActiveTab}
								className="w-full">
								<TabsList className="grid w-full grid-cols-2 mb-4">
									<TabsTrigger
										value="english"
										className="rounded-md py-2">
										<div className="flex items-center">
											<span className="text-sm font-medium">
												{t("admin.englishDetails")}
											</span>
										</div>
									</TabsTrigger>
									<TabsTrigger
										value="arabic"
										className="rounded-md py-2">
										<div className="flex items-center">
											<span className="text-sm font-medium">
												{t("admin.arabicDetails")}
											</span>
										</div>
									</TabsTrigger>
								</TabsList>

								<TabsContent
									value="english"
									className="space-y-5 pt-4 bg-card rounded-md p-4 shadow-sm">
									<FormField
										control={createForm.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-base font-medium">
													{t("admin.name")}{" "}
													<span className="text-sm">
														({t("common.english")})
													</span>
												</FormLabel>
												<FormControl>
													<Input
														placeholder={t(
															"admin.inputNamePlaceholder",
														)}
														{...field}
														className="h-10"
													/>
												</FormControl>
												<FormDescription className="text-xs">
													{t("admin.nameDescription")}
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={createForm.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-base font-medium">
													{t("admin.description")}{" "}
													<span className="text-sm">
														({t("common.english")})
													</span>
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder={t(
															"admin.categoryDescription",
														)}
														{...field}
														rows={5}
														className="min-h-[100px] resize-y"
													/>
												</FormControl>
												<FormDescription className="text-xs">
													{t("admin.descriptionHint")}
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</TabsContent>

								<TabsContent
									value="arabic"
									className="space-y-5 pt-4 bg-card rounded-md p-4 shadow-sm">
									<FormField
										control={createForm.control}
										name="name_ar"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-base font-medium">
													{t("admin.name")}{" "}
													<span className="text-sm">
														({t("common.arabic")})
													</span>
												</FormLabel>
												<FormControl>
													<Input
														placeholder={t(
															"admin.inputNamePlaceholder",
														)}
														{...field}
														dir="rtl"
														className="h-10 text-right"
													/>
												</FormControl>
												<FormDescription className="text-xs">
													{t("admin.arabicNameDescription")}
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={createForm.control}
										name="description_ar"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-base font-medium">
													{t("admin.description")}{" "}
													<span className="text-sm">
														({t("common.arabic")})
													</span>
												</FormLabel>
												<FormControl>
													<Textarea
														placeholder={t(
															"admin.categoryDescription",
														)}
														{...field}
														rows={5}
														dir="rtl"
														className="min-h-[100px] resize-y text-right"
													/>
												</FormControl>
												<FormDescription className="text-xs">
													{t("admin.arabicDescriptionHint")}
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</TabsContent>
							</Tabs>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 bg-muted/25 p-4 rounded-md">
								<FormField
									control={createForm.control}
									name="image_url"
									render={({ field }) => (
										<FormItem className="space-y-3">
											<FormLabel className="text-base font-medium">
												{t("admin.image")}
											</FormLabel>
											<FormControl>
												<FileUpload
													value={field.value || ""}
													onChange={field.onChange}
													onFilesAdded={async (files) => {
														const file = files[0];
														const uploadedUrl =
															await uploadFile(
																file,
																"categories",
															);
														return [uploadedUrl];
													}}
												/>
											</FormControl>
											<FormDescription className="text-xs">
												{t("admin.imageUrlDescription")}
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={createForm.control}
									name="parent_id"
									render={({ field }) => (
										<FormItem className="space-y-3">
											<FormLabel className="text-base font-medium">
												{t("admin.parentCategory")}
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value || undefined}>
												<FormControl>
													<SelectTrigger className="h-10">
														<SelectValue
															placeholder={t(
																"admin.selectParentCategory",
															)}
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="none">
														{t("admin.noParentCategory")}
													</SelectItem>
													{categories
														.filter(
															(cat) =>
																!selectedCategory ||
																cat.id !==
																	selectedCategory.id,
														)
														.map((category) => (
															<SelectItem
																key={category.id}
																value={category.id}>
																{category.name}
															</SelectItem>
														))}
												</SelectContent>
											</Select>
											<FormDescription className="text-xs">
												{t(
													"admin.parentCategoryDescription",
												)}
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="border-t pt-4 mt-6"></div>

							<DialogFooter className="gap-2 sm:gap-0">
								<Button
									type="button"
									variant="outline"
									onClick={resetCreateForm}
									className="mt-2 sm:mt-0">
									{t("admin.cancel")}
								</Button>
								<Button
									type="submit"
									disabled={isSubmitting}
									className="relative mt-2 sm:mt-0">
									{isSubmitting && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{t("admin.addCategory")}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			{/* Edit Category Dialog */}
			<Dialog
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}>
				<DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
					<DialogHeader>
						<DialogTitle>
							{t("admin.editCategoryTitle")}
						</DialogTitle>
						<DialogDescription>
							{t("admin.editCategoryDescription")}
						</DialogDescription>
					</DialogHeader>

					<Form {...editForm}>
						<form
							onSubmit={editForm.handleSubmit(onEditSubmit)}
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
									<FormField
										control={editForm.control}
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
										control={editForm.control}
										name="slug"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{t("admin.slug")}
												</FormLabel>
												<FormControl>
													<Input
														placeholder="category-slug"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													{t("admin.slugInfo")}
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={editForm.control}
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
															"admin.categoryDescription",
														)}
														{...field}
														rows={5}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</TabsContent>

								<TabsContent
									value="arabic"
									className="space-y-4 pt-4">
									<FormField
										control={editForm.control}
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
										control={editForm.control}
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
															"admin.categoryDescription",
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
								<FormField
									control={editForm.control}
									name="image_url"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{t("admin.image")}
											</FormLabel>
											<FormControl>
												<FileUpload
													value={field.value || ""}
													onChange={field.onChange}
													onFilesAdded={async (files) => {
														const file = files[0];
														const uploadedUrl =
															await uploadFile(
																file,
																"categories",
															);
														return [uploadedUrl];
													}}
												/>
											</FormControl>
											<FormDescription className="text-xs">
												{t("admin.imageUrlDescription")}
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={editForm.control}
									name="parent_id"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{t("admin.parentCategory")}
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value || undefined}>
												<FormControl>
													<SelectTrigger>
														<SelectValue
															placeholder={t(
																"admin.selectParentCategory",
															)}
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="none">
														{t("admin.noParentCategory")}
													</SelectItem>
													{categories
														.filter(
															(cat) =>
																!selectedCategory ||
																cat.id !==
																	selectedCategory.id,
														)
														.map((category) => (
															<SelectItem
																key={category.id}
																value={category.id}>
																{category.name}
															</SelectItem>
														))}
												</SelectContent>
											</Select>
											<FormDescription>
												{t("admin.selectParentCategory")}
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={resetEditForm}>
									{t("admin.cancel")}
								</Button>
								<Button
									type="submit"
									disabled={isSubmitting}>
									{isSubmitting && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{t("admin.saveChanges")}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			{/* Delete Category Dialog */}
			<Dialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>
							{t("admin.confirmDeleteCategoryTitle")}
						</DialogTitle>
						<DialogDescription>
							{t("admin.confirmDeleteCategoryDescription")}
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
							onClick={handleDeleteCategory}
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

export default Categories;
