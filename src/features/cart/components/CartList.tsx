import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { type CartItemDetail } from "../types";
import CartItem from "./CartItem";

interface CartListProps {
	items: CartItemDetail[];
	onUpdateQuantity: (
		productId: string,
		quantity: number,
	) => void;
	onRemove: (productId: string) => void;
}

const CartList: React.FC<CartListProps> = ({
	items,
	onUpdateQuantity,
	onRemove,
}) => {
	const { t } = useTranslation();

	if (items.length === 0) {
		return (
			<Card className="p-4 sm:p-6 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[300px] text-center space-y-4">
				<ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
				<div>
					<h3 className="font-semibold text-base sm:text-lg">
						{t("cart.empty")}
					</h3>
					<p className="text-xs sm:text-sm text-muted-foreground max-w-[250px] mx-auto">
						{t("cart.emptyMessage")}
					</p>
				</div>
			</Card>
		);
	}

	return (
		<Card className="p-2 sm:p-4">
			<ScrollArea className="h-[calc(70dvh-100px)] sm:h-[calc(77dvh-300px)] pr-2 sm:pr-4">
				<motion.div
					layout
					className="space-y-2 sm:space-y-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}>
					<AnimatePresence mode="popLayout">
						{items.map((item) => (
							<motion.div
								key={item.id || item.product_id}
								layout
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{
									type: "spring",
									stiffness: 500,
									damping: 30,
								}}>
								<CartItem
									item={item}
									onUpdateQuantity={onUpdateQuantity}
									onRemove={onRemove}
								/>
							</motion.div>
						))}
					</AnimatePresence>
				</motion.div>
			</ScrollArea>
		</Card>
	);
};

export default CartList;
