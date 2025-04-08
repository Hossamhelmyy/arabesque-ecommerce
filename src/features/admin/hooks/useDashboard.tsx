import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type {
	SalesDataPoint,
	ProductPerformancePoint,
	Order,
} from "../types";

// Mock utility functions for formatPrice and toast
const formatPrice = (value: number) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(value);
};

// Mock toast function
interface ToastProps {
	title: string;
	description: string;
	variant?: string;
}

const toast = ({
	title,
	description,
	variant,
}: ToastProps) => {
	console.log(`${title}: ${description}`);
};

// Define mock Supabase response types
interface SupabaseCountResponse {
	count: number;
	error: null | Error;
}

interface SupabaseDataResponse<T> {
	data: T[];
	error: null | Error;
}

// Create a properly typed mock supabase client
const supabase = {
	from: (table: string) => ({
		select: (
			columns: string | undefined = undefined,
			options: Record<string, unknown> = {},
		) => {
			// Create a responder that has all the needed methods and properties
			const responder = {
				count: (
					countType: string,
				): Promise<SupabaseCountResponse> => {
					return Promise.resolve({ count: 0, error: null });
				},
				order: (
					column: string,
					{ ascending }: { ascending: boolean },
				) => ({
					limit: (
						num: number,
					): Promise<SupabaseDataResponse<unknown>> => {
						return Promise.resolve({
							data: [],
							error: null,
						});
					},
				}),
				data: [],
				error: null,
			};

			// Return the responder so it can be used for chained calls
			return responder;
		},
	}),
};

// Define our internal dashboard stats structure that matches what we need for the component
interface DashboardStatsData {
	totalUsers: number;
	totalProducts: number;
	totalOrders: number;
	totalRevenue: number;
	revenueTrend?: { value: number; isPositive: boolean };
	ordersTrend?: { value: number; isPositive: boolean };
	customersTrend?: { value: number; isPositive: boolean };
}

// Types for internal use
interface RecentOrder {
	id: string;
	orderNumber: string;
	customerName: string;
	date: string;
	total: number;
	status: string;
}

// Mock data for the dashboard
const generateSalesChartData = (): SalesDataPoint[] => {
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
	return months.map((month) => ({
		month,
		sales: Math.floor(Math.random() * 50000) + 10000,
	}));
};

const generateTopProducts =
	(): ProductPerformancePoint[] => {
		return [
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
		];
	};

const generateRecentOrders = (): RecentOrder[] => {
	const statuses = [
		"pending",
		"processing",
		"completed",
		"cancelled",
	];
	const customers = [
		"John Doe",
		"Jane Smith",
		"Mike Johnson",
		"Sarah Williams",
		"David Brown",
	];

	return customers.map((customer, index) => ({
		id: `ord-${1000 + index}`,
		orderNumber: `ORD-${1000 + index}`,
		customerName: customer,
		date: new Date(
			Date.now() - index * 86400000,
		).toISOString(),
		total: Math.floor(Math.random() * 500) + 50,
		status:
			statuses[Math.floor(Math.random() * statuses.length)],
	}));
};

// Stats data mock type
interface StatsMockData {
	totalUsers: number;
	totalProducts: number;
	totalOrders: number;
	totalRevenue: number;
}

export function useDashboard() {
	// Define state for dashboard data
	const [stats, setStats] = useState<DashboardStatsData>({
		totalUsers: 0,
		totalProducts: 0,
		totalOrders: 0,
		totalRevenue: 0,
		revenueTrend: { value: 12.5, isPositive: true },
		ordersTrend: { value: 8.2, isPositive: true },
		customersTrend: { value: 5.1, isPositive: true },
	});

	const [salesData, setSalesData] = useState<
		SalesDataPoint[]
	>([]);
	const [topProducts, setTopProducts] = useState<
		ProductPerformancePoint[]
	>([]);
	const [recentOrders, setRecentOrders] = useState<
		RecentOrder[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch dashboard stats from the database
	const { data: statsData, isLoading: statsLoading } =
		useQuery<StatsMockData>({
			queryKey: ["admin", "dashboard-stats"],
			queryFn: async () => {
				try {
					// In a real implementation, we'd fetch from Supabase
					// For now, just return mock data
					return {
						totalUsers: 254,
						totalProducts: 128,
						totalOrders: 1845,
						totalRevenue: 157890,
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
						totalUsers: 254,
						totalProducts: 128,
						totalOrders: 1845,
						totalRevenue: 157890,
					};
				}
			},
		});

	// Load mock data for charts and tables
	useEffect(() => {
		// Update stats when data is loaded
		if (statsData) {
			setStats({
				totalUsers: statsData.totalUsers,
				totalProducts: statsData.totalProducts,
				totalOrders: statsData.totalOrders,
				totalRevenue: statsData.totalRevenue,
				revenueTrend: { value: 12.5, isPositive: true },
				ordersTrend: { value: 8.2, isPositive: true },
				customersTrend: { value: 5.1, isPositive: true },
			});
		}

		// Set initial mock data for all visualizations
		setSalesData(generateSalesChartData());
		setTopProducts(generateTopProducts());
		setRecentOrders(generateRecentOrders());

		// Set loading to false after everything is loaded
		setIsLoading(false);
	}, [statsData]);

	// Utility function to format currency
	const formatCurrency = (value: number) =>
		formatPrice(value);

	// Utility function to format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString(
			"en-US",
			{
				year: "numeric",
				month: "short",
				day: "numeric",
			},
		);
	};

	// Utility function to get status badge
	const getStatusBadge = (status: string) => {
		return {
			status:
				status.charAt(0).toUpperCase() + status.slice(1),
			variant:
				status === "completed"
					? "success"
					: status === "processing"
					? "warning"
					: status === "pending"
					? "default"
					: "destructive",
		};
	};

	// Return all dashboard data
	return {
		stats,
		salesData,
		topProducts,
		recentOrders,
		isLoading: isLoading || statsLoading,
		formatCurrency,
		formatDate,
		getStatusBadge,
	};
}

export default useDashboard;
