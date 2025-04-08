import { useTranslation } from "react-i18next";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteCategoryDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	isSubmitting: boolean;
	onConfirm: () => void;
}

export const DeleteCategoryDialog = ({
	open,
	onOpenChange,
	isSubmitting,
	onConfirm,
}: DeleteCategoryDialogProps) => {
	const { t } = useTranslation();

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{t("admin.deleteCategoryTitle")}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{t("admin.deleteCategoryDescription")}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isSubmitting}>
						{t("common.cancel")}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						disabled={isSubmitting}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
						{isSubmitting
							? t("common.deleting")
							: t("common.delete")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
