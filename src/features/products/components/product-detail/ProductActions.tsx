import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Heart,
	Share2,
	ShoppingCart,
	Minus,
	Plus,
	Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useWishlistContext } from "@/context/WishlistContext";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/features/products/types";

// Extend the Product type locally for stock_quantity if needed
interface ProductWithStock extends Product {
	stock_quantity?: number;
}

interface ProductActionsProps {
	product: ProductWithStock;
}

const ProductActions: React.FC<ProductActionsProps> = ({
	product,
}) => {
	const { t } = useTranslation();
	const { addToCart } = useCart();
	const { user } = useAuth();
	const {
		addToWishlist,
		removeFromWishlist,
		isInWishlist,
	} = useWishlistContext();
	const navigate = useNavigate();
	const [quantity, setQuantity] = useState(1);
	const [addedToCart, setAddedToCart] = useState(false);

	const isProductInWishlist = isInWishlist(product.id);

	const handleQuantityChange = (amount: number) => {
		const newQuantity = quantity + amount;
		if (
			newQuantity >= 1 &&
			newQuantity <= (product.stock_quantity || 10)
		) {
			setQuantity(newQuantity);
		}
	};

	const handleAddToCart = () => {
		if (
			product.stock_quantity &&
			product.stock_quantity <= 0
		) {
			toast({
				title: t("product.outOfStock"),
				description: t("product.outOfStockDescription"),
				variant: "destructive",
			});
			return;
		}

		addToCart({
			product_id: product.id,
			quantity,
			name: product.name,
			name_ar: product.name_ar,
			price: product.price,
			image: product.image,
		});

		setAddedToCart(true);

		toast({
			title: t("product.addedToCart"),
			description: t("product.addedToCartDescription"),
			action: (
				<ToastAction
					altText="View cart"
					onClick={() => navigate("/cart")}>
					{t("common.viewCart")}
				</ToastAction>
			),
		});

		// Reset added state after 2 seconds
		setTimeout(() => {
			setAddedToCart(false);
		}, 2000);
	};

	const handleToggleWishlist = () => {
		if (!user) {
			toast({
				title: t("common.authRequired"),
				description: t("wishlist.loginToAddToWishlist"),
				variant: "destructive",
			});
			return;
		}

		if (isProductInWishlist) {
			removeFromWishlist(product.id);
		} else {
			addToWishlist(product.id);
		}
	};

	const handleShareProduct = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: product.name,
					text: t("product.shareText", {
						name: product.name,
					}),
					url: window.location.href,
				});
			} catch (error) {
				console.error("Error sharing:", error);
			}
		} else {
			// Fallback for browsers that don't support navigator.share
			navigator.clipboard.writeText(window.location.href);
			toast({
				title: t("product.linkCopied"),
				description: t("product.linkCopiedDescription"),
			});
		}
	};

	return (
		<div className="space-y-6">
			{/* Quantity Selector */}
			<div className="flex items-center">
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 rounded-r-none"
					onClick={() => handleQuantityChange(-1)}
					disabled={quantity <= 1}>
					<Minus className="h-3 w-3" />
				</Button>
				<div className="flex h-8 w-12 items-center justify-center border-y px-3 text-center">
					{quantity}
				</div>
				<Button
					variant="outline"
					size="icon"
					className="h-8 w-8 rounded-l-none"
					onClick={() => handleQuantityChange(1)}
					disabled={
						quantity >= (product.stock_quantity || 10)
					}>
					<Plus className="h-3 w-3" />
				</Button>
			</div>

			{/* Action Buttons */}
			<div className="flex flex-wrap gap-2">
				<Button
					size="lg"
					className="flex-1"
					onClick={handleAddToCart}
					disabled={
						(product.stock_quantity !== undefined &&
							product.stock_quantity <= 0) ||
						addedToCart
					}>
					{addedToCart ? (
						<>
							<Check className="mr-2 h-5 w-5" />
							{t("product.added")}
						</>
					) : (
						<>
							<ShoppingCart className="mr-2 h-5 w-5" />
							{t("product.addToCart")}
						</>
					)}
				</Button>
				<Button
					variant={
						isProductInWishlist ? "destructive" : "outline"
					}
					size="icon"
					className="h-11 w-11"
					onClick={handleToggleWishlist}>
					<Heart
						className="h-5 w-5"
						fill={
							isProductInWishlist ? "currentColor" : "none"
						}
					/>
				</Button>
				<Button
					variant="outline"
					size="icon"
					className="h-11 w-11"
					onClick={handleShareProduct}>
					<Share2 className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
};

export default ProductActions;
