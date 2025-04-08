import { useTranslation } from "react-i18next";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
	{ value: "completed", label: "Completed" },
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
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle>
						{t("admin.orderDetails", {
							id: selectedOrder.id,
						})}
					</DialogTitle>
				</DialogHeader>

				<div className="grid gap-6">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label>{t("admin.orderStatus")}</Label>
							<Select
								value={selectedOrder.status}
								onValueChange={(value) =>
									onUpdateStatus(selectedOrder.id, value)
								}
								disabled={isSubmitting}>
								<SelectTrigger>
									<SelectValue>
										{getStatusBadge(selectedOrder.status)}
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
						<div className="mt-2 rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>
											{t("admin.product")}
										</TableHead>
										<TableHead className="text-right">
											{t("admin.price")}
										</TableHead>
										<TableHead className="text-right">
											{t("admin.quantity")}
										</TableHead>
										<TableHead className="text-right">
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
													<div className="flex items-center gap-3">
														<img
															src={item.product.image}
															alt={item.product.name}
															className="h-12 w-12 rounded-md object-cover"
														/>
														<div>
															<div className="font-medium">
																{item.product.name}
															</div>
														</div>
													</div>
												</TableCell>
												<TableCell className="text-right">
													{formatCurrency(item.price)}
												</TableCell>
												<TableCell className="text-right">
													{item.quantity}
												</TableCell>
												<TableCell className="text-right">
													{formatCurrency(
														item.price * item.quantity,
													)}
												</TableCell>
											</TableRow>
										))
									)}
									<TableRow>
										<TableCell
											colSpan={3}
											className="text-right font-medium">
											{t("admin.total")}
										</TableCell>
										<TableCell className="text-right font-medium">
											{formatCurrency(selectedOrder.total)}
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
