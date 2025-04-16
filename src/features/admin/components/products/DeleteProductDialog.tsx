import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/context/LanguageContext";
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
	const { isRTL } = useLanguage();
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				dir={isRTL ? "rtl" : "ltr"}
				className="max-w-md">
				<DialogHeader dir={isRTL ? "rtl" : "ltr"}>
					<DialogTitle
						className="text-start"
						dir={isRTL ? "rtl" : "ltr"}>
						{t("admin.confirmDeleteTitle")}
					</DialogTitle>
					<DialogDescription className="text-start">
						{t("admin.confirmDeleteDescription")}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}>
						{t("admin.cancel")}
					</Button>
					<Button
						variant="destructive"
						className=""
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
