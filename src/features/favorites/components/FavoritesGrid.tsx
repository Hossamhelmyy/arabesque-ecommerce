import { useTranslation } from "react-i18next";
import {
	ProductCard,
	ProductCardSkeleton,
} from "@/components/product";
import type {
	FavoriteProduct,
	GroupedFavorites,
} from "../types";

interface FavoritesGridProps {
	groupedFavorites: GroupedFavorites;
	isLoading: boolean;
	highlightedProductId: string | null;
	handleAddToCart: (
		product: FavoriteProduct["products"],
	) => void;
	handleRemoveFromFavorites: (favoriteId: string) => void;
	formatDate: (dateString: string) => string;
}

export const FavoritesGrid = ({
	groupedFavorites,
	isLoading,
	highlightedProductId,
	handleAddToCart,
	handleRemoveFromFavorites,
	formatDate,
}: FavoritesGridProps) => {
	const { t } = useTranslation();

	// Loading state
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{[...Array(8)].map((_, index) => (
					<ProductCardSkeleton key={index} />
				))}
			</div>
		);
	}

	return (
		<>
			{Object.entries(groupedFavorites).map(
				([dateKey, items]) => (
					<div key={dateKey} className="mb-10">
						<h3 className="text-sm font-medium text-muted-foreground mb-4">
							{formatDate(dateKey)}
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{items.map((favorite) => {
								const product = favorite.products;
								const isHighlighted =
									highlightedProductId === product.id;

								return (
									<ProductCard
										key={favorite.id}
										product={product}
										onAddToCart={() =>
											handleAddToCart(product)
										}
										onAddToWishlist={() =>
											handleRemoveFromFavorites(favorite.id)
										}
										isInWishlist={true}
										className={`relative transition-all duration-500 ${
											isHighlighted
												? "ring-4 ring-primary ring-opacity-70 scale-105 animate-heartbeat"
												: ""
										}`}
									/>
								);
							})}
						</div>
					</div>
				),
			)}
		</>
	);
};
