import { useTranslation } from "react-i18next";
import { CalendarIcon, TrendingUpIcon } from "lucide-react";

export const DashboardHeader = () => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col md:flex-row md:items-center md:justify-between">
			<div className="space-y-1">
				<h1 className="text-3xl font-bold tracking-tight">
					{t("admin.dashboard")}
				</h1>
				<p className="text-muted-foreground">
					{t("admin.dashboardOverview")}
				</p>
			</div>
			<div className="mt-4 md:mt-0 flex items-center gap-2 text-sm text-muted-foreground">
				<CalendarIcon className="h-4 w-4" />
				<span>
					{new Date().toLocaleDateString(undefined, {
						weekday: "long",
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</span>
			</div>
		</div>
	);
};
