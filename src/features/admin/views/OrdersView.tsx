import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOrders } from "../hooks/useOrders";
import { OrderList } from "../components/orders/OrderList";
import { OrderHeader } from "../components/orders/OrderHeader";
import { OrderDetailsDialog } from "../components/orders/OrderDetailsDialog";
import { useToast } from "@/components/ui/use-toast";
import type { Order } from "../types";

export const OrdersView = () => {
	const { t } = useTranslation();
	const {
		orders,
		filteredOrders,
		isLoading,
		isSubmitting,
		isItemsLoading,
		searchQuery,
		statusFilter,
		selectedOrder,
		setSearchQuery,
		setStatusFilter,
		setSelectedOrder,
		fetchOrderItems,
		updateOrderStatus,
		formatDate,
		formatTime,
		formatCurrency,
		getStatusBadge,
		getShippingAddressProperty,
	} = useOrders();

	const [isDetailsDialogOpen, setIsDetailsDialogOpen] =
		useState(false);
	const { toast } = useToast();

	const handleSearch = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		setSearchQuery(e.target.value);
	};

	const handleStatusChange = (status: string) => {
		setStatusFilter(status);
	};

	const handleViewDetails = async (order: Order) => {
		setSelectedOrder(order);
		setIsDetailsDialogOpen(true);
		try {
			await fetchOrderItems(order.id);
		} catch (error) {
			console.error("Error fetching order items:", error);
			toast({
				title: t("common.error"),
				description: t("admin.fetchOrderItemsError"),
				variant: "destructive",
			});
		}
	};

	const handleUpdateStatus = async (
		orderId: string,
		status: string,
	) => {
		try {
			await updateOrderStatus(orderId, status);
			toast({
				title: t("admin.updateOrderStatus"),
				description: t("admin.orderStatusUpdated"),
			});
		} catch (error) {
			console.error("Error updating order status:", error);
			toast({
				title: t("common.error"),
				description: t("admin.updateOrderStatusError"),
				variant: "destructive",
			});
		}
	};

	return (
		<div className="space-y-6">
			<OrderHeader
				searchQuery={searchQuery}
				statusFilter={statusFilter}
				onSearch={handleSearch}
				onStatusChange={handleStatusChange}
			/>

			<OrderList
				orders={filteredOrders}
				isLoading={isLoading}
				onViewDetails={handleViewDetails}
				formatDate={formatDate}
				formatTime={formatTime}
				formatCurrency={formatCurrency}
				getStatusBadge={getStatusBadge}
				getShippingAddressProperty={
					getShippingAddressProperty
				}
			/>

			<OrderDetailsDialog
				open={isDetailsDialogOpen}
				onOpenChange={setIsDetailsDialogOpen}
				selectedOrder={selectedOrder}
				isLoading={isItemsLoading}
				isSubmitting={isSubmitting}
				onUpdateStatus={handleUpdateStatus}
				formatDate={formatDate}
				formatTime={formatTime}
				formatCurrency={formatCurrency}
				getStatusBadge={getStatusBadge}
				getShippingAddressProperty={
					getShippingAddressProperty
				}
			/>
		</div>
	);
};
