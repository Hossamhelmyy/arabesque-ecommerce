import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import {
	categorySchema,
	CategoryFormValues,
} from "./category-form-schema";
import { useCategories } from "@/features/admin/hooks/useCategories";

interface CategoryFormProps {
	selectedCategory?: Category;
	onOpenChange: (open: boolean) => void;
	cancelButton?: React.ReactNode;
}

export function CategoryForm({
	selectedCategory,
	onOpenChange,
	cancelButton,
}: CategoryFormProps) {
	const { t } = useTranslation();
	const { createCategory, updateCategory, isSubmitting } =
		useCategories();
	const [loading, setLoading] = useState(false);
	const [images, setImages] = useState<string[]>(
		selectedCategory?.image ? [selectedCategory.image] : [],
	);

	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(categorySchema),
		defaultValues: selectedCategory
			? {
					name: selectedCategory.name || "",
					name_ar: selectedCategory.name_ar || "",
					description: selectedCategory.description || "",
					description_ar:
						selectedCategory.description_ar || "",
					image: selectedCategory.image || "",
			  }
			: {
					name: "",
					name_ar: "",
					description: "",
					description_ar: "",
					image: "",
			  },
		mode: "onChange",
	});

	const isValid = form.formState.isValid;
	const isDirty = form.formState.isDirty;

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

	const handleSubmit = async (
		values: CategoryFormValues,
	) => {
		try {
			setLoading(true);

			const imageUrl = images.length > 0 ? images[0] : "";
			const formData: CategoryFormValues = {
				...values,
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
	};

	return (
		<Form {...form}>
			<form
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
											rows={3}
											{...field}
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
											rows={3}
											{...field}
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

				<div className="flex justify-end space-x-2">
					{cancelButton}
					<Button
						type="submit"
						disabled={
							(!isDirty && !isValid) ||
							loading ||
							isSubmitting
						}>
						{(loading || isSubmitting) && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						{selectedCategory
							? t("common.update")
							: t("common.create")}
					</Button>
				</div>
			</form>
		</Form>
	);
}
