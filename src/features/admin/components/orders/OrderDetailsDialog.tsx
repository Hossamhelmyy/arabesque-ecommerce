import { useTranslation } from "react-i18next";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import type { Order, ShippingAddress } from "../../types";

interface OrderDetailsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	selectedOrder: Order | null;
	isLoading: boolean;
	isSubmitting: boolean;
	onUpdateStatus: (
		orderId: string,
		status: string,
	) => Promise<void>;
	formatDate: (date: string) => string;
	formatTime: (date: string) => string;
	formatCurrency: (amount: number) => string;
	getStatusBadge: (status: string) => JSX.Element;
	getShippingAddressProperty: (
		order: Order,
		property: keyof ShippingAddress,
		fallback?: string,
	) => string;
}

const orderStatuses = [
	{ value: "pending", label: "Pending" },
	{ value: "processing", label: "Processing" },
	{ value: "shipped", label: "Shipped" },
	{ value: "delivered", label: "Delivered" },
	{ value: "cancelled", label: "Cancelled" },
];

export const OrderDetailsDialog = ({
	open,
	onOpenChange,
	selectedOrder,
	isLoading,
	isSubmitting,
	onUpdateStatus,
	formatDate,
	formatTime,
	formatCurrency,
	getStatusBadge,
	getShippingAddressProperty,
}: OrderDetailsDialogProps) => {
	const { t } = useTranslation();

	if (!selectedOrder) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="p-0 w-[100vw] sm:max-w-3xl">
				<div className="p-6">
					<DialogHeader className="pb-4 !text-center">
						{" "}
						<DialogTitle>
							{t("admin.orderDetails", {
								id: selectedOrder.id,
							})}
						</DialogTitle>
					</DialogHeader>
					<ScrollArea className="sm:h-[70dvh] h-[calc(100dvh-110px)] pe-3">
						<div className="grid gap-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<Label>{t("admin.orderStatus")}</Label>
									<Select
										value={selectedOrder.status}
										onValueChange={(value) =>
											onUpdateStatus(
												selectedOrder.id,
												value,
											)
										}
										disabled={isSubmitting}>
										<SelectTrigger>
											<SelectValue>
												{getStatusBadge(
													selectedOrder.status,
												)}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											{orderStatuses.map((status) => (
												<SelectItem
													key={status.value}
													value={status.value}>
													{t(
														`admin.orderStatus.${status.label.toLowerCase()}`,
													)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label>{t("admin.orderDate")}</Label>
									<div className="mt-2">
										<div>
											{formatDate(selectedOrder.created_at)}
										</div>
										<div className="text-sm text-muted-foreground">
											{formatTime(selectedOrder.created_at)}
										</div>
									</div>
								</div>
							</div>

							<div className="grid gap-4">
								<Label>{t("admin.shippingAddress")}</Label>
								<div className="rounded-lg border p-4">
									<div className="font-medium">
										{getShippingAddressProperty(
											selectedOrder,
											"name",
										)}
									</div>
									<div className="mt-1 text-sm text-muted-foreground">
										{getShippingAddressProperty(
											selectedOrder,
											"address",
										)}
										<br />
										{getShippingAddressProperty(
											selectedOrder,
											"city",
										)}
										,{" "}
										{getShippingAddressProperty(
											selectedOrder,
											"postal_code",
										)}
										<br />
										{getShippingAddressProperty(
											selectedOrder,
											"country",
										)}
										<br />
										{getShippingAddressProperty(
											selectedOrder,
											"phone",
										)}
										<br />
										{getShippingAddressProperty(
											selectedOrder,
											"email",
										)}
									</div>
								</div>
							</div>

							<div>
								<Label>{t("admin.orderItems")}</Label>
								<div className="mt-2 rounded-md border overflow-x-auto">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className="text-start">
													{t("admin.product")}
												</TableHead>
												<TableHead className="text-start">
													{t("admin.price")}
												</TableHead>
												<TableHead className="text-start">
													{t("admin.quantity")}
												</TableHead>
												<TableHead className="text-start">
													{t("admin.total")}
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{isLoading ? (
												<TableRow>
													<TableCell colSpan={4}>
														<div className="flex justify-center py-4">
															<Skeleton className="h-4 w-[200px]" />
														</div>
													</TableCell>
												</TableRow>
											) : (
												selectedOrder.items?.map((item) => (
													<TableRow key={item.id}>
														<TableCell>
															<div className="font-medium">
																{item.product?.name || ""}
															</div>
														</TableCell>
														<TableCell>
															{formatCurrency(
																item.unit_price || 0,
															)}
														</TableCell>
														<TableCell>
															{item.quantity}
														</TableCell>
														<TableCell>
															{formatCurrency(
																(item.unit_price || 0) *
																	item.quantity,
															)}
														</TableCell>
													</TableRow>
												))
											)}
										</TableBody>
									</Table>
								</div>
							</div>

							<div className="grid gap-2">
								<div className="flex justify-between">
									<span>{t("admin.subtotal")}</span>
									<span>
										{formatCurrency(
											selectedOrder.subtotal || 0,
										)}
									</span>
								</div>
								<div className="flex justify-between">
									<span>{t("admin.shipping")}</span>
									<span>
										{formatCurrency(
											selectedOrder.shipping_fee || 0,
										)}
									</span>
								</div>
								<div className="flex justify-between">
									<span>{t("admin.tax")}</span>
									<span>
										{formatCurrency(selectedOrder.tax || 0)}
									</span>
								</div>
								<div className="flex justify-between font-medium text-lg">
									<span>{t("admin.total")}</span>
									<span>
										{formatCurrency(
											selectedOrder.total || 0,
										)}
									</span>
								</div>
							</div>
						</div>
					</ScrollArea>
				</div>
			</DialogContent>
		</Dialog>
	);
};
