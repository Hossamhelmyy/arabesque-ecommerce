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
	FormDescription,
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

const categorySchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	image: z.string().optional(),
	slug: z.string().optional(),
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
	const [images, setImages] = useState<string[]>(
		selectedCategory?.image ? [selectedCategory.image] : [],
	);

	const form = useForm<CategoryFormSchemaValues>({
		resolver: zodResolver(categorySchema),
		defaultValues: {
			name: selectedCategory?.name || "",
			description: selectedCategory?.description || "",
			slug: selectedCategory?.slug || "",
			image: selectedCategory?.image || "",
		},
	});

	useEffect(() => {
		if (selectedCategory) {
			form.reset({
				name: selectedCategory.name || "",
				description: selectedCategory.description || "",
				slug: selectedCategory.slug || "",
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
				description: "",
				slug: "",
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
				description: values.description || "",
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
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("common.name")}</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="slug"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("common.slug")}</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription>
										{t("common.slugDescription")}
									</FormDescription>
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
										{t("common.description")}
									</FormLabel>
									<FormControl>
										<Textarea rows={3} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}>
								{t("common.cancel")}
							</Button>
							<Button type="submit" disabled={loading}>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
