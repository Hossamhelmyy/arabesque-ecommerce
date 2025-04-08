import { useTranslation } from "react-i18next";
import { useDashboard } from "../hooks/useDashboard";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { StatsCards } from "../components/dashboard/StatsCards";
import { SalesChart } from "../components/dashboard/SalesChart";
import { RecentOrdersList } from "../components/dashboard/RecentOrdersList";
import { TopProductsList } from "../components/dashboard/TopProductsList";
import { useEffect, useMemo, useState } from "react";
import type { ChartData, TopProduct } from "../types";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Tooltip,
	Area,
	AreaChart,
	XAxis,
	YAxis,
	CartesianGrid,
	BarChart,
	Bar,
	Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const DashboardView = () => {
	const { t } = useTranslation();
	const {
		stats,
		recentOrders,
		topProducts: productPerformanceData,
		salesData: rawSalesData,
		categories,
		isLoading,
		formatCurrency,
		formatDate,
		getStatusBadge,
	} = useDashboard();

	// Convert SalesDataPoint to chart data
	const salesData = useMemo(() => {
		return rawSalesData.map((item) => ({
			name: item.month,
			revenue: item.sales,
		}));
	}, [rawSalesData]);

	// Convert ProductPerformancePoint to TopProduct
	const topProducts = useMemo(() => {
		return productPerformanceData.map((item) => ({
			id: item.id,
			name: item.name,
			category: item.category,
			price: item.price,
			quantity: item.sales,
			total: item.revenue,
			image: item.image,
		}));
	}, [productPerformanceData]);

	// Category colors for pie chart
	const CATEGORY_COLORS = {
		Electronics: "#FFB74D",
		Clothing: "#FF8A65",
		Sports: "#4DD0E1",
		Beauty: "#81C784",
		Home: "#AED581",
		Uncategorized: "#90A4AE",
	};

	// Format percentage for categories
	const formatPercentage = (value: number) =>
		`${Math.round(value)}%`;

	return (
		<div className="space-y-6 animate-in fade-in">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					{t("admin.dashboard")}
				</h1>
				<p className="text-muted-foreground mt-1">
					{t("admin.dashboardDescription")}
				</p>
			</div>

			{/* Stats Cards */}
			<StatsCards
				stats={stats}
				isLoading={isLoading}
				formatCurrency={formatCurrency}
			/>

			{/* Tabs */}
			<Tabs defaultValue="overview" className="space-y-4">
				<TabsList>
					<TabsTrigger value="overview">
						{t("admin.overview")}
					</TabsTrigger>
					<TabsTrigger value="analytics">
						{t("admin.analytics")}
					</TabsTrigger>
					<TabsTrigger value="reports">
						{t("admin.reports")}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
						{/* Sales Chart */}
						<Card className="lg:col-span-4">
							<CardHeader>
								<CardTitle>
									{t("admin.salesOverview")}
								</CardTitle>
								<CardDescription>
									{t("admin.salesOverviewDescription")}
								</CardDescription>
							</CardHeader>
							<CardContent className="pl-2">
								{isLoading ? (
									<div className="w-full h-[300px] flex items-center justify-center">
										<Skeleton className="h-[250px] w-full" />
									</div>
								) : (
									<ResponsiveContainer
										width="100%"
										height={300}>
										<AreaChart
											data={salesData}
											margin={{
												top: 10,
												right: 30,
												left: 0,
												bottom: 0,
											}}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="name" />
											<YAxis />
											<Tooltip
												formatter={(value) => [
													formatCurrency(value as number),
													t("admin.revenue"),
												]}
												labelFormatter={(label) =>
													`${t("admin.date")}: ${label}`
												}
											/>
											<Area
												type="monotone"
												dataKey="revenue"
												stroke="hsl(var(--primary))"
												fill="hsl(var(--primary) / 0.2)"
											/>
										</AreaChart>
									</ResponsiveContainer>
								)}
							</CardContent>
						</Card>

						{/* Category Distribution */}
						<Card className="lg:col-span-3">
							<CardHeader>
								<CardTitle>
									{t("admin.categories")}
								</CardTitle>
								<CardDescription>
									{t("admin.categoriesDescription")}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex items-center justify-center">
								{isLoading ? (
									<div className="h-[250px] w-[250px] relative">
										<Skeleton className="h-full w-full rounded-full" />
									</div>
								) : (
									<ResponsiveContainer
										width="100%"
										height={250}>
										<PieChart>
											<Pie
												data={categories}
												cx="50%"
												cy="50%"
												outerRadius={80}
												fill="hsl(var(--primary))"
												dataKey="value"
												nameKey="name"
												label={({ name, percent }) =>
													`${name}: ${formatPercentage(
														percent * 100,
													)}`
												}>
												{categories.map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={
															CATEGORY_COLORS[
																entry.name as keyof typeof CATEGORY_COLORS
															] ||
															`hsl(${
																(index * 40) % 360
															}, 70%, 60%)`
														}
													/>
												))}
											</Pie>
											<Tooltip
												formatter={(value) => [
													formatCurrency(value as number),
													t("admin.sales"),
												]}
											/>
										</PieChart>
									</ResponsiveContainer>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Top Products and Recent Orders */}
					<div className="grid gap-4 md:grid-cols-2">
						<TopProductsList
							products={topProducts}
							isLoading={isLoading}
							formatCurrency={formatCurrency}
						/>
						<RecentOrdersList
							orders={recentOrders}
							isLoading={isLoading}
							formatCurrency={formatCurrency}
							formatDate={formatDate}
							getStatusBadge={getStatusBadge}
						/>
					</div>
				</TabsContent>

				<TabsContent value="analytics">
					<div className="grid gap-4">
						{/* Revenue Analysis */}
						<Card>
							<CardHeader>
								<CardTitle>
									{t("admin.revenueAnalysis")}
								</CardTitle>
								<CardDescription>
									{t("admin.revenueAnalysisDescription")}
								</CardDescription>
							</CardHeader>
							<CardContent>
								{isLoading ? (
									<Skeleton className="h-[400px] w-full" />
								) : (
									<ResponsiveContainer
										width="100%"
										height={400}>
										<BarChart data={salesData}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="name" />
											<YAxis />
											<Tooltip
												formatter={(value) => [
													formatCurrency(value as number),
													t("admin.revenue"),
												]}
											/>
											<Legend />
											<Bar
												dataKey="revenue"
												fill="hsl(var(--primary))"
												name={t("admin.monthlyRevenue")}
											/>
										</BarChart>
									</ResponsiveContainer>
								)}
							</CardContent>
						</Card>

						{/* Category Performance */}
						<Card>
							<CardHeader>
								<CardTitle>
									{t("admin.categoryPerformance")}
								</CardTitle>
								<CardDescription>
									{t(
										"admin.categoryPerformanceDescription",
									)}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{categories.map((category) => (
										<div
											key={category.name}
											className="flex items-center justify-between">
											<div className="space-y-1">
												<p className="text-sm font-medium">
													{category.name}
												</p>
												<p className="text-sm text-muted-foreground">
													{formatCurrency(category.value)}
												</p>
											</div>
											<div className="w-32">
												<div className="h-2 rounded-full bg-primary/20">
													<div
														className="h-full rounded-full bg-primary"
														style={{
															width: `${
																(category.value /
																	Math.max(
																		...categories.map(
																			(c) => c.value,
																		),
																	)) *
																100
															}%`,
														}}
													/>
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="reports">
					<div className="grid gap-4">
						{/* Sales Report */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div className="space-y-1">
										<CardTitle>
											{t("admin.salesReport")}
										</CardTitle>
										<CardDescription>
											{t("admin.salesReportDescription")}
										</CardDescription>
									</div>
									<Button size="sm">
										<Download className="h-4 w-4 mr-2" />
										{t("admin.downloadReport")}
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="grid gap-4 md:grid-cols-3">
										<Card>
											<CardHeader>
												<CardTitle className="text-sm">
													{t("admin.totalSales")}
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="text-2xl font-bold">
													{formatCurrency(
														stats.totalSales || 0,
													)}
												</div>
											</CardContent>
										</Card>
										<Card>
											<CardHeader>
												<CardTitle className="text-sm">
													{t("admin.averageOrderValue")}
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="text-2xl font-bold">
													{formatCurrency(
														stats.totalRevenue /
															stats.totalOrders || 0,
													)}
												</div>
											</CardContent>
										</Card>
										<Card>
											<CardHeader>
												<CardTitle className="text-sm">
													{t("admin.conversionRate")}
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="text-2xl font-bold">
													{formatPercentage(
														(stats.totalOrders /
															stats.totalUsers) *
															100 || 0,
													)}
												</div>
											</CardContent>
										</Card>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};
