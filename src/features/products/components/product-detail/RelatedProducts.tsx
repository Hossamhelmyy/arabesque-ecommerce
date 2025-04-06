import React from "react";
import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/product";
import type { Product } from "@/features/products/types";
import { useWishlistContext } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

interface RelatedProductsProps {
	products: Product[];
	currentProductId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
	products,
	currentProductId,
}) => {
	const { t } = useTranslation();
	const { addToCart } = useCart();
	const {
		addToWishlist,
		removeFromWishlist,
		isInWishlist,
	} = useWishlistContext();

	// Filter out the current product just in case it's in the list
	const filteredProducts = products.filter(
		(p) => p.id !== currentProductId,
	);

	if (filteredProducts.length === 0) {
		return null;
	}

	const handleAddToCart = (product: Product) => {
		addToCart({
			product_id: product.id,
			quantity: 1,
			name: product.name,
			name_ar: product.name_ar,
			price: product.price,
			image: product.image,
		});
	};

	const handleAddToWishlist = (product: Product) => {
		if (isInWishlist(product.id)) {
			removeFromWishlist(product.id);
		} else {
			addToWishlist(product.id);
		}
	};

	return (
		<div className="mt-12">
			<h2 className="text-xl font-bold mb-6">
				{t("product.relatedProducts")}
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{filteredProducts.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						isInWishlist={isInWishlist(product.id)}
						onAddToCart={() => handleAddToCart(product)}
						onAddToWishlist={() =>
							handleAddToWishlist(product)
						}
					/>
				))}
			</div>
		</div>
	);
};

export default RelatedProducts;
