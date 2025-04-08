import { useState } from "react";
import { useTranslation } from "react-i18next";
import useCategories from "../hooks/useCategories";
import { CategoryList } from "../components/categories/CategoryList";
import { CategoryHeader } from "../components/categories/CategoryHeader";
import { CategoryDialog } from "../components/categories/CategoryDialog";
import { DeleteCategoryDialog } from "../components/categories/DeleteCategoryDialog";
import { useToast } from "@/components/ui/use-toast";
import type { Category } from "../types";

// Define the form values type that matches what the hook expects
interface CategoryFormValues {
	name: string;
	description: string;
	image: string;
}

export const CategoriesView = () => {
	const { t } = useTranslation();
	const {
		categories,
		filteredCategories,
		isLoading,
		isSubmitting,
		searchQuery,
		selectedCategory,
		setSearchQuery,
		setSelectedCategory,
		createCategory,
		updateCategory,
		deleteCategory,
		formatDate,
	} = useCategories();

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
		useState(false);
	const [categoryToDelete, setCategoryToDelete] = useState<
		string | null
	>(null);
	const [isAddEditDialogOpen, setIsAddEditDialogOpen] =
		useState(false);
	const { toast } = useToast();

	const handleSearch = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		setSearchQuery(e.target.value);
	};

	const handleEdit = (category: Category) => {
		setSelectedCategory(category);
		setIsAddEditDialogOpen(true);
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteCategory(id);
			setIsDeleteDialogOpen(false);
			setCategoryToDelete(null);

			toast({
				title: t("admin.deleteCategory"),
				description: t("admin.categoryDeleted"),
			});
		} catch (error) {
			console.error("Error deleting category:", error);
			toast({
				title: t("common.error"),
				description: t("admin.deleteCategoryError"),
				variant: "destructive",
			});
		}
	};

	const handleDeleteClick = (id: string) => {
		setCategoryToDelete(id);
		setIsDeleteDialogOpen(true);
	};

	const handleAddNewClick = () => {
		setSelectedCategory(null);
		setIsAddEditDialogOpen(true);
	};

	return (
		<div className="space-y-6">
			<CategoryHeader
				onAddNewClick={handleAddNewClick}
				searchQuery={searchQuery}
				onSearch={handleSearch}
			/>

			<CategoryList
				categories={filteredCategories}
				isLoading={isLoading}
				onEdit={handleEdit}
				onDelete={handleDeleteClick}
				formatDate={formatDate}
			/>

			<CategoryDialog
				open={isAddEditDialogOpen}
				onOpenChange={setIsAddEditDialogOpen}
				selectedCategory={selectedCategory}
			/>

			<DeleteCategoryDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				isSubmitting={isSubmitting}
				onConfirm={() =>
					categoryToDelete && handleDelete(categoryToDelete)
				}
			/>
		</div>
	);
};
