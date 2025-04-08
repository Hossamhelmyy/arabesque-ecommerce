import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import type {
	DashboardStats,
	SalesDataPoint,
	ProductPerformancePoint,
	Order,
} from "../types";

export const useDashboard = () => {
	const [stats, setStats] = useState<DashboardStats>({
		totalUsers: 0,
		totalProducts: 0,
		totalOrders: 0,
		totalRevenue: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [recentOrders, setRecentOrders] = useState<Order[]>(
		[],
	);
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
	const { toast } = useToast();

	const fetchStats = useCallback(async () => {
		try {
			setIsLoading(true);

			// Fetch user count
			const { count: usersCount, error: usersError } =
				await supabase
					.from("users")
					.select("*", { count: "exact", head: true });

			if (usersError) throw usersError;

			// Fetch product count
			const { count: productsCount, error: productsError } =
				await supabase
					.from("products")
					.select("*", { count: "exact", head: true });

			if (productsError) throw productsError;

			// Fetch order count and total revenue
			const { data: ordersData, error: ordersError } =
				await supabase.from("orders").select("total");

			if (ordersError) throw ordersError;

			const totalRevenue = ordersData.reduce(
				(sum, order) => sum + (order.total || 0),
				0,
			);

			setStats({
				totalUsers: usersCount || 0,
				totalProducts: productsCount || 0,
				totalOrders: ordersData.length || 0,
				totalRevenue,
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
				.select("*")
				.order("created_at", { ascending: false })
				.limit(5);

			if (error) throw error;

			setRecentOrders(data || []);
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

			// This is a simplified approach assuming there's a view or analytics table
			// In a real application, you would query order items with product details
			// and aggregate them to calculate top products

			const { data, error } = await supabase
				.from("product_analytics")
				.select("name, sales, revenue")
				.order("revenue", { ascending: false })
				.limit(5);

			if (error) throw error;

			// Fallback mock data if the table doesn't exist
			if (!data || data.length === 0) {
				setTopProducts([
					{
						name: "Moroccan Dining Table",
						sales: 42,
						revenue: 12600,
					},
					{
						name: "Fez Armchair",
						sales: 38,
						revenue: 7600,
					},
					{
						name: "Marrakesh Floor Lamp",
						sales: 30,
						revenue: 4500,
					},
					{
						name: "Casablanca Cabinet",
						sales: 28,
						revenue: 11200,
					},
					{
						name: "Andalusian Coffee Table",
						sales: 25,
						revenue: 5000,
					},
				]);
			} else {
				setTopProducts(data);
			}
		} catch (error) {
			console.error("Error fetching top products:", error);
			// Use mock data as fallback
			setTopProducts([
				{
					name: "Moroccan Dining Table",
					sales: 42,
					revenue: 12600,
				},
				{ name: "Fez Armchair", sales: 38, revenue: 7600 },
				{
					name: "Marrakesh Floor Lamp",
					sales: 30,
					revenue: 4500,
				},
				{
					name: "Casablanca Cabinet",
					sales: 28,
					revenue: 11200,
				},
				{
					name: "Andalusian Coffee Table",
					sales: 25,
					revenue: 5000,
				},
			]);
		} finally {
			setIsTopProductsLoading(false);
		}
	}, [toast]);

	const fetchSalesData = useCallback(async () => {
		try {
			// This would normally be a DB query that aggregates sales by month
			// For demonstration, we'll use sample data
			const mockSalesData: SalesDataPoint[] = [
				{ month: "Jan", sales: 12000 },
				{ month: "Feb", sales: 14500 },
				{ month: "Mar", sales: 16800 },
				{ month: "Apr", sales: 18200 },
				{ month: "May", sales: 21000 },
				{ month: "Jun", sales: 25600 },
				{ month: "Jul", sales: 27800 },
				{ month: "Aug", sales: 24500 },
				{ month: "Sep", sales: 28700 },
				{ month: "Oct", sales: 31200 },
				{ month: "Nov", sales: 36800 },
				{ month: "Dec", sales: 42500 },
			];

			setSalesData(mockSalesData);
		} catch (error) {
			console.error("Error fetching sales data:", error);
			// Use mock data as fallback
			setSalesData([
				{ month: "Jan", sales: 12000 },
				{ month: "Feb", sales: 14500 },
				{ month: "Mar", sales: 16800 },
				{ month: "Apr", sales: 18200 },
				{ month: "May", sales: 21000 },
				{ month: "Jun", sales: 25600 },
			]);
		}
	}, []);

	useEffect(() => {
		fetchStats();
		fetchRecentOrders();
		fetchTopProducts();
		fetchSalesData();
	}, [
		fetchStats,
		fetchRecentOrders,
		fetchTopProducts,
		fetchSalesData,
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
		formatDate,
		formatCurrency,
		getStatusBadge,
	};
};
