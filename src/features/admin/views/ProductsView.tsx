import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useProducts } from "../hooks/useProducts";
import { ProductList } from "../components/products/ProductList";
import { ProductHeader } from "../components/products/ProductHeader";
import { ProductDialog } from "../components/products/ProductDialog";
import { DeleteProductDialog } from "../components/products/DeleteProductDialog";
import { useToast } from "@/components/ui/use-toast";
import type { Product } from "../types";

export const ProductsView = () => {
	const { t } = useTranslation();
	const {
		products,
		categories,
		filteredProducts,
		isLoading,
		isSubmitting,
		searchQuery,
		selectedProduct,
		setSearchQuery,
		setSelectedProduct,
		deleteProduct,
		formatDate,
		formatPrice,
	} = useProducts();

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
		useState(false);
	const [productToDelete, setProductToDelete] = useState<
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

	const handleEdit = (product: Product) => {
		setSelectedProduct(product);
		setIsAddEditDialogOpen(true);
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteProduct(id);
			setIsDeleteDialogOpen(false);
			setProductToDelete(null);

			toast({
				title: t("admin.deleteProduct"),
				description: t("admin.productDeleted"),
			});
		} catch (error) {
			console.error("Error deleting product:", error);
			toast({
				title: t("common.error"),
				description: t("admin.deleteProductError"),
				variant: "destructive",
			});
		}
	};

	const handleDeleteClick = (id: string) => {
		setProductToDelete(id);
		setIsDeleteDialogOpen(true);
	};

	const handleAddNewClick = () => {
		setSelectedProduct(null);
		setIsAddEditDialogOpen(true);
	};

	return (
		<div className="space-y-6">
			<ProductHeader
				onAddNewClick={handleAddNewClick}
				searchQuery={searchQuery}
				onSearch={handleSearch}
			/>

			<ProductList
				products={filteredProducts}
				isLoading={isLoading}
				categories={categories}
				onEdit={handleEdit}
				onDelete={handleDeleteClick}
				formatDate={formatDate}
				formatPrice={formatPrice}
			/>

			<ProductDialog
				open={isAddEditDialogOpen}
				onOpenChange={setIsAddEditDialogOpen}
				selectedProduct={selectedProduct}
				categories={categories}
			/>

			<DeleteProductDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
				isSubmitting={isSubmitting}
				onConfirm={() =>
					productToDelete && handleDelete(productToDelete)
				}
			/>
		</div>
	);
};
