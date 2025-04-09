import { ProductCard } from "@/components/product";
import { type Product } from "@/features/products/types";

export interface ProductsGridProps {
	products: Product[];
	onAddToCart: (product: Product) => void;
	onAddToWishlist: (product: Product) => void;
	isInWishlist: (productId: string) => boolean;
}

export const ProductsGrid = ({
	products,
	onAddToCart,
	onAddToWishlist,
	isInWishlist,
}: ProductsGridProps) => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{products.map((product) => (
				<ProductCard
					key={product.id}
					product={product}
					onAddToCart={() => onAddToCart(product)}
					onAddToWishlist={() => onAddToWishlist(product)}
					isInWishlist={isInWishlist(product.id)}
				/>
			))}
		</div>
	);
};
