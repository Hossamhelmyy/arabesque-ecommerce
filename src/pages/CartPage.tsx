import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/CartContext";
import CartList from "@/features/cart/components/CartList";
import CartSummary from "@/features/cart/components/CartSummary";
import EmptyCart from "@/features/cart/components/EmptyCart";
import { CartPageSkeleton } from "@/features/cart/components/CartPageSkeleton";
import type { CartItemDetail } from "@/features/cart/types";

interface CartSummaryData {
	subtotal: number;
	shipping: number;
	tax: number;
	total: number;
}

const CartPage = () => {
	const { t } = useTranslation();
	const { toast } = useToast();
	const {
		cartItems,
		removeFromCart,
		updateCartItemQuantity,
		isLoading: cartLoading,
	} = useCart();
	const navigate = useNavigate();

	const handleRemoveItem = (id: string) => {
		removeFromCart(id);
		toast({
			title: t("cart.itemRemoved"),
			description: t("cart.itemRemovedDesc"),
		});
	};

	const handleQuantityChange = (
		id: string,
		quantity: number,
	) => {
		if (quantity < 1) return;
		updateCartItemQuantity(id, quantity);
	};

	const calculateSubtotal = () => {
		return cartItems.reduce((total, item) => {
			return total + item.price * item.quantity;
		}, 0);
	};

	// Shipping cost calculation (simplified for example)
	const shippingCost = cartItems.length > 0 ? 10 : 0;

	// Tax calculation (simplified for example)
	const taxRate = 0.05; // 5% tax
	const taxAmount = calculateSubtotal() * taxRate;

	// Total calculation
	const totalAmount =
		calculateSubtotal() + shippingCost + taxAmount;

	// Cart summary object
	const cartSummary: CartSummaryData = {
		subtotal: calculateSubtotal(),
		shipping: shippingCost,
		tax: taxAmount,
		total: totalAmount,
	};

	if (cartLoading) {
		return <CartPageSkeleton />;
	}

	if (cartItems.length === 0 && !cartLoading) {
		return (
			<div className="container py-8 md:py-12">
				<h1 className="text-2xl md:text-3xl font-bold mb-6">
					{t("common.cart")}
				</h1>
				<EmptyCart />
			</div>
		);
	}

	return (
		<div className="container py-8 md:py-12">
			<h1 className="text-2xl md:text-3xl font-bold mb-6">
				{t("common.cart")}
			</h1>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<CartList
						items={cartItems}
						onUpdateQuantity={handleQuantityChange}
						onRemove={handleRemoveItem}
					/>
				</div>

				<div className="lg:col-span-1">
					<CartSummary
						summary={cartSummary}
						itemCount={cartItems.length}
						onCheckout={() => navigate("/checkout")}
					/>
				</div>
			</div>
		</div>
	);
};

export default CartPage;
