import { useTranslation } from "react-i18next";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
	ScrollArea,
	ScrollBar,
} from "@/components/ui/scroll-area";
import type { Order, ShippingAddress } from "../../types";
import { useLanguage } from "@/context/LanguageContext";

interface OrderListProps {
	orders: Order[];
	isLoading: boolean;
	onViewDetails: (order: Order) => void;
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

export const OrderList = ({
	orders,
	isLoading,
	onViewDetails,
	formatDate,
	formatTime,
	formatCurrency,
	getStatusBadge,
	getShippingAddressProperty,
}: OrderListProps) => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();

	if (isLoading) {
		return (
			<div className="rounded-md border">
				<ScrollArea
					dir={isRTL ? "rtl" : "ltr"}
					className="w-full">
					{" "}
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-start whitespace-nowrap">
									{t("admin.orderId")}
								</TableHead>
								<TableHead className="text-start whitespace-nowrap">
									{t("admin.customer")}
								</TableHead>
								<TableHead className="text-start whitespace-nowrap">
									{t("admin.date")}
								</TableHead>
								<TableHead className="text-start whitespace-nowrap">
									{t("admin.status")}
								</TableHead>
								<TableHead className="text-start whitespace-nowrap">
									{t("admin.total")}
								</TableHead>
								<TableHead className="text-start whitespace-nowrap">
									{t("admin.actions")}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Array.from({ length: 5 }).map((_, index) => (
								<TableRow key={index}>
									<TableCell>
										<Skeleton className="h-4 w-[80px]" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-[150px]" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-[120px]" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-[100px]" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-[80px]" />
									</TableCell>
									<TableCell>
										<div className="flex justify-end">
											<Skeleton className="h-8 w-8" />
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</div>
		);
	}

	return (
		<div className="rounded-md border">
			<ScrollArea
				dir={isRTL ? "rtl" : "ltr"}
				className="w-full">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-start whitespace-nowrap">
								{t("admin.orderId")}
							</TableHead>
							<TableHead className="text-start whitespace-nowrap">
								{t("admin.customer")}
							</TableHead>
							<TableHead className="text-start whitespace-nowrap">
								{t("admin.date")}
							</TableHead>
							<TableHead className="text-start whitespace-nowrap">
								{t("admin.status")}
							</TableHead>
							<TableHead className="text-start whitespace-nowrap">
								{t("admin.total")}
							</TableHead>
							<TableHead className="text-start whitespace-nowrap">
								{t("admin.actions")}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orders.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center">
									{t("admin.noOrders")}
								</TableCell>
							</TableRow>
						) : (
							orders.map((order) => (
								<TableRow key={order.id}>
									<TableCell className="font-medium whitespace-nowrap">
										#{order.id}
									</TableCell>
									<TableCell className="max-w-[180px] truncate">
										{getShippingAddressProperty(
											order,
											"name",
											order.shipping_address?.email || "",
										)}
									</TableCell>
									<TableCell className="whitespace-nowrap">
										<div className="flex flex-col">
											<span>
												{formatDate(order.created_at)}
											</span>
											<span className="text-sm text-muted-foreground">
												{formatTime(order.created_at)}
											</span>
										</div>
									</TableCell>
									<TableCell className="whitespace-nowrap">
										{getStatusBadge(order.status)}
									</TableCell>
									<TableCell className="whitespace-nowrap">
										{formatCurrency(order.total)}
									</TableCell>
									<TableCell className="whitespace-nowrap">
										<div className="flex justify-start">
											<Button
												variant="ghost"
												size="icon"
												onClick={() =>
													onViewDetails(order)
												}>
												<Eye className="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
};
