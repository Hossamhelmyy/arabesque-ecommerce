import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
	CartList,
	CartSummary,
	EmptyCart,
} from "@/features/cart";
import {
	CartItemDetail,
	CartSummaryData,
} from "@/features/cart";

const CartPage = () => {
	const { t } = useTranslation();
	const { toast } = useToast();
	const {
		cartItems,
		removeFromCart,
		updateCartItemQuantity,
		isLoading: cartLoading,
	} = useCart();
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		// If user is not logged in, redirect to auth page
		if (!user && !cartLoading) {
			toast({
				title: t("common.authRequired"),
				description: t("cart.loginToView"),
				variant: "destructive",
			});
			navigate("/auth");
		}
	}, [user, cartLoading, navigate, toast, t]);

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
		return (
			<div className="container py-16 flex flex-col items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
				<p className="text-muted-foreground">
					{t("common.loading")}
				</p>
			</div>
		);
	}

	if (!user) {
		return null; // Redirect handled in useEffect
	}

	if (cartItems.length === 0) {
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
					<div className="bg-card rounded-lg shadow-sm p-4">
						<CartList
							items={cartItems}
							onUpdateQuantity={handleQuantityChange}
							onRemove={handleRemoveItem}
						/>
					</div>
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
