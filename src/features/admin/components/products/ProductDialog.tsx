import { useTranslation } from "react-i18next";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Product, Category } from "../../types";
import { ProductForm } from "./ProductForm";

interface ProductDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	selectedProduct: Product | null;
	categories: Category[];
}

export const ProductDialog = ({
	open,
	onOpenChange,
	selectedProduct,
	categories,
}: ProductDialogProps) => {
	const { t } = useTranslation();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
				<DialogHeader>
					<DialogTitle>
						{selectedProduct
							? t("admin.editProductTitle")
							: t("admin.addNewProduct")}
					</DialogTitle>
					<DialogDescription>
						{selectedProduct
							? t("admin.editProductDescription")
							: t("admin.addProductDescription")}
					</DialogDescription>
				</DialogHeader>

				<ProductForm
					selectedProduct={selectedProduct}
					categories={categories}
					onOpenChange={onOpenChange}
				/>
			</DialogContent>
		</Dialog>
	);
};
