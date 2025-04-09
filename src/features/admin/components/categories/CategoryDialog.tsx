import { useTranslation } from "react-i18next";
import {
	Dialog,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogContent,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
			<DialogContent className="p-0 w-[100vw] sm:max-w-[600px]">
				<div className="p-6">
					<DialogHeader className="pb-4 !text-center">
						{" "}
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
					<ScrollArea className="sm:h-[50dvh] h-[calc(100dvh-110px)] pe-3">
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
					</ScrollArea>
				</div>
			</DialogContent>
		</Dialog>
	);
}
