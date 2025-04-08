import { useTranslation } from "react-i18next";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Category } from "@/features/admin/types";
import { CategoryForm } from "./CategoryForm";

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

				<CategoryForm
					selectedCategory={selectedCategory}
					onOpenChange={onOpenChange}
					cancelButton={
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}>
							{t("common.cancel")}
						</Button>
					}
				/>
			</DialogContent>
		</Dialog>
	);
}
