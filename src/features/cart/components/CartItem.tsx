import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus } from "lucide-react";
import type { CartItemDetail } from "../types";

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

	return (
		<div className="flex items-start space-x-4 rtl:space-x-reverse py-4 border-b">
			<div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md border">
				<img
					src={item.image}
					alt={isRTL ? item.name_ar : item.name}
					className="h-full w-full object-cover object-center"
				/>
			</div>

			<div className="flex flex-1 flex-col">
				<div className="flex justify-between text-base font-medium">
					<h5 className="text-[20px]">
						{isRTL ? item.name_ar : item.name}
					</h5>
					<p className="ml-4 rtl:mr-4 rtl:ml-0">
						${item.price.toFixed(2)}
					</p>
				</div>

				<div className="flex items-center justify-between mt-4">
					<div className="flex items-center border rounded-md">
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 rounded-none"
							onClick={() =>
								onUpdateQuantity(
									item.product_id,
									Math.max(1, item.quantity - 1),
								)
							}
							disabled={item.quantity <= 1}>
							<Minus className="h-3 w-3" />
						</Button>

						<span className="w-10 text-center text-sm">
							{item.quantity}
						</span>

						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 rounded-none"
							onClick={() =>
								onUpdateQuantity(
									item.product_id,
									item.quantity + 1,
								)
							}>
							<Plus className="h-3 w-3" />
						</Button>
					</div>

					<Button
						variant="ghost"
						size="sm"
						onClick={() => onRemove(item.product_id)}
						className="text-muted-foreground hover:text-destructive">
						<X className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
						{t("cart.remove")}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CartItem;
