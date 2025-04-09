import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface OrderHeaderProps {
	searchQuery: string;
	statusFilter: string;
	onSearch: (
		e: React.ChangeEvent<HTMLInputElement>,
	) => void;
	onStatusChange: (status: string) => void;
}

const orderStatuses = [
	{ value: "all", label: "All" },
	{ value: "pending", label: "Pending" },
	{ value: "processing", label: "Processing" },
	{ value: "shipped", label: "Shipped" },
	{ value: "delivered", label: "Delivered" },
	{ value: "cancelled", label: "Cancelled" },
];

export const OrderHeader = ({
	searchQuery,
	statusFilter,
	onSearch,
	onStatusChange,
}: OrderHeaderProps) => {
	const { t } = useTranslation();

	return (
		<>
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					{t("admin.orders")}
				</h1>
				<p className="text-muted-foreground">
					{t("admin.manageOrders")}
				</p>
			</div>
			<div className="flex items-center justify-between">
				<div className="flex flex-1 sm:items-center space-x-4 gap-3 sm:flex-row flex-col items-start">
					<Input
						placeholder={t("admin.searchOrders")}
						value={searchQuery}
						onChange={onSearch}
						className="h-8 w-[200px] lg:w-[300px]"
					/>
					<Select
						value={statusFilter}
						onValueChange={onStatusChange}>
						<SelectTrigger className="h-8 w-[200px]">
							<SelectValue
								placeholder={t("admin.filterByStatus")}
							/>
						</SelectTrigger>
						<SelectContent>
							{orderStatuses.map((status) => (
								<SelectItem
									key={status.value}
									value={status.value}>
									{t(
										`admin.orderStatus.${status.label.toLowerCase()}`,
									)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</>
	);
};
