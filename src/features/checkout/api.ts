import { supabase } from "@/integrations/supabase/client";
import type {
	UserProfile,
	CheckoutFormValues,
	CartItem,
	Order,
	CheckoutFormData,
} from "./types";

export const fetchUserProfile = async (userId: string) => {
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", userId)
		.single();

	if (error) throw error;
	return data as UserProfile;
};

interface CartItemResponse {
	id: string;
	quantity: number;
	product: [
		{
			id: string;
			name: string;
			price: number;
			image_url: string;
		},
	];
}

export const fetchCartItems = async (userId: string) => {
	const { data, error } = await supabase
		.from("cart_items")
		.select(
			`
			id,
			quantity,
			product:products (
				id,
				name,
				price,
				image_url
			)
		`,
		)
		.eq("user_id", userId);

	if (error) throw error;
	return (data as CartItemResponse[]).map((item) => ({
		id: item.id,
		quantity: item.quantity,
		product: {
			id: item.product[0].id,
			name: item.product[0].name,
			price: item.product[0].price,
			image_url: item.product[0].image_url,
		},
	})) as CartItem[];
};

export const createOrder = async (
	data: CheckoutFormData,
) => {
	const { data: order, error } = await supabase
		.from("orders")
		.insert({
			user_id: (
				await supabase.auth.getUser()
			).data.user?.id,
			status: "pending",
			shipping_address: {
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				phone: data.phone,
				address: data.address,
				apartment: data.apartment,
				city: data.city,
				state: data.state,
				zipCode: data.zipCode,
				country: data.country,
				deliveryInstructions: data.deliveryInstructions,
			},
			payment_details: {
				cardNumber: data.cardNumber,
				expiryDate: data.expiryDate,
				cardholderName: data.cardholderName,
			},
			shipping_method: data.shippingMethod,
			gift_wrap: data.giftWrap,
			gift_message: data.giftMessage,
		})
		.select()
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return order;
};

export const processPayment = async (
	orderId: string,
	amount: number,
) => {
	// This is a mock payment processing function
	// In a real application, you would integrate with a payment gateway like Stripe
	const { data, error } = await supabase
		.from("payments")
		.insert({
			order_id: orderId,
			amount,
			status: "completed",
		})
		.select()
		.single();

	if (error) {
		throw new Error(error.message);
	}

	// Update order status to processing after successful payment
	await supabase
		.from("orders")
		.update({ status: "processing" })
		.eq("id", orderId);

	return data;
};

export async function saveAddress(data: CheckoutFormData) {
	if (!data.saveAddress) return;

	const { error } = await supabase
		.from("addresses")
		.insert({
			user_id: (
				await supabase.auth.getUser()
			).data.user?.id,
			first_name: data.firstName,
			last_name: data.lastName,
			email: data.email,
			phone: data.phone,
			address: data.address,
			apartment: data.apartment,
			city: data.city,
			state: data.state,
			zip_code: data.zipCode,
			country: data.country,
			is_default: true,
		});

	if (error) {
		throw new Error(error.message);
	}
}

export async function saveCard(data: CheckoutFormData) {
	if (!data.saveCard) return;

	const { error } = await supabase
		.from("payment_methods")
		.insert({
			user_id: (
				await supabase.auth.getUser()
			).data.user?.id,
			card_number: data.cardNumber,
			expiry_date: data.expiryDate,
			cardholder_name: data.cardholderName,
			is_default: true,
		});

	if (error) {
		throw new Error(error.message);
	}
}
