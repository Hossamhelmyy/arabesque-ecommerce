import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import type {
	DashboardStats,
	SalesDataPoint,
	ProductPerformancePoint,
	Order,
	RecentOrder,
} from "../types";
import type { Database } from "@/integrations/supabase/types";

type OrderRow =
	Database["public"]["Tables"]["orders"]["Row"];

type OrderItemWithProduct = {
	quantity: number;
	unit_price: number;
	product: {
		id: string;
		name: string;
		price: number;
		image: string;
		category: {
			name: string;
		} | null;
	} | null;
};

type DatabaseOrderItem = {
	quantity: number;
	unit_price: number;
	product: {
		id: string;
		name: string;
		price: number;
		image: string;
		category: {
			name: string;
		} | null;
	};
};

type OrderItemData = {
	quantity: number;
	unit_price: number;
	product: {
		id: string;
		name: string;
		category: string;
	} | null;
};

type RecentOrderData = {
	id: string;
	order_number: string | null;
	total: number | null;
	status: string | null;
	created_at: string;
	user: {
		first_name: string | null;
		last_name: string | null;
	} | null;
};

export const useDashboard = () => {
	const [stats, setStats] = useState<DashboardStats>({
		totalUsers: 0,
		totalProducts: 0,
		totalOrders: 0,
		totalRevenue: 0,
		totalSales: 0,
		revenue: 0,
		revenueTrend: { value: 0, isPositive: true },
		ordersTrend: { value: 0, isPositive: true },
		customersTrend: { value: 0, isPositive: true },
	});
	const [isLoading, setIsLoading] = useState(true);
	const [recentOrders, setRecentOrders] = useState<
		RecentOrder[]
	>([]);
	const [isRecentOrdersLoading, setIsRecentOrdersLoading] =
		useState(true);
	const [topProducts, setTopProducts] = useState<
		ProductPerformancePoint[]
	>([]);
	const [isTopProductsLoading, setIsTopProductsLoading] =
		useState(true);
	const [salesData, setSalesData] = useState<
		SalesDataPoint[]
	>([]);
	const [categories, setCategories] = useState<
		{ name: string; value: number }[]
	>([]);
	const { toast } = useToast();

	const fetchStats = useCallback(async () => {
		try {
			setIsLoading(true);

			// Fetch user count and trend
			const {
				count: currentUsersCount,
				error: usersError,
			} = await supabase
				.from("profiles")
				.select("*", { count: "exact", head: true });

			if (usersError) throw usersError;

			const prevMonthStart = new Date();
			prevMonthStart.setMonth(
				prevMonthStart.getMonth() - 1,
			);
			prevMonthStart.setDate(1);
			const { count: prevMonthUsersCount } = await supabase
				.from("profiles")
				.select("*", { count: "exact", head: true })
				.lt("created_at", prevMonthStart.toISOString());

			const customersTrend = prevMonthUsersCount
				? ((currentUsersCount - prevMonthUsersCount) /
						prevMonthUsersCount) *
				  100
				: 0;

			// Fetch product count
			const { count: productsCount, error: productsError } =
				await supabase
					.from("products")
					.select("*", { count: "exact", head: true });

			if (productsError) throw productsError;

			// Fetch current month orders and revenue
			const currentMonth = new Date()
				.toISOString()
				.slice(0, 7);
			const {
				data: currentMonthOrders,
				error: currentOrdersError,
			} = await supabase
				.from("orders")
				.select("total")
				.gte("created_at", `${currentMonth}-01`);

			if (currentOrdersError) throw currentOrdersError;

			const currentRevenue = currentMonthOrders.reduce(
				(sum, order) => sum + (order.total || 0),
				0,
			);

			// Fetch previous month orders and revenue
			const prevMonth = new Date();
			prevMonth.setMonth(prevMonth.getMonth() - 1);
			const prevMonthStr = prevMonth
				.toISOString()
				.slice(0, 7);
			const {
				data: prevMonthOrders,
				error: prevOrdersError,
			} = await supabase
				.from("orders")
				.select("total")
				.gte("created_at", `${prevMonthStr}-01`)
				.lt("created_at", `${currentMonth}-01`);

			if (prevOrdersError) throw prevOrdersError;

			const prevRevenue = prevMonthOrders.reduce(
				(sum, order) => sum + (order.total || 0),
				0,
			);

			// Calculate trends
			const revenueTrend = prevRevenue
				? ((currentRevenue - prevRevenue) / prevRevenue) *
				  100
				: 0;
			const ordersTrend = prevMonthOrders.length
				? ((currentMonthOrders.length -
						prevMonthOrders.length) /
						prevMonthOrders.length) *
				  100
				: 0;

			// Fetch total orders and revenue
			const { data: allOrders, error: allOrdersError } =
				await supabase.from("orders").select("total");

			if (allOrdersError) throw allOrdersError;

			const totalRevenue = allOrders.reduce(
				(sum, order) => sum + (order.total || 0),
				0,
			);

			setStats({
				totalUsers: currentUsersCount || 0,
				totalProducts: productsCount || 0,
				totalOrders: allOrders.length || 0,
				totalRevenue,
				totalSales: currentRevenue,
				revenue: currentRevenue,
				revenueTrend: {
					value: revenueTrend,
					isPositive: revenueTrend >= 0,
				},
				ordersTrend: {
					value: ordersTrend,
					isPositive: ordersTrend >= 0,
				},
				customersTrend: {
					value: customersTrend,
					isPositive: customersTrend >= 0,
				},
			});
		} catch (error) {
			console.error(
				"Error fetching dashboard stats:",
				error,
			);
			toast({
				title: "Error",
				description:
					"Failed to fetch dashboard statistics.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}, [toast]);

	const fetchRecentOrders = useCallback(async () => {
		try {
			setIsRecentOrdersLoading(true);
			const { data, error } = await supabase
				.from("orders")
				.select(
					`
					id,
					order_number,
					total,
					status,
					created_at,
					user:profiles (
						first_name,
						last_name
					)
				`,
				)
				.order("created_at", { ascending: false })
				.limit(5);

			if (error) throw error;

			// Transform the data to match the RecentOrder type
			const transformedOrders: RecentOrder[] = (
				data as unknown as RecentOrderData[]
			).map((order) => ({
				id: order.id,
				orderNumber:
					order.order_number ||
					`ORD-${order.id.substring(0, 8)}`,
				customerName: order.user
					? `${order.user.first_name || ""} ${
							order.user.last_name || ""
					  }`.trim() || "Unknown Customer"
					: "Unknown Customer",
				date: order.created_at,
				total: order.total || 0,
				status: order.status || "pending",
			}));

			setRecentOrders(transformedOrders);
		} catch (error) {
			console.error("Error fetching recent orders:", error);
			toast({
				title: "Error",
				description: "Failed to fetch recent orders.",
				variant: "destructive",
			});
		} finally {
			setIsRecentOrdersLoading(false);
		}
	}, [toast]);

	const fetchTopProducts = useCallback(async () => {
		try {
			setIsTopProductsLoading(true);

			// Fetch order items with product details
			const { data: orderItems, error } =
				await supabase.from("order_items").select(`
					quantity,
					unit_price,
					product:products (
						id,
						name,
						price,
						image,
						category:categories (
							name
						)
					)
				`);

			if (error) throw error;

			// Aggregate data by product
			const productMap: Record<
				string,
				{
					name: string;
					sales: number;
					revenue: number;
					price: number;
					image: string;
					category: string;
				}
			> = {};

			const typedOrderItems =
				orderItems as unknown as DatabaseOrderItem[];

			typedOrderItems.forEach((item) => {
				if (!item.product) return;

				const productId = item.product.id;
				if (!productId) return;

				if (!productMap[productId]) {
					productMap[productId] = {
						name: item.product.name || "Unknown Product",
						sales: 0,
						revenue: 0,
						price: item.product.price || 0,
						image: item.product.image || "/placeholder.svg",
						category:
							item.product.category?.name ||
							"Uncategorized",
					};
				}

				productMap[productId].sales += item.quantity || 0;
				productMap[productId].revenue +=
					(item.quantity || 0) * (item.unit_price || 0);
			});

			// Convert to array and sort by revenue
			const topProducts = Object.entries(productMap)
				.map(([id, data]) => ({
					id,
					name: data.name,
					sales: data.sales,
					revenue: data.revenue,
					price: data.price,
					image: data.image,
					category: data.category,
				}))
				.sort((a, b) => b.revenue - a.revenue)
				.slice(0, 5);

			setTopProducts(topProducts);
		} catch (error) {
			console.error("Error fetching top products:", error);
			toast({
				title: "Error",
				description: "Failed to fetch top products.",
				variant: "destructive",
			});
		} finally {
			setIsTopProductsLoading(false);
		}
	}, [toast]);

	const fetchSalesData = useCallback(async () => {
		try {
			// Fetch orders with creation dates
			const { data: ordersData, error } = await supabase
				.from("orders")
				.select("total, created_at");

			if (error) throw error;

			// Group orders by month
			const monthlyData: Record<string, number> = {};

			(ordersData as unknown as OrderRow[]).forEach(
				(order) => {
					const date = new Date(order.created_at || "");
					const monthYear = `${date.toLocaleString(
						"default",
						{ month: "short" },
					)} ${date.getFullYear()}`;

					if (!monthlyData[monthYear]) {
						monthlyData[monthYear] = 0;
					}

					monthlyData[monthYear] += order.total || 0;
				},
			);

			// Convert to array format
			const salesData: SalesDataPoint[] = Object.entries(
				monthlyData,
			).map(([month, sales]) => ({
				month,
				sales,
			}));

			// Sort by date
			salesData.sort((a, b) => {
				const months = [
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec",
				];
				const aMonth = a.month.split(" ")[0];
				const aYear = parseInt(a.month.split(" ")[1]);
				const bMonth = b.month.split(" ")[0];
				const bYear = parseInt(b.month.split(" ")[1]);

				if (aYear !== bYear) {
					return aYear - bYear;
				}

				return (
					months.indexOf(aMonth) - months.indexOf(bMonth)
				);
			});

			setSalesData(salesData);
		} catch (error) {
			console.error("Error fetching sales data:", error);
			toast({
				title: "Error",
				description: "Failed to fetch sales data.",
				variant: "destructive",
			});
		}
	}, [toast]);

	const fetchCategories = useCallback(async () => {
		try {
			const { data: orderItems, error: orderItemsError } =
				await supabase.from("order_items").select(`
					quantity,
					unit_price,
					product:products (
						id,
						name,
						category:categories (
							name
						)
					)
				`);

			if (orderItemsError) throw orderItemsError;

			// Aggregate sales by category
			const categoryMap: Record<string, number> = {};
			const typedOrderItems =
				orderItems as unknown as DatabaseOrderItem[];

			typedOrderItems.forEach((item) => {
				if (!item.product) return;
				const categoryName =
					item.product.category?.name || "Uncategorized";
				const itemTotal =
					(item.quantity || 0) * (item.unit_price || 0);
				categoryMap[categoryName] =
					(categoryMap[categoryName] || 0) + itemTotal;
			});

			// Convert to array format for the pie chart
			const categoryData = Object.entries(categoryMap).map(
				([name, value]) => ({
					name,
					value,
				}),
			);

			setCategories(categoryData);
		} catch (error) {
			console.error("Error fetching category data:", error);
			toast({
				title: "Error",
				description: "Failed to fetch category data.",
				variant: "destructive",
			});
		}
	}, [toast]);

	useEffect(() => {
		const fetchData = async () => {
			await Promise.all([
				fetchStats(),
				fetchRecentOrders(),
				fetchTopProducts(),
				fetchSalesData(),
				fetchCategories(),
			]);
		};

		fetchData();
	}, [
		fetchStats,
		fetchRecentOrders,
		fetchTopProducts,
		fetchSalesData,
		fetchCategories,
	]);

	const formatDate = useCallback((date: string) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	}, []);

	const formatCurrency = useCallback((amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	}, []);

	const getStatusBadge = useCallback((status: string) => {
		// Return the badge variant as a string
		let variant = "outline";

		switch (status) {
			case "completed":
				variant = "default";
				break;
			case "processing":
				variant = "secondary";
				break;
			case "cancelled":
				variant = "destructive";
				break;
			default:
				variant = "outline";
		}

		return { status, variant };
	}, []);

	return {
		stats,
		isLoading,
		recentOrders,
		isRecentOrdersLoading,
		topProducts,
		isTopProductsLoading,
		salesData,
		categories,
		formatDate,
		formatCurrency,
		getStatusBadge,
		refreshData: async () => {
			await Promise.all([
				fetchStats(),
				fetchRecentOrders(),
				fetchTopProducts(),
				fetchSalesData(),
				fetchCategories(),
			]);
		},
	};
};
