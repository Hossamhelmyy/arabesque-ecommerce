import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { uploadFile } from "@/utils/supabase-uploads";
import { Category } from "@/features/admin/types";
import {
	useCategories,
	CategoryFormValues,
} from "@/features/admin/hooks/useCategories";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";

const categorySchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	name_ar: z.string().min(2, {
		message: "Arabic name must be at least 2 characters.",
	}),
	description: z.string().optional(),
	description_ar: z.string().optional(),
	image: z.string().optional(),
});

type CategoryFormSchemaValues = z.infer<
	typeof categorySchema
>;

export interface CategoryDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	selectedCategory?: Category;
}

export function CategoryDialog({
	open,
	onOpenChange,
	selectedCategory,
}: CategoryDialogProps) {
	const { t } = useTranslation();
	const { createCategory, updateCategory } =
		useCategories();
	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("english");
	const [images, setImages] = useState<string[]>(
		selectedCategory?.image ? [selectedCategory.image] : [],
	);

	const form = useForm<CategoryFormSchemaValues>({
		resolver: zodResolver(categorySchema),
		defaultValues: {
			name: selectedCategory?.name || "",
			name_ar: selectedCategory?.name_ar || "",
			description: selectedCategory?.description || "",
			description_ar:
				selectedCategory?.description_ar || "",
			image: selectedCategory?.image || "",
		},
	});

	useEffect(() => {
		if (selectedCategory) {
			form.reset({
				name: selectedCategory.name || "",
				name_ar: selectedCategory.name_ar || "",
				description: selectedCategory.description || "",
				description_ar:
					selectedCategory.description_ar || "",
				image: selectedCategory.image || "",
			});
			setImages(
				selectedCategory.image
					? [selectedCategory.image]
					: [],
			);
		} else {
			form.reset({
				name: "",
				name_ar: "",
				description: "",
				description_ar: "",
				image: "",
			});
			setImages([]);
		}
	}, [selectedCategory, form]);

	async function onSubmit(
		values: CategoryFormSchemaValues,
	) {
		try {
			setLoading(true);

			const imageUrl = images.length > 0 ? images[0] : "";
			const formData: CategoryFormValues = {
				name: values.name,
				name_ar: values.name_ar,
				description: values.description || "",
				description_ar: values.description_ar || "",
				image: imageUrl,
			};

			if (selectedCategory) {
				await updateCategory(selectedCategory.id, formData);
				toast({
					title: t("admin.categoryUpdated"),
					description: t("admin.categoryUpdatedDesc"),
				});
			} else {
				await createCategory(formData);
				toast({
					title: t("admin.categoryCreated"),
					description: t("admin.categoryCreatedDesc"),
				});
			}
			onOpenChange(false);
		} catch (error) {
			console.error("Error saving category:", error);
			toast({
				title: t("common.error"),
				description: t("admin.categoryErrorDesc"),
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	}

	const handleFilesAdded = async (
		files: File[],
	): Promise<string[]> => {
		try {
			const urls: string[] = [];
			if (files.length > 0) {
				const url = await uploadFile(
					files[0],
					"categories",
				);
				urls.push(url);
			}
			return urls;
		} catch (error) {
			console.error("Error uploading file:", error);
			toast({
				title: t("common.uploadError"),
				description: t("common.uploadErrorDesc"),
				variant: "destructive",
			});
			return [];
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>
						{selectedCategory
							? t("admin.editCategory")
							: t("admin.addCategory")}
					</DialogTitle>
					<DialogDescription>
						{selectedCategory
							? t("admin.editCategoryDesc")
							: t("admin.addCategoryDesc")}
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
													rows={3}
													{...field}
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
													rows={3}
													{...field}
													dir="rtl"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</TabsContent>
						</Tabs>

						<FormField
							control={form.control}
							name="image"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("common.image")}</FormLabel>
									<FormControl>
										<FileUpload
											value={images}
											onChange={(urls) => {
												setImages(urls);
												field.onChange(urls[0] || "");
											}}
											onFilesAdded={handleFilesAdded}
											maxFiles={1}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter className="flex space-x-2 rtl:space-x-reverse">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}>
								{t("common.cancel")}
							</Button>
							<Button type="submit" disabled={loading}>
								{loading ? (
									<>
										<Loader2 className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4 animate-spin" />
										{selectedCategory
											? t("common.updating")
											: t("common.creating")}
									</>
								) : selectedCategory ? (
									t("common.update")
								) : (
									t("common.create")
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
