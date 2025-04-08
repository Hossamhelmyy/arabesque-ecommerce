import { useTranslation } from "react-i18next";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Users,
	ShoppingBag,
	Package,
	CreditCard,
} from "lucide-react";
import type { DashboardStats } from "../../types";

interface StatsCardsProps {
	stats: DashboardStats;
	isLoading: boolean;
	formatCurrency: (amount: number) => string;
}

export const StatsCards = ({
	stats,
	isLoading,
	formatCurrency,
}: StatsCardsProps) => {
	const { t } = useTranslation();

	const items = [
		{
			title: t("admin.totalSales"),
			value: formatCurrency(stats.totalSales),
			description: t("admin.totalSalesDesc"),
			icon: (
				<CreditCard className="h-5 w-5 text-muted-foreground" />
			),
		},
		{
			title: t("admin.totalOrders"),
			value: stats.totalOrders.toString(),
			description: t("admin.totalOrdersDesc"),
			icon: (
				<ShoppingBag className="h-5 w-5 text-muted-foreground" />
			),
		},
		{
			title: t("admin.totalCustomers"),
			value: stats.totalUsers.toString(),
			description: t("admin.totalCustomersDesc"),
			icon: (
				<Users className="h-5 w-5 text-muted-foreground" />
			),
		},
		{
			title: t("admin.totalProducts"),
			value: stats.totalProducts.toString(),
			description: t("admin.totalProductsDesc"),
			icon: (
				<Package className="h-5 w-5 text-muted-foreground" />
			),
		},
	];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{isLoading
				? Array.from({ length: 4 }).map((_, index) => (
						<Card key={index}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									<Skeleton className="h-4 w-[120px]" />
								</CardTitle>
								<Skeleton className="h-5 w-5 rounded-full" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-7 w-[100px] mb-1" />
								<Skeleton className="h-4 w-[180px]" />
							</CardContent>
						</Card>
				  ))
				: items.map((item, index) => (
						<Card key={index}>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									{item.title}
								</CardTitle>
								{item.icon}
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{item.value}
								</div>
								<p className="text-xs text-muted-foreground">
									{item.description}
								</p>
							</CardContent>
						</Card>
				  ))}
		</div>
	);
};
