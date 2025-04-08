import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Order, ShippingAddress } from "../types";
import {
	useQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

export const useOrders = () => {
	const [selectedOrder, setSelectedOrder] =
		useState<Order | null>(null);
	const [statusFilter, setStatusFilter] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const { toast } = useToast();
	const queryClient = useQueryClient();

	// Fetch orders with React Query
	const { data: orders = [], isLoading } = useQuery({
		queryKey: [
			"admin",
			"orders",
			statusFilter,
			searchQuery,
		],
		queryFn: async () => {
			try {
				let query = supabase
					.from("orders")
					.select(
						`
						*,
						items:order_items(
							id,
							order_id,
							product_id,
							quantity,
							price,
							product:products(id, name, image, slug)
						)
					`,
					)
					.order("created_at", { ascending: false });

				if (statusFilter !== "all") {
					query = query.eq("status", statusFilter);
				}

				if (searchQuery) {
					query = query.ilike("id", `%${searchQuery}%`);
				}

				const { data, error } = await query;

				if (error) throw error;

				// Fetch user data for each order
				const ordersWithUsers = await Promise.all(
					(data || []).map(async (order) => {
						// First get the user's email from auth.users
						const { data: userData, error: userError } =
							await supabase
								.from("auth.users")
								.select("email")
								.eq("id", order.user_id)
								.single();

						if (userError) {
							console.error(
								"Error fetching user:",
								userError,
							);
							return {
								...order,
								user: {
									email: "Unknown",
									profile: {
										first_name: null,
										last_name: null,
									},
								},
							};
						}

						// Then get the user's profile data
						const {
							data: profileData,
							error: profileError,
						} = await supabase
							.from("profiles")
							.select("first_name, last_name")
							.eq("id", order.user_id)
							.single();

						if (profileError) {
							console.error(
								"Error fetching profile:",
								profileError,
							);
							return {
								...order,
								user: {
									email: userData?.email || "Unknown",
									profile: {
										first_name: null,
										last_name: null,
									},
								},
							};
						}

						return {
							...order,
							user: {
								email: userData?.email || "Unknown",
								profile: {
									first_name: profileData?.first_name,
									last_name: profileData?.last_name,
								},
							},
						};
					}),
				);

				return ordersWithUsers;
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

	// Filter orders based on search query and status filter
	const filteredOrders = orders.filter((order) => {
		const matchesSearch = searchQuery
			? order.id
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
			  (order.user?.email &&
					order.user.email
						.toLowerCase()
						.includes(searchQuery.toLowerCase()))
			: true;

		const matchesStatus =
			statusFilter === "all" ||
			order.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	// Fetch order items
	const {
		data: orderItems = [],
		isLoading: isItemsLoading,
	} = useQuery({
		queryKey: ["admin", "order-items", selectedOrder?.id],
		queryFn: async () => {
			if (!selectedOrder) return [];

			try {
				const { data, error } = await supabase
					.from("order_items")
					.select(
						`
						id,
						order_id,
						product_id,
						quantity,
						price,
						product:products(id, name, image, slug, price, stock_quantity, description)
					`,
					)
					.eq("order_id", selectedOrder.id);

				if (error) throw error;

				return (
					data?.map((item) => {
						const product = Array.isArray(item.product)
							? item.product[0]
							: item.product;

						return {
							id: item.id,
							order_id: item.order_id,
							product_id: item.product_id,
							quantity: item.quantity,
							unit_price: item.price,
							total_price: item.quantity * item.price,
							product: {
								id: product?.id || "",
								name: product?.name || "",
								image: product?.image || "",
								slug: product?.slug || "",
								price: product?.price || 0,
								stock_quantity:
									product?.stock_quantity || 0,
								description: product?.description || "",
								category_id: null,
								created_at: new Date().toISOString(),
							},
						};
					}) || []
				);
			} catch (error) {
				console.error("Error fetching order items:", error);
				toast({
					title: "Error",
					description:
						"Failed to fetch order items. Please try again.",
					variant: "destructive",
				});
				return [];
			}
		},
		enabled: !!selectedOrder,
	});

	// Update order status mutation
	const updateOrderStatusMutation = useMutation({
		mutationFn: async ({
			orderId,
			status,
		}: {
			orderId: string;
			status: string;
		}) => {
			const { error } = await supabase
				.from("orders")
				.update({ status })
				.eq("id", orderId);

			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["admin", "orders"],
			});
			toast({
				title: "Success",
				description: "Order status updated successfully.",
			});
		},
		onError: (error) => {
			console.error("Error updating order status:", error);
			toast({
				title: "Error",
				description:
					"Failed to update order status. Please try again.",
				variant: "destructive",
			});
		},
	});

	const updateOrderStatus = async (
		orderId: string,
		status: string,
	) => {
		updateOrderStatusMutation.mutate({ orderId, status });
	};

	const viewOrderDetails = (order: Order) => {
		setSelectedOrder(order);
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const formatTime = (date: string) => {
		return new Date(date).toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	};

	const getStatusBadge = (status: string) => {
		let variant = "outline";
		let displayStatus = status;

		switch (status) {
			case "pending":
				variant = "outline";
				displayStatus = "Pending";
				break;
			case "processing":
				variant = "secondary";
				displayStatus = "Processing";
				break;
			case "shipped":
				variant = "default";
				displayStatus = "Shipped";
				break;
			case "delivered":
				variant = "default";
				displayStatus = "Delivered";
				break;
			case "cancelled":
				variant = "destructive";
				displayStatus = "Cancelled";
				break;
			default:
				variant = "outline";
				displayStatus = status;
		}

		return {
			status: displayStatus,
			variant,
		};
	};

	const getShippingAddressProperty = (
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
	};

	// Function to fetch order items (for backward compatibility)
	const fetchOrderItems = async (orderId: string) => {
		// This is now handled by the React Query hook
		// We just need to set the selected order to trigger the query
		setSelectedOrder((prev) => {
			if (prev?.id === orderId) return prev;
			return (
				orders.find((order) => order.id === orderId) || null
			);
		});
	};

	return {
		orders,
		filteredOrders,
		selectedOrder,
		isLoading,
		isSubmitting: updateOrderStatusMutation.isPending,
		isItemsLoading,
		statusFilter,
		searchQuery,
		setSearchQuery,
		setStatusFilter,
		setSelectedOrder,
		viewOrderDetails,
		updateOrderStatus,
		getShippingAddressProperty,
		getStatusBadge,
		formatDate,
		formatTime,
		formatCurrency,
		orderItems,
		fetchOrderItems,
	};
};
