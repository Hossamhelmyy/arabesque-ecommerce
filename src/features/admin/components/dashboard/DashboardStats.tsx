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
} from "lucide-react";
import type { DashboardStats as DashboardStatsType } from "../../types";

interface DashboardStatsProps {
	stats: DashboardStatsType;
	isLoading: boolean;
	formatCurrency: (value: number) => string;
}

export const DashboardStats = ({
	stats,
	isLoading,
	formatCurrency,
}: DashboardStatsProps) => {
	const { t } = useTranslation();

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						{t("admin.totalRevenue")}
					</CardTitle>
					<DollarSign className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<Skeleton className="h-7 w-32" />
					) : (
						<div className="text-2xl font-bold">
							{formatCurrency(stats.totalRevenue)}
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						{t("admin.totalOrders")}
					</CardTitle>
					<ShoppingBag className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<Skeleton className="h-7 w-10" />
					) : (
						<div className="text-2xl font-bold">
							{stats.totalOrders}
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						{t("admin.totalProducts")}
					</CardTitle>
					<Package className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<Skeleton className="h-7 w-10" />
					) : (
						<div className="text-2xl font-bold">
							{stats.totalProducts}
						</div>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						{t("admin.totalUsers")}
					</CardTitle>
					<Users className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<Skeleton className="h-7 w-10" />
					) : (
						<div className="text-2xl font-bold">
							{stats.totalUsers}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};
