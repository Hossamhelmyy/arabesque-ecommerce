import { useTranslation } from "react-i18next";
import { useFavorites } from "@/features/favorites/hooks";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
	FavoritesActionBar,
	FavoritesGrid,
	FavoritesEmptyState,
	AuthRequiredState,
	FavoritesGridSkeleton,
} from "@/features/favorites/components";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

const FavoritesPage = () => {
	const { t } = useTranslation();
	const { user } = useAuth();

	const {
		favorites,
		isLoading,
		error,
		groupedFavorites,
		highlightedProductId,
		showClearConfirm,
		setShowClearConfirm,
		isBulkMovingToCart,
		handleAddToCart,
		handleRemoveFromFavorites,
		handleMoveAllToCart,
		handleShareWishlist,
		clearAllFavorites,
		formatDate,
	} = useFavorites();

	// Define breadcrumb items
	const breadcrumbItems = [
		{
			href: "/favorites",
			translationKey: "favorites.title",
		},
	];

	// Not logged in state
	if (!user) {
		return (
			<div className="container py-12">
				<Breadcrumbs
					items={breadcrumbItems}
					className="mb-6"
				/>
				<AuthRequiredState />
			</div>
		);
	}

	// Loading state
	if (isLoading) {
		return (
			<div className="container py-12">
				<Breadcrumbs
					items={breadcrumbItems}
					className="mb-6"
				/>
				<FavoritesActionBar
					favoritesCount={0}
					showClearConfirm={false}
					setShowClearConfirm={setShowClearConfirm}
					isBulkMovingToCart={false}
					handleShareWishlist={handleShareWishlist}
					handleMoveAllToCart={handleMoveAllToCart}
					clearAllFavorites={clearAllFavorites}
				/>
				<FavoritesGridSkeleton />
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="container py-16 flex flex-col items-center justify-center">
				<div className="text-destructive mb-4">
					<span className="sr-only">
						{t("common.error")}
					</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-8 w-8 mx-auto">
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
				</div>
				<p className="text-muted-foreground">
					{t("common.error")}
				</p>
				<Button
					variant="outline"
					className="mt-4"
					onClick={() => window.location.reload()}>
					{t("common.retry")}
				</Button>
			</div>
		);
	}

	// Empty state
	if (
		!isLoading &&
		(!favorites || favorites.length === 0)
	) {
		return (
			<div className="container py-12">
				<Breadcrumbs
					items={breadcrumbItems}
					className="mb-6"
				/>
				<FavoritesEmptyState />
			</div>
		);
	}

	return (
		<div className="container py-8 md:py-12">
			<Breadcrumbs
				items={breadcrumbItems}
				className="mb-6"
			/>

			<FavoritesActionBar
				favoritesCount={favorites?.length || 0}
				showClearConfirm={showClearConfirm}
				setShowClearConfirm={setShowClearConfirm}
				isBulkMovingToCart={isBulkMovingToCart}
				handleShareWishlist={handleShareWishlist}
				handleMoveAllToCart={handleMoveAllToCart}
				clearAllFavorites={clearAllFavorites}
			/>

			<FavoritesGrid
				groupedFavorites={groupedFavorites}
				isLoading={isLoading}
				highlightedProductId={highlightedProductId}
				handleAddToCart={handleAddToCart}
				handleRemoveFromFavorites={
					handleRemoveFromFavorites
				}
				formatDate={formatDate}
			/>
		</div>
	);
};

export default FavoritesPage;
