import {
	OrderStatusOption,
	SalesDataPoint,
	ProductPerformancePoint,
} from "../types";

// Sample data for dashboard charts and metrics
export const SAMPLE_SALES_DATA: SalesDataPoint[] = [
	{ month: "Jan", sales: 4000 },
	{ month: "Feb", sales: 3000 },
	{ month: "Mar", sales: 5000 },
	{ month: "Apr", sales: 4500 },
	{ month: "May", sales: 5500 },
	{ month: "Jun", sales: 7000 },
	{ month: "Jul", sales: 6000 },
	{ month: "Aug", sales: 5800 },
	{ month: "Sep", sales: 6200 },
	{ month: "Oct", sales: 8000 },
	{ month: "Nov", sales: 9000 },
	{ month: "Dec", sales: 11000 },
];

export const SAMPLE_PRODUCT_PERFORMANCE: ProductPerformancePoint[] =
	[
		{
			name: "Arabian Nights Lamp",
			sales: 342,
			revenue: 14780,
		},
		{ name: "Moroccan Tea Set", sales: 289, revenue: 8670 },
		{ name: "Persian Carpet", sales: 87, revenue: 26100 },
		{
			name: "Handmade Ceramic Plates",
			sales: 215,
			revenue: 6450,
		},
		{
			name: "Arabesque Coffee Table",
			sales: 132,
			revenue: 19800,
		},
	];

// Order status options
export const ORDER_STATUS_OPTIONS = [
	{ value: "pending", label: "Pending" },
	{ value: "processing", label: "Processing" },
	{ value: "shipped", label: "Shipped" },
	{ value: "delivered", label: "Delivered" },
	{ value: "cancelled", label: "Cancelled" },
];

// User role options
export const USER_ROLE_OPTIONS = [
	{ value: "customer", label: "Customer" },
	{ value: "admin", label: "Admin" },
];

// Order status with colors
export const ORDER_STATUS: OrderStatusOption[] = [
	{
		value: "pending",
		label: "Pending",
		color:
			"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
	},
	{
		value: "processing",
		label: "Processing",
		color:
			"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
	},
	{
		value: "shipped",
		label: "Shipped",
		color:
			"bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
	},
	{
		value: "delivered",
		label: "Delivered",
		color:
			"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
	},
	{
		value: "cancelled",
		label: "Cancelled",
		color:
			"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
	},
];
