import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	useQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS } from "../constants";
import type {
	Order,
	OrderItem,
	ShippingAddress,
	OrdersData,
} from "../types";
import React from "react";

export const useOrders = (): OrdersData => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [selectedOrder, setSelectedOrder] =
		useState<Order | null>(null);
	const [orderItems, setOrderItems] = useState<OrderItem[]>(
		[],
	);
	const [isItemsLoading, setIsItemsLoading] =
		useState(false);
	const [statusFilter, setStatusFilter] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Fetch all orders with user data
	const { data: orders = [], isLoading } = useQuery({
		queryKey: ["admin", "orders"],
		queryFn: async () => {
			try {
				const { data, error } = await supabase
					.from("orders")
					.select(
						"*, user:user_id(email, profile:profiles(first_name, last_name))",
					)
					.order("created_at", { ascending: false });

				if (error) throw error;

				// Parse shipping address if it's stored as a string
				const ordersWithParsedAddress = (data || []).map(
					(order) => {
						let shippingAddress = order.shipping_address;
						if (typeof shippingAddress === "string") {
							try {
								shippingAddress =
									JSON.parse(shippingAddress);
							} catch (e) {
								console.error(
									"Error parsing shipping address:",
									e,
								);
								shippingAddress = {};
							}
						}

						return {
							...order,
							shipping_address: shippingAddress || {},
						};
					},
				);

				return ordersWithParsedAddress as unknown as Order[];
			} catch (error) {
				console.error("Error fetching orders:", error);
				toast({
					title: "Error",
					description:
						"Failed to fetch orders. Please try again.",
					variant: "destructive",
				});
				return [];
			}
		},
	});

	// Fetch order items
	const fetchOrderItems = async (
		orderId: string,
	): Promise<OrderItem[]> => {
		try {
			setIsItemsLoading(true);
			const { data, error } = await supabase
				.from("order_items")
				.select("*, product:product_id(name, image, slug)")
				.eq("order_id", orderId);

			if (error) throw error;

			return data as unknown as OrderItem[];
		} catch (error: unknown) {
			console.error("Error fetching order items:", error);
			toast({
				title: "Error",
				description: "Failed to fetch order items.",
				variant: "destructive",
			});
			return [];
		} finally {
			setIsItemsLoading(false);
		}
	};

	// View order details and fetch its items
	const viewOrderDetails = async (order: Order) => {
		setSelectedOrder(order);
		const items = await fetchOrderItems(order.id);
		setOrderItems(items);
	};

	// Update order status
	const updateOrderStatusMutation = useMutation({
		mutationFn: async ({
			orderId,
			status,
		}: {
			orderId: string;
			status: string;
		}) => {
			setIsSubmitting(true);
			try {
				const { data, error } = await supabase
					.from("orders")
					.update({
						status,
						updated_at: new Date().toISOString(),
					})
					.eq("id", orderId)
					.select()
					.single();

				if (error) throw error;

				return data as unknown as Order;
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error
						? error.message
						: "Failed to update order status";
				throw new Error(errorMessage);
			} finally {
				setIsSubmitting(false);
			}
		},
		onSuccess: (updatedOrder) => {
			queryClient.invalidateQueries({
				queryKey: ["admin", "orders"],
			});

			// Update the selected order if it's the one being updated
			if (
				selectedOrder &&
				selectedOrder.id === updatedOrder.id
			) {
				setSelectedOrder(updatedOrder);
			}

			toast({
				title: "Success",
				description: `Order status updated to ${updatedOrder.status}`,
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Error",
				description:
					error.message || "Failed to update order status.",
				variant: "destructive",
			});
		},
	});

	// Update order status wrapper function
	const updateOrderStatus = async (
		orderId: string,
		status: string,
	) => {
		await updateOrderStatusMutation.mutateAsync({
			orderId,
			status,
		});
	};

	// Helper to safely access shipping address properties
	const getShippingAddressProperty = (
		order: Order,
		property: keyof ShippingAddress,
		fallback: string = "N/A",
	): string => {
		if (!order.shipping_address) return fallback;

		// Check if shipping_address has the property
		const address = order.shipping_address as Record<
			string,
			string | number | boolean | null | undefined
		>;
		return typeof address[property] !== "undefined" &&
			address[property] !== null
			? String(address[property])
			: fallback;
	};

	// Format functions
	const formatDate = (dateString: string) => {
		return format(new Date(dateString), "MMM dd, yyyy");
	};

	const formatTime = (dateString: string) => {
		return format(new Date(dateString), "hh:mm a");
	};

	const getStatusBadge = (
		status: string,
	): React.ReactElement => {
		let variant:
			| "default"
			| "secondary"
			| "destructive"
			| "outline" = "default";

		switch (status.toLowerCase()) {
			case "pending":
				variant = "outline";
				break;
			case "processing":
				variant = "secondary";
				break;
			case "completed":
				variant = "default";
				break;
			case "cancelled":
				variant = "destructive";
				break;
			default:
				variant = "outline";
		}

		return <Badge variant={variant}>{status}</Badge>;
	};

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(value);
	};

	// Filter orders based on search and status filter
	const filteredOrders = orders.filter((order) => {
		// Match search query
		const matchesSearch =
			searchQuery.trim() === "" ||
			(order.id &&
				order.id
					.toLowerCase()
					.includes(searchQuery.toLowerCase())) ||
			(order.user?.email &&
				order.user.email
					.toLowerCase()
					.includes(searchQuery.toLowerCase()));

		// Match status filter
		const matchesStatus =
			statusFilter === "all" ||
			order.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	// Convert handlers for the correct OrdersData interface
	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	const handleStatusFilter = (status: string) => {
		setStatusFilter(status);
	};

	return {
		orders,
		filteredOrders,
		selectedOrder,
		orderItems,
		isLoading,
		isSubmitting,
		isItemsLoading,
		statusFilter,
		searchQuery,
		setSearchQuery,
		setStatusFilter,
		setSelectedOrder,
		fetchOrderItems,
		viewOrderDetails,
		updateOrderStatus,
		getShippingAddressProperty,
		formatDate,
		formatTime,
		getStatusBadge,
		formatCurrency,
		handleSearch,
		handleStatusFilter,
	};
};

export default useOrders;
