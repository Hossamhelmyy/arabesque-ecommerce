import React from "react";
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
	return (
		<div className="space-y-4">
			{items.map((item) => (
				<CartItem
					key={item.id || item.product_id}
					item={item}
					onUpdateQuantity={onUpdateQuantity}
					onRemove={onRemove}
				/>
			))}
		</div>
	);
};

export default CartList;
