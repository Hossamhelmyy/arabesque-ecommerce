import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/utils";
import {
	format,
	subMonths,
	startOfMonth,
	endOfMonth,
} from "date-fns";

// Types
interface DashboardStats {
	revenue: number;
	revenueTrend: { value: number; isPositive: boolean };
	orders: number;
	ordersTrend: { value: number; isPositive: boolean };
	products: number;
	customers: number;
	customersTrend: { value: number; isPositive: boolean };
}

interface SalesDataPoint {
	name: string;
	revenue: number;
}

interface CategoryDataPoint {
	name: string;
	value: number;
}

interface TopProduct {
	name: string;
	category: string;
	image: string | null;
	revenue: number;
}

interface RecentOrder {
	id: string;
	customer: string;
	date: string;
	items: number;
	total: number;
}

// Mock data generator helpers
const generateMockSalesData = (): SalesDataPoint[] => {
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
	return months.map((month) => ({
		name: month,
		revenue: Math.floor(Math.random() * 50000) + 10000,
	}));
};

const generateMockCategoryData =
	(): CategoryDataPoint[] => {
		const categories = [
			"Clothing",
			"Electronics",
			"Home",
			"Beauty",
			"Sports",
		];
		return categories.map((name) => ({
			name,
			value: Math.floor(Math.random() * 100) + 20,
		}));
	};

const generateMockTopProducts = (): TopProduct[] => {
	return [
		{
			name: "Wireless Headphones",
			category: "Electronics",
			image: "https://placehold.co/300x300",
			revenue: 12500,
		},
		{
			name: "Designer T-Shirt",
			category: "Clothing",
			image: "https://placehold.co/300x300",
			revenue: 9800,
		},
		{
			name: "Smart Watch",
			category: "Electronics",
			image: "https://placehold.co/300x300",
			revenue: 7200,
		},
		{
			name: "Running Shoes",
			category: "Sports",
			image: "https://placehold.co/300x300",
			revenue: 6500,
		},
		{
			name: "Skincare Set",
			category: "Beauty",
			image: null,
			revenue: 5200,
		},
	];
};

const generateMockRecentOrders = (): RecentOrder[] => {
	const customers = [
		"John Doe",
		"Jane Smith",
		"Mike Johnson",
		"Sarah Williams",
		"David Brown",
	];

	return customers.map((customer, index) => ({
		id: `ORD-${1000 + index}`,
		customer,
		date: new Date(
			Date.now() - index * 86400000,
		).toLocaleDateString(),
		items: Math.floor(Math.random() * 5) + 1,
		total: Math.floor(Math.random() * 500) + 50,
	}));
};

const useDashboard = () => {
	// Define state for dashboard data
	const [stats, setStats] = useState<DashboardStats>({
		revenue: 0,
		revenueTrend: { value: 12.5, isPositive: true },
		orders: 0,
		ordersTrend: { value: 8.2, isPositive: true },
		products: 0,
		customers: 0,
		customersTrend: { value: 5.1, isPositive: true },
	});

	const [salesData, setSalesData] = useState<
		SalesDataPoint[]
	>([]);
	const [categoryData, setCategoryData] = useState<
		CategoryDataPoint[]
	>([]);
	const [topProducts, setTopProducts] = useState<
		TopProduct[]
	>([]);
	const [recentOrders, setRecentOrders] = useState<
		RecentOrder[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch dashboard stats from the database
	const { data: statsData, isLoading: statsLoading } =
		useQuery({
			queryKey: ["admin", "dashboard-stats"],
			queryFn: async () => {
				try {
					// Try to get real data if available
					const [
						usersResult,
						productsResult,
						ordersResult,
					] = await Promise.all([
						supabase
							.from("profiles")
							.select("id", { count: "exact", head: true }),
						supabase
							.from("products")
							.select("id", { count: "exact", head: true }),
						supabase
							.from("orders")
							.select("id, total", { count: "exact" }),
					]);

					// Check for errors in any of the queries
					if (usersResult.error) throw usersResult.error;
					if (productsResult.error)
						throw productsResult.error;
					if (ordersResult.error) throw ordersResult.error;

					// Calculate total revenue from orders
					const revenue =
						ordersResult.data?.reduce(
							(sum, order) => sum + (order.total || 0),
							0,
						) || 0;

					// Return stats
					return {
						customers: usersResult.count || 0,
						products: productsResult.count || 0,
						orders: ordersResult.count || 0,
						revenue,
					};
				} catch (error) {
					console.error(
						"Error fetching dashboard stats:",
						error,
					);
					toast({
						title: "Error",
						description:
							"Failed to fetch dashboard statistics. Using mock data.",
						variant: "destructive",
					});

					// Return mock data
					return {
						customers: 254,
						products: 128,
						orders: 1845,
						revenue: 157890,
					};
				}
			},
		});

	// Load mock data for charts and tables
	useEffect(() => {
		// Update stats when data is loaded
		if (statsData) {
			setStats({
				...statsData,
				revenueTrend: { value: 12.5, isPositive: true },
				ordersTrend: { value: 8.2, isPositive: true },
				customersTrend: { value: 5.1, isPositive: true },
			});
		}

		// Set initial mock data for all visualizations
		setSalesData(generateMockSalesData());
		setCategoryData(generateMockCategoryData());
		setTopProducts(generateMockTopProducts());
		setRecentOrders(generateMockRecentOrders());

		// Set loading to false after everything is loaded
		setIsLoading(false);
	}, [statsData]);

	// Return all dashboard data
	return {
		stats,
		salesData,
		categoryData,
		topProducts,
		recentOrders,
		isLoading: isLoading || statsLoading,
		formatPrice,
	};
};

export default useDashboard;
