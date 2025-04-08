import { useTranslation } from "react-i18next";
import { useDashboard } from "../hooks/useDashboard";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { StatsCards } from "../components/dashboard/StatsCards";
import { SalesChart } from "../components/dashboard/SalesChart";
import { RecentOrdersList } from "../components/dashboard/RecentOrdersList";
import { TopProductsList } from "../components/dashboard/TopProductsList";
import { useEffect, useMemo } from "react";
import type { ChartData, TopProduct } from "../types";

export const DashboardView = () => {
	const { t } = useTranslation();
	const {
		stats,
		recentOrders,
		topProducts: productPerformanceData,
		salesData: rawSalesData,
		isLoading,
		formatCurrency,
		formatDate,
		getStatusBadge,
	} = useDashboard();

	// Convert SalesDataPoint to ChartData
	const salesData = useMemo(() => {
		return rawSalesData.map((item) => ({
			name: item.month,
			total: item.sales,
		}));
	}, [rawSalesData]);

	// Convert ProductPerformancePoint to TopProduct
	const topProducts = useMemo(() => {
		return productPerformanceData.map((item, index) => ({
			id: `product-${index + 1}`,
			name: item.name,
			price: item.revenue / item.sales,
			quantity: item.sales,
			total: item.revenue,
			image: `https://placehold.co/300x300?text=${encodeURIComponent(
				item.name.substring(0, 1),
			)}`,
		}));
	}, [productPerformanceData]);

	return (
		<div className="container mx-auto py-6 space-y-8">
			<DashboardHeader />

			<StatsCards
				stats={stats}
				isLoading={isLoading}
				formatCurrency={formatCurrency}
			/>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<SalesChart
					data={salesData}
					isLoading={isLoading}
				/>

				<TopProductsList
					products={topProducts}
					isLoading={isLoading}
					formatCurrency={formatCurrency}
				/>
			</div>

			<RecentOrdersList
				orders={recentOrders}
				isLoading={isLoading}
				formatDate={formatDate}
				formatCurrency={formatCurrency}
				getStatusBadge={getStatusBadge}
			/>
		</div>
	);
};
