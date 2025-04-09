import React from "react";
import { useTranslation } from "react-i18next";
import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatPrice } from "@/lib/utils";
import { type CartItemDetail } from "../types";
import { useLanguage } from "@/context/LanguageContext";

interface CartItemProps {
	item: CartItemDetail;
	onUpdateQuantity: (
		productId: string,
		quantity: number,
	) => void;
	onRemove: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
	item,
	onUpdateQuantity,
	onRemove,
}) => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();

	const handleIncrement = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onUpdateQuantity(item.product_id, item.quantity + 1);
	};

	const handleDecrement = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (item.quantity > 1) {
			onUpdateQuantity(item.product_id, item.quantity - 1);
		}
	};

	const handleRemove = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		onRemove(item.product_id);
	};

	return (
		<div
			dir={isRTL ? "rtl" : "ltr"}
			className="group relative flex flex-col sm:flex-row items-start gap-3 sm:gap-4 rounded-lg border p-3 sm:p-4 hover:bg-muted/50 transition-colors">
			{/* Product Image */}
			<div className="relative aspect-square h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-md">
				<img
					src={item.image}
					alt={item.name}
					className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
				/>
				{item.sale_price &&
					item.sale_price < item.price && (
						<Badge
							variant="destructive"
							className="absolute top-2 right-2 text-[10px] sm:text-xs">
							-
							{Math.round(
								((item.price - item.sale_price) /
									item.price) *
									100,
							)}
							%
						</Badge>
					)}
			</div>

			{/* Product Details */}
			<div className="flex flex-1 flex-col space-y-2 w-full">
				<div className="flex justify-between items-start">
					<div>
						<h3 className="font-medium text-sm sm:text-base leading-tight">
							{item.name}
						</h3>
						<div className="flex items-center gap-2 mt-1">
							<p className="text-sm text-muted-foreground">
								{formatPrice(item.sale_price || item.price)}
							</p>
							{item.sale_price &&
								item.sale_price < item.price && (
									<p className="text-xs text-muted-foreground line-through">
										{formatPrice(item.price)}
									</p>
								)}
						</div>
					</div>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 opacity-70 sm:opacity-0 group-hover:opacity-100 transition-opacity"
									onClick={handleRemove}>
									<Trash2 className="h-4 w-4 text-destructive" />
									<span className="sr-only">
										{t("cart.remove")}
									</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								{t("cart.remove")}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>

				{/* Quantity Controls */}
				<div className="flex items-center justify-between mt-auto pt-2 sm:pt-0">
					<div className="flex items-center space-x-1 sm:space-x-2 rtl:space-x-reverse">
						<Button
							variant="outline"
							size="icon"
							className="h-7 w-7 sm:h-8 sm:w-8"
							onClick={handleDecrement}
							disabled={item.quantity <= 1}>
							<Minus className="h-3 w-3 sm:h-4 sm:w-4" />
							<span className="sr-only">
								{t("cart.decrease")}
							</span>
						</Button>
						<span className="w-8 sm:w-12 text-center text-sm">
							{item.quantity}
						</span>
						<Button
							variant="outline"
							size="icon"
							className="h-7 w-7 sm:h-8 sm:w-8"
							onClick={handleIncrement}>
							<Plus className="h-3 w-3 sm:h-4 sm:w-4" />
							<span className="sr-only">
								{t("cart.increase")}
							</span>
						</Button>
					</div>
					<p className="font-medium text-sm sm:text-base">
						{formatPrice(
							(item.sale_price || item.price) *
								item.quantity,
						)}
					</p>
				</div>
			</div>
		</div>
	);
};

export default CartItem;
