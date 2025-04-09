import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	Share2,
	Trash2,
	ShoppingCart,
	Loader2,
} from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { FavoriteProduct } from "../types";

interface FavoritesActionBarProps {
	favoritesCount: number;
	showClearConfirm: boolean;
	setShowClearConfirm: (show: boolean) => void;
	isBulkMovingToCart: boolean;
	handleShareWishlist: () => Promise<void>;
	handleMoveAllToCart: () => void;
	clearAllFavorites: () => Promise<void>;
}

export const FavoritesActionBar = ({
	favoritesCount,
	showClearConfirm,
	setShowClearConfirm,
	isBulkMovingToCart,
	handleShareWishlist,
	handleMoveAllToCart,
	clearAllFavorites,
}: FavoritesActionBarProps) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
			<div>
				<h1 className="text-3xl font-bold mb-2">
					{t("favorites.title")}
				</h1>
				<p className="text-muted-foreground">
					{favoritesCount}{" "}
					{favoritesCount === 1
						? t("cart.item")
						: t("cart.items")}
				</p>
			</div>
			<div className="flex flex-wrap gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={handleShareWishlist}
					className="flex items-center">
					<Share2 className="mr-2 h-4 w-4" />
					{t("product.shareWishlist")}
				</Button>

				<Button
					variant="outline"
					size="sm"
					onClick={handleMoveAllToCart}
					disabled={
						isBulkMovingToCart || favoritesCount === 0
					}
					className="flex items-center">
					{isBulkMovingToCart ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<ShoppingCart className="mr-2 h-4 w-4" />
					)}
					{t("product.moveAllToCart")}
				</Button>

				<AlertDialog
					open={showClearConfirm}
					onOpenChange={setShowClearConfirm}>
					<AlertDialogTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="flex items-center">
							<Trash2 className="mr-2 h-4 w-4" />
							{t("favorites.removeAll")}
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{t("favorites.removeAll")}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{t("favorites.confirmRemoveAll")}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>
								{t("common.cancel")}
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={clearAllFavorites}
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
								{t("favorites.removeAll")}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
};
