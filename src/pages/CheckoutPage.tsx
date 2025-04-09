import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { CheckoutForm } from "@/features/checkout/components/CheckoutForm";
import { OrderSummary } from "@/features/checkout/components/OrderSummary";
import { CheckoutPageSkeleton } from "@/features/checkout/components/CheckoutPageSkeleton";
import {
	fetchUserProfile,
	createOrder,
	processPayment,
} from "@/features/checkout/api";
import type {
	CheckoutFormData,
	UserProfile,
	CartItem,
} from "@/features/checkout/types";

const CheckoutPage = () => {
	const { t } = useTranslation();
	const { cartItems, clearCart } = useCart();
	const { user } = useAuth();
	const { toast } = useToast();
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isProcessingPayment, setIsProcessingPayment] =
		useState(false);
	const [userProfile, setUserProfile] =
		useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Map cart items to match the expected CartItem type
	const mappedCartItems: CartItem[] = cartItems.map(
		(item) => ({
			id: item.id!,
			quantity: item.quantity,
			product: {
				id: item.product_id,
				name: item.name,
				price: item.price,
				image_url: item.image,
			},
		}),
	);

	// Calculate order summary
	const subtotal = mappedCartItems.reduce(
		(total, item) =>
			total + item.product.price * item.quantity,
		0,
	);
	const shippingCost = mappedCartItems.length > 0 ? 10 : 0;
	const taxRate = 0.05; // 5% tax
	const taxAmount = subtotal * taxRate;
	const totalAmount = subtotal + shippingCost + taxAmount;

	const orderSummary = {
		subtotal,
		shipping: shippingCost,
		tax: taxAmount,
		total: totalAmount,
	};

	// Fetch user profile data
	useEffect(() => {
		const loadUserProfile = async () => {
			if (!user) return;
			try {
				const profile = await fetchUserProfile(user.id);
				setUserProfile(profile);
			} catch (error) {
				console.error(
					"Error fetching user profile:",
					error,
				);
			} finally {
				setIsLoading(false);
			}
		};

		loadUserProfile();
	}, [user]);

	// Redirect if cart is empty
	useEffect(() => {
		if (!isLoading && cartItems.length === 0) {
			navigate("/cart");
		}
	}, [cartItems.length, isLoading, navigate]);

	const handleSubmit = async (values: CheckoutFormData) => {
		if (!user) {
			toast({
				title: t("common.authRequired"),
				description: t("checkout.loginToCheckout"),
				variant: "destructive",
			});
			navigate("/auth");
			return;
		}

		setIsSubmitting(true);

		try {
			// Process payment first
			setIsProcessingPayment(true);
			const paymentSuccessful = await processPayment(
				user.id,
				totalAmount,
			);
			if (!paymentSuccessful) {
				toast({
					title: t("checkout.paymentFailed"),
					description: t("checkout.tryAgainLater"),
					variant: "destructive",
				});
				return;
			}

			// Create order
			await createOrder(values);

			// Clear the cart
			await clearCart();

			// Show success message
			toast({
				title: t("checkout.orderSuccess"),
				description: t("checkout.orderConfirmation"),
			});

			// Redirect to profile/orders
			navigate("/profile?tab=orders");
		} catch (error) {
			console.error("Checkout error:", error);
			toast({
				title: t("common.error"),
				description: t("checkout.orderError"),
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
			setIsProcessingPayment(false);
		}
	};

	if (isLoading || !user) {
		return <CheckoutPageSkeleton />;
	}

	if (cartItems.length === 0) {
		navigate("/cart");
		return null;
	}

	return (
		<div className="container py-8 md:py-12">
			<h1 className="text-2xl md:text-3xl font-bold mb-6">
				{t("checkout.title")}
			</h1>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<CheckoutForm
						isSubmitting={isSubmitting}
						isProcessingPayment={isProcessingPayment}
						onSubmit={handleSubmit}
					/>
				</div>

				<div className="lg:col-span-1">
					<OrderSummary
						items={mappedCartItems}
						summary={orderSummary}
					/>
				</div>
			</div>
		</div>
	);
};

export default CheckoutPage;
