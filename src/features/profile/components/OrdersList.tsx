import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Loader2, HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Order } from "../types";

interface OrdersListProps {
	orders: Order[] | undefined;
	isLoading: boolean;
}

export const OrdersList = ({
	orders,
	isLoading,
}: OrdersListProps) => {
	const { t, i18n } = useTranslation();

	const getOrderStatusBadge = (status: string) => {
		switch (status) {
			case "completed":
				return (
					<Badge variant="default" className="bg-green-500">
						{t("orders.completed")}
					</Badge>
				);
			case "processing":
				return (
					<Badge
						variant="secondary"
						className="bg-blue-500 text-white">
						{t("orders.processing")}
					</Badge>
				);
			case "pending":
				return (
					<Badge variant="outline">
						{t("orders.pending")}
					</Badge>
				);
			case "cancelled":
				return (
					<Badge variant="destructive">
						{t("orders.cancelled")}
					</Badge>
				);
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat(i18n.language, {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(date);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("profile.orderHistory")}</CardTitle>
				<CardDescription>
					{t("profile.viewYourOrderHistory")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="py-8 flex justify-center">
						<Loader2 className="h-6 w-6 animate-spin text-primary" />
					</div>
				) : orders && orders.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b">
									<th className="text-left py-3 px-2">
										{t("profile.orderId")}
									</th>
									<th className="text-left py-3 px-2">
										{t("profile.orderDate")}
									</th>
									<th className="text-left py-3 px-2">
										{t("profile.orderStatus")}
									</th>
									<th className="text-left py-3 px-2">
										{t("profile.orderAmount")}
									</th>
									<th className="text-right py-3 px-2"></th>
								</tr>
							</thead>
							<tbody>
								{orders.map((order) => (
									<tr key={order.id} className="border-b">
										<td className="py-3 px-2 font-mono text-sm">
											#{order.id.substring(0, 8)}
										</td>
										<td className="py-3 px-2">
											{formatDate(order.created_at)}
										</td>
										<td className="py-3 px-2">
											{getOrderStatusBadge(order.status)}
										</td>
										<td className="py-3 px-2 font-medium">
											${order.total.toFixed(2)}
										</td>
										<td className="py-3 px-2 text-right">
											<Button variant="ghost" size="sm">
												{t("profile.viewOrder")}
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="text-center py-12">
						<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
							<HistoryIcon className="h-6 w-6 text-muted-foreground" />
						</div>
						<h3 className="font-medium mb-2">
							{t("profile.noOrders")}
						</h3>
						<p className="text-muted-foreground mb-4">
							{t("profile.noOrdersMessage")}
						</p>
						<Button asChild>
							<Link to="/products">
								{t("cart.startShopping")}
							</Link>
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
