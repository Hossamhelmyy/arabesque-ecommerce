import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
	checkoutFormSchema,
	CheckoutFormValues,
	UseCheckoutReturn,
	UserProfile,
} from "../types";

export const useCheckout = (): UseCheckoutReturn => {
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
	const [isLoadingProfile, setIsLoadingProfile] =
		useState(true);

	// Initialize form with default values
	const form = useForm<CheckoutFormValues>({
		resolver: zodResolver(checkoutFormSchema),
		defaultValues: {
			fullName: "",
			email: "",
			phone: "",
			address: "",
			city: "",
			state: "",
			zipCode: "",
			country: "",
			paymentMethod: "credit_card",
			notes: "",
		},
	});

	// Check if user is authenticated
	useEffect(() => {
		if (!user && !isLoadingProfile) {
			toast({
				title: t("common.authRequired"),
				description: t("checkout.loginToCheckout"),
				variant: "destructive",
			});
			navigate("/auth");
		}
	}, [user, isLoadingProfile, navigate, toast, t]);

	// Fetch user profile data
	useEffect(() => {
		const fetchUserProfile = async () => {
			if (!user) {
				setIsLoadingProfile(false);
				return;
			}

			try {
				const { data, error } = await supabase
					.from("profiles")
					.select("*")
					.eq("id", user.id)
					.single();

				if (error) throw error;

				// Type the data correctly
				const profileData = data as UserProfile;
				setUserProfile(profileData);

				// Pre-fill form with user data if available
				if (profileData) {
					const fullName = `${
						profileData.first_name || ""
					} ${profileData.last_name || ""}`.trim();

					form.setValue("fullName", fullName || "");
					form.setValue("email", user.email || "");
					form.setValue("phone", profileData.phone || "");

					if (profileData.address) {
						form.setValue(
							"address",
							profileData.address.street || "",
						);
						form.setValue(
							"city",
							profileData.address.city || "",
						);
						form.setValue(
							"state",
							profileData.address.state || "",
						);
						form.setValue(
							"zipCode",
							profileData.address.zipCode || "",
						);
						form.setValue(
							"country",
							profileData.address.country || "",
						);
					}
				}
			} catch (error) {
				console.error(
					"Error fetching user profile:",
					error,
				);
			} finally {
				setIsLoadingProfile(false);
			}
		};

		fetchUserProfile();
	}, [user, form]);

	// Redirect if cart is empty
	useEffect(() => {
		if (cartItems.length === 0 && !isLoadingProfile) {
			toast({
				title: t("checkout.emptyCart"),
				description: t("checkout.addItemsToCart"),
			});
			navigate("/products");
		}
	}, [cartItems, isLoadingProfile, navigate, toast, t]);

	const calculateSubtotal = () => {
		return cartItems.reduce(
			(total, item) => total + item.price * item.quantity,
			0,
		);
	};

	const shippingCost = cartItems.length > 0 ? 10 : 0;
	const taxRate = 0.05; // 5% tax
	const taxAmount = calculateSubtotal() * taxRate;
	const totalAmount =
		calculateSubtotal() + shippingCost + taxAmount;

	// Simulate payment processing
	const processPayment = async (
		paymentMethod: string,
	): Promise<boolean> => {
		setIsProcessingPayment(true);

		try {
			// Simulate API call to payment processor
			await new Promise((resolve) =>
				setTimeout(resolve, 2000),
			);

			// For demo purposes: credit_card always succeeds, cash_on_delivery has 80% success rate
			if (
				paymentMethod === "credit_card" ||
				Math.random() > 0.2
			) {
				return true;
			} else {
				throw new Error("Payment processing failed");
			}
		} catch (error) {
			console.error("Payment error:", error);
			return false;
		} finally {
			setIsProcessingPayment(false);
		}
	};

	const onSubmit = async (values: CheckoutFormValues) => {
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
			if (values.paymentMethod === "credit_card") {
				const paymentSuccessful = await processPayment(
					values.paymentMethod,
				);
				if (!paymentSuccessful) {
					toast({
						title: t("checkout.paymentFailed"),
						description: t("checkout.tryAgainLater"),
						variant: "destructive",
					});
					setIsSubmitting(false);
					return;
				}
			}

			// Create address object
			const shippingAddress = {
				fullName: values.fullName,
				email: values.email,
				phone: values.phone,
				street: values.address,
				city: values.city,
				state: values.state,
				zipCode: values.zipCode,
				country: values.country,
			};

			// Store order in database
			const { data: orderData, error: orderError } =
				await supabase
					.from("orders")
					.insert({
						user_id: user.id,
						total: totalAmount,
						shipping_address: shippingAddress,
						payment_method: values.paymentMethod,
						status:
							values.paymentMethod === "cash_on_delivery"
								? "pending"
								: "paid",
					})
					.select()
					.single();

			if (orderError) throw orderError;

			// Add order items
			const orderItems = cartItems.map((item) => ({
				order_id: orderData.id,
				product_id: item.product_id,
				quantity: item.quantity,
				price: item.price,
			}));

			const { error: itemsError } = await supabase
				.from("order_items")
				.insert(orderItems);

			if (itemsError) throw itemsError;

			// Update user profile with shipping information if not already present
			if (userProfile) {
				await supabase
					.from("profiles")
					.update({
						phone: values.phone || userProfile.phone,
						address: {
							street: values.address,
							city: values.city,
							state: values.state,
							zipCode: values.zipCode,
							country: values.country,
						},
					})
					.eq("id", user.id);
			}

			// Clear the cart
			await clearCart();

			// Show success message
			toast({
				title: t("checkout.orderSuccess"),
				description: t("checkout.orderConfirmation"),
			});

			// Redirect to a success page or order confirmation
			navigate("/profile");
		} catch (error) {
			console.error("Checkout error:", error);
			toast({
				title: t("common.error"),
				description: t("checkout.orderError"),
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		isSubmitting,
		isProcessingPayment,
		userProfile,
		isLoadingProfile,
		form,
		cartItems,
		calculateSubtotal,
		shippingCost,
		taxRate,
		taxAmount,
		totalAmount,
		onSubmit,
	};
};
