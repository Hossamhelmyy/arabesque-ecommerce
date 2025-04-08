import { useTranslation } from "react-i18next";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { RecentOrder } from "../../types";

// Valid badge variants based on the UI components available
type BadgeVariant =
	| "default"
	| "secondary"
	| "destructive"
	| "outline";

interface RecentOrdersListProps {
	orders: RecentOrder[];
	isLoading: boolean;
	formatDate: (date: string) => string;
	formatCurrency: (amount: number) => string;
	getStatusBadge: (status: string) => {
		status: string;
		variant: string;
	};
}

export const RecentOrdersList = ({
	orders,
	isLoading,
	formatDate,
	formatCurrency,
	getStatusBadge,
}: RecentOrdersListProps) => {
	const { t } = useTranslation();

	// Helper to map any variant string to valid BadgeVariant
	const mapToBadgeVariant = (
		variant: string,
	): BadgeVariant => {
		switch (variant) {
			case "success":
				return "default"; // Map success to default green
			case "warning":
				return "secondary"; // Map warning to secondary orange
			case "destructive":
				return "destructive";
			case "outline":
				return "outline";
			default:
				return "default";
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("admin.recentOrders")}</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-start">
									{t("admin.orderId")}
								</TableHead>
								<TableHead className="text-start">
									{t("admin.date")}
								</TableHead>
								<TableHead className="text-start">
									{t("admin.status")}
								</TableHead>
								<TableHead className="text-start">
									{t("admin.total")}
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
										<Skeleton className="h-4 w-[120px]" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-5 w-[80px]" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-[70px] ml-auto" />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-start">
									{t("admin.orderId")}
								</TableHead>
								<TableHead className="text-start">
									{t("admin.date")}
								</TableHead>
								<TableHead className="text-start">
									{t("admin.status")}
								</TableHead>
								<TableHead className="text-start">
									{t("admin.total")}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orders.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={4}
										className="text-center">
										{t("admin.noRecentOrders")}
									</TableCell>
								</TableRow>
							) : (
								orders.map((order) => (
									<TableRow key={order.id}>
										<TableCell className="font-medium">
											#{order.orderNumber}
										</TableCell>
										<TableCell>
											{formatDate(order.date)}
										</TableCell>
										<TableCell>
											{(() => {
												const badgeInfo = getStatusBadge(
													order.status,
												);
												return (
													<Badge
														variant={mapToBadgeVariant(
															badgeInfo.variant,
														)}>
														{badgeInfo.status}
													</Badge>
												);
											})()}
										</TableCell>
										<TableCell>
											{formatCurrency(order.total)}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
};
