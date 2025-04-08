import { useTranslation } from "react-i18next";
import {
	Card,
	CardContent,
	CardDescription,
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
} from "recharts";
import type { ChartData } from "../../types";

interface SalesChartProps {
	data: ChartData[];
	isLoading: boolean;
	formatCurrency?: (value: number) => string;
}

export const SalesChart = ({
	data,
	isLoading,
	formatCurrency,
}: SalesChartProps) => {
	const { t } = useTranslation();

	// Default formatter if none provided
	const formatValue = (value: number) => {
		if (formatCurrency) {
			return formatCurrency(value);
		}
		return `$${value.toLocaleString()}`;
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("admin.monthlySales")}</CardTitle>
				<CardDescription>
					{t("admin.monthlySalesDesc")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="w-full h-[300px] flex items-center justify-center">
						<Skeleton className="h-[250px] w-full" />
					</div>
				) : (
					<ResponsiveContainer width="100%" height={300}>
						<BarChart
							data={data}
							margin={{
								top: 5,
								right: 30,
								left: 20,
								bottom: 5,
							}}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip
								formatter={(value) => {
									return [
										formatValue(value as number),
										t("admin.sales"),
									];
								}}
							/>
							<Bar
								dataKey="total"
								fill="#3b82f6"
								radius={[4, 4, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				)}
			</CardContent>
		</Card>
	);
};
