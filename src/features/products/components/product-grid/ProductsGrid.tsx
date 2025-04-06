import { ProductCard } from "@/components/product";
import { Product } from "../../types";

interface ProductsGridProps {
	products: Product[];
	handleAddToCart: (product: Product) => void;
	handleAddToWishlist: (product: Product) => void;
	wishlistItems: { product_id: string }[] | null;
}

const ProductsGrid = ({
	products,
	handleAddToCart,
	handleAddToWishlist,
	wishlistItems,
}: ProductsGridProps) => {
	const wishlistProductIds = new Set(
		wishlistItems?.map((item) => item.product_id) || [],
	);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{products.map((product) => (
				<ProductCard
					key={product.id}
					product={product}
					onAddToCart={() => handleAddToCart(product)}
					onAddToWishlist={() =>
						handleAddToWishlist(product)
					}
					isInWishlist={wishlistProductIds.has(product.id)}
				/>
			))}
		</div>
	);
};

export default ProductsGrid;
