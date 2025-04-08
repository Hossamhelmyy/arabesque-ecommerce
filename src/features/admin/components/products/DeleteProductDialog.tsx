import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DeleteProductDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	isSubmitting: boolean;
}

export const DeleteProductDialog = ({
	open,
	onOpenChange,
	onConfirm,
	isSubmitting,
}: DeleteProductDialogProps) => {
	const { t } = useTranslation();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
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
						onClick={() => onOpenChange(false)}>
						{t("admin.cancel")}
					</Button>
					<Button
						variant="destructive"
						onClick={onConfirm}
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
	);
};
