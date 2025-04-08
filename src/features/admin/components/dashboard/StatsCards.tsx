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
	DollarSign,
	TrendingUp,
	TrendingDown,
} from "lucide-react";
import type { DashboardStats } from "../../types";

interface StatsCardsProps {
	stats: DashboardStats;
	isLoading: boolean;
	formatCurrency: (amount: number) => string;
}

const StatCard = ({
	title,
	value,
	description,
	icon,
	trend,
	isLoading,
}: {
	title: string;
	value: string;
	description: string;
	icon: React.ReactNode;
	trend?: { value: number; isPositive: boolean };
	isLoading: boolean;
}) => (
	<Card>
		<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
			<CardTitle className="text-sm font-medium">
				{title}
			</CardTitle>
			<div className="h-8 w-8 rounded-full bg-primary/10 p-1.5 text-primary flex items-center justify-center">
				{icon}
			</div>
		</CardHeader>
		<CardContent>
			{isLoading ? (
				<>
					<Skeleton className="h-8 w-[120px] mb-1" />
					<Skeleton className="h-4 w-[140px]" />
				</>
			) : (
				<>
					<div className="text-2xl font-bold">{value}</div>
					<p className="text-xs text-muted-foreground flex items-center gap-1">
						{trend && (
							<span
								className={
									trend.isPositive
										? "text-green-500"
										: "text-red-500"
								}>
								{trend.isPositive ? (
									<TrendingUp className="h-3 w-3 inline" />
								) : (
									<TrendingDown className="h-3 w-3 inline" />
								)}
								{Math.abs(trend.value).toFixed(1)}%
							</span>
						)}
						<span>{description}</span>
					</p>
				</>
			)}
		</CardContent>
	</Card>
);

export const StatsCards = ({
	stats,
	isLoading,
	formatCurrency,
}: StatsCardsProps) => {
	const { t } = useTranslation();

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<StatCard
				title={t("admin.totalRevenue")}
				value={formatCurrency(stats.revenue || 0)}
				description={t("admin.totalRevenueDesc")}
				icon={<DollarSign className="h-4 w-4" />}
				trend={stats.revenueTrend}
				isLoading={isLoading}
			/>
			<StatCard
				title={t("admin.totalOrders")}
				value={stats.totalOrders.toString()}
				description={t("admin.totalOrdersDesc")}
				icon={<ShoppingBag className="h-4 w-4" />}
				trend={stats.ordersTrend}
				isLoading={isLoading}
			/>
			<StatCard
				title={t("admin.totalProducts")}
				value={stats.totalProducts.toString()}
				description={t("admin.totalProductsDesc")}
				icon={<Package className="h-4 w-4" />}
				isLoading={isLoading}
			/>
			<StatCard
				title={t("admin.totalCustomers")}
				value={stats.totalUsers.toString()}
				description={t("admin.totalCustomersDesc")}
				icon={<Users className="h-4 w-4" />}
				trend={stats.customersTrend}
				isLoading={isLoading}
			/>
		</div>
	);
};
