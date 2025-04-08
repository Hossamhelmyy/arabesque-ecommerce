import { useTranslation } from "react-i18next";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	TooltipProps,
} from "recharts";
import type {
	SalesDataPoint,
	ChartData,
} from "../../types";

interface DashboardChartsProps {
	salesData: SalesDataPoint[];
	isLoading: boolean;
	formatCurrency: (value: number) => string;
}

// Define the Recharts tooltip props type
interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{
		value: number;
		name: string;
		dataKey: string;
	}>;
	label?: string;
}

export const DashboardCharts = ({
	salesData,
	isLoading,
	formatCurrency,
}: DashboardChartsProps) => {
	const { t } = useTranslation();

	// Custom tooltip formatter
	const CustomTooltip = ({
		active,
		payload,
		label,
	}: CustomTooltipProps) => {
		if (active && payload && payload.length) {
			return (
				<div className="rounded-lg border bg-background p-2 shadow-sm">
					<p className="text-sm font-medium">{label}</p>
					<p className="text-sm text-muted-foreground">
						{t("admin.sales")}:{" "}
						{formatCurrency(payload[0].value)}
					</p>
				</div>
			);
		}

		return null;
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("admin.monthlySales")}</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="h-[300px] w-full">
						<Skeleton className="h-full w-full" />
					</div>
				) : (
					<div className="h-[300px]">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={salesData}
								margin={{
									top: 5,
									right: 30,
									left: 20,
									bottom: 5,
								}}>
								<CartesianGrid
									strokeDasharray="3 3"
									opacity={0.2}
								/>
								<XAxis
									dataKey="month"
									tick={{ fontSize: 12 }}
									tickLine={false}
								/>
								<YAxis
									tickFormatter={(value) =>
										formatCurrency(value).split(".")[0]
									}
									tick={{ fontSize: 12 }}
									tickLine={false}
									axisLine={false}
								/>
								<Tooltip content={<CustomTooltip />} />
								<Bar
									dataKey="sales"
									fill="hsl(var(--primary))"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
