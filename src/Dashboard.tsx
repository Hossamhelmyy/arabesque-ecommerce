import React from "react";
import useDashboard from "@/features/admin/hooks/useDashboard";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Activity,
	CreditCard,
	DollarSign,
	Package,
	ShoppingBag,
	TrendingDown,
	TrendingUp,
	Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
	Cell,
	Legend,
	PieChart,
	Pie,
	Sector,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// Component for stat cards with consistent styling
const StatCard = ({
	title,
	value,
	description,
	icon,
	trend,
	isLoading,
}: {
	title: string;
	value: string | number;
	description: string;
	icon: React.ReactNode;
	trend?: { value: number; isPositive: boolean };
	isLoading?: boolean;
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

const Dashboard = () => {
	const {
		stats,
		salesData,
		categoryData,
		topProducts,
		recentOrders,
		isLoading,
		formatPrice,
	} = useDashboard();

	return (
		<div className="space-y-6 animate-in fade-in">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Dashboard
				</h1>
				<p className="text-muted-foreground mt-1">
					Overview of your store's performance
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Revenue"
					value={
						isLoading ? "--" : formatPrice(stats.revenue)
					}
					description="Lifetime revenue"
					icon={<DollarSign className="h-4 w-4" />}
					trend={stats.revenueTrend}
					isLoading={isLoading}
				/>
				<StatCard
					title="Orders"
					value={isLoading ? "--" : stats.orders}
					description="Total orders"
					icon={<ShoppingBag className="h-4 w-4" />}
					trend={stats.ordersTrend}
					isLoading={isLoading}
				/>
				<StatCard
					title="Products"
					value={isLoading ? "--" : stats.products}
					description="Products in store"
					icon={<Package className="h-4 w-4" />}
					isLoading={isLoading}
				/>
				<StatCard
					title="Customers"
					value={isLoading ? "--" : stats.customers}
					description="Registered users"
					icon={<Users className="h-4 w-4" />}
					trend={stats.customersTrend}
					isLoading={isLoading}
				/>
			</div>

			{/* Charts Section */}
			<Tabs defaultValue="overview" className="space-y-4">
				<TabsList>
					<TabsTrigger value="overview">
						Overview
					</TabsTrigger>
					<TabsTrigger value="analytics">
						Analytics
					</TabsTrigger>
					<TabsTrigger value="reports">Reports</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
						{/* Sales Chart */}
						<Card className="lg:col-span-4">
							<CardHeader>
								<CardTitle>Sales Overview</CardTitle>
								<CardDescription>
									Revenue trends for the current period
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
													`$${value}`,
													"Revenue",
												]}
												labelFormatter={(label) =>
													`Date: ${label}`
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
								<CardTitle>Categories</CardTitle>
								<CardDescription>
									Sales distribution by category
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
												data={categoryData}
												cx="50%"
												cy="50%"
												outerRadius={80}
												fill="hsl(var(--primary))"
												dataKey="value"
												nameKey="name"
												label={({ name, percent }) =>
													`${name}: ${(
														percent * 100
													).toFixed(0)}%`
												}>
												{categoryData.map(
													(entry, index) => (
														<Cell
															key={`cell-${index}`}
															fill={`hsl(${
																(index * 40) % 360
															}, 70%, 60%)`}
														/>
													),
												)}
											</Pie>
											<Tooltip
												formatter={(value) => [
													`${value}`,
													"Sales",
												]}
											/>
										</PieChart>
									</ResponsiveContainer>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Top Products and Recent Orders */}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
						{/* Top Products */}
						<Card className="lg:col-span-4">
							<CardHeader>
								<CardTitle>Top Products</CardTitle>
								<CardDescription>
									Best performing products by sales
								</CardDescription>
							</CardHeader>
							<CardContent>
								{isLoading ? (
									Array(5)
										.fill(0)
										.map((_, i) => (
											<div
												key={i}
												className="flex items-center py-2 border-b">
												<Skeleton className="h-10 w-10 rounded-md mr-3" />
												<div className="flex-1">
													<Skeleton className="h-4 w-[140px] mb-1" />
													<Skeleton className="h-3 w-[100px]" />
												</div>
												<Skeleton className="h-4 w-[60px]" />
											</div>
										))
								) : (
									<div className="space-y-2">
										{topProducts.map((product, index) => (
											<div
												key={index}
												className="flex items-center py-2 border-b last:border-0">
												<div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex items-center justify-center mr-3">
													{product.image ? (
														<img
															src={product.image}
															alt={product.name}
															className="h-full w-full object-cover"
														/>
													) : (
														<Package className="h-5 w-5 text-muted-foreground" />
													)}
												</div>
												<div className="flex-1">
													<p className="font-medium line-clamp-1">
														{product.name}
													</p>
													<p className="text-xs text-muted-foreground">
														{product.category}
													</p>
												</div>
												<p className="font-medium">
													{formatPrice(product.revenue)}
												</p>
											</div>
										))}
									</div>
								)}
							</CardContent>
						</Card>

						{/* Recent Orders */}
						<Card className="lg:col-span-3">
							<CardHeader>
								<CardTitle>Recent Orders</CardTitle>
								<CardDescription>
									Latest customer orders
								</CardDescription>
							</CardHeader>
							<CardContent>
								{isLoading ? (
									Array(5)
										.fill(0)
										.map((_, i) => (
											<div
												key={i}
												className="flex items-center py-2 border-b">
												<Skeleton className="h-8 w-8 rounded-full mr-3" />
												<div className="flex-1">
													<Skeleton className="h-4 w-[120px] mb-1" />
													<Skeleton className="h-3 w-[80px]" />
												</div>
												<Skeleton className="h-4 w-[50px]" />
											</div>
										))
								) : (
									<div className="space-y-2">
										{recentOrders.map((order, index) => (
											<div
												key={index}
												className="flex items-center py-2 border-b last:border-0">
												<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
													<CreditCard className="h-4 w-4 text-primary" />
												</div>
												<div className="flex-1">
													<p className="font-medium text-sm">
														{order.customer}
													</p>
													<p className="text-xs text-muted-foreground">
														{order.date} • {order.items}{" "}
														items
													</p>
												</div>
												<p className="font-medium text-sm">
													{formatPrice(order.total)}
												</p>
											</div>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="analytics">
					<Card>
						<CardHeader>
							<CardTitle>Analytics</CardTitle>
							<CardDescription>
								Detailed performance metrics for your store
							</CardDescription>
						</CardHeader>
						<CardContent className="pl-2">
							{/* Analytics content can be expanded in future updates */}
							<div className="flex items-center justify-center h-[400px] text-muted-foreground">
								Advanced analytics coming soon
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="reports">
					<Card>
						<CardHeader>
							<CardTitle>Reports</CardTitle>
							<CardDescription>
								Generate and download reports
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<div className="flex items-center justify-between py-3 border-b">
									<div>
										<p className="font-medium">
											Sales Report
										</p>
										<p className="text-sm text-muted-foreground">
											Complete overview of sales data
										</p>
									</div>
									<Button variant="outline" size="sm">
										Generate
									</Button>
								</div>
								<div className="flex items-center justify-between py-3 border-b">
									<div>
										<p className="font-medium">
											Inventory Status
										</p>
										<p className="text-sm text-muted-foreground">
											Current stock levels and alerts
										</p>
									</div>
									<Button variant="outline" size="sm">
										Generate
									</Button>
								</div>
								<div className="flex items-center justify-between py-3">
									<div>
										<p className="font-medium">
											Customer Analytics
										</p>
										<p className="text-sm text-muted-foreground">
											User behavior and demographics
										</p>
									</div>
									<Button variant="outline" size="sm">
										Generate
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Dashboard;
