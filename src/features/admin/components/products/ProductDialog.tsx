import { useTranslation } from "react-i18next";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
			<DialogContent className="p-0 w-[100vw] sm:max-w-3xl">
				<div className="p-6">
					<DialogHeader className="pb-4 !text-center">
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
					<ScrollArea className="sm:h-[70dvh] h-[calc(100dvh-110px)] pe-3">
						<ProductForm
							selectedProduct={selectedProduct}
							categories={categories}
							onOpenChange={onOpenChange}
						/>
					</ScrollArea>
				</div>
			</DialogContent>
		</Dialog>
	);
};
