import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import type { Order, ShippingAddress } from "../types";

export const useOrders = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [selectedOrder, setSelectedOrder] =
		useState<Order | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [statusFilter, setStatusFilter] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const { toast } = useToast();

	const fetchOrders = useCallback(async () => {
		try {
			setIsLoading(true);
			let query = supabase
				.from("orders")
				.select(
					`
					*,
					user:users(email),
					items:order_items(
						id,
						order_id,
						product_id,
						quantity,
						unit_price,
						product:products(id, name, image, slug)
					)
					`,
				)
				.order("created_at", { ascending: false });

			if (statusFilter !== "all") {
				query = query.eq("status", statusFilter);
			}

			if (searchQuery) {
				// Search by order ID or user email
				query = query.or(
					`id.ilike.%${searchQuery}%,user.email.ilike.%${searchQuery}%`,
				);
			}

			const { data, error } = await query;

			if (error) throw error;

			setOrders(data || []);
		} catch (error) {
			console.error("Error fetching orders:", error);
			toast({
				title: "Error",
				description:
					"Failed to fetch orders. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}, [searchQuery, statusFilter, toast]);

	const updateOrderStatus = useCallback(
		async (orderId: string, status: string) => {
			try {
				setIsSubmitting(true);
				const { error } = await supabase
					.from("orders")
					.update({ status })
					.eq("id", orderId);

				if (error) throw error;

				// Update local state
				setOrders((prev) =>
					prev.map((order) =>
						order.id === orderId
							? { ...order, status }
							: order,
					),
				);

				if (selectedOrder?.id === orderId) {
					setSelectedOrder((prev) =>
						prev ? { ...prev, status } : null,
					);
				}

				toast({
					title: "Success",
					description: "Order status updated successfully.",
				});
			} catch (error) {
				console.error(
					"Error updating order status:",
					error,
				);
				toast({
					title: "Error",
					description:
						"Failed to update order status. Please try again.",
					variant: "destructive",
				});
			} finally {
				setIsSubmitting(false);
			}
		},
		[selectedOrder?.id, toast],
	);

	const viewOrderDetails = useCallback((order: Order) => {
		setSelectedOrder(order);
	}, []);

	const formatDate = useCallback((date: string) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	}, []);

	const formatTime = useCallback((date: string) => {
		return new Date(date).toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});
	}, []);

	const formatCurrency = useCallback((amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	}, []);

	const getShippingAddressProperty = useCallback(
		(
			order: Order,
			property: keyof ShippingAddress,
			fallback: string = "Not provided",
		) => {
			if (
				!order?.shipping_address ||
				typeof order.shipping_address !== "object"
			) {
				return fallback;
			}

			const value = (
				order.shipping_address as ShippingAddress
			)[property];
			return value || fallback;
		},
		[],
	);

	return {
		orders,
		selectedOrder,
		isLoading,
		isSubmitting,
		statusFilter,
		searchQuery,
		setSearchQuery,
		setStatusFilter,
		fetchOrders,
		viewOrderDetails,
		updateOrderStatus,
		getShippingAddressProperty,
		formatDate,
		formatTime,
		formatCurrency,
	};
};
