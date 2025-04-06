import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterState, Category } from "../../types";

interface FilterBadgesProps {
	filters: FilterState;
	categories?: Category[];
	handleFilterChange: (
		key: keyof FilterState,
		value: FilterState[keyof FilterState],
	) => void;
}

const FilterBadges = ({
	filters,
	categories,
	handleFilterChange,
}: FilterBadgesProps) => {
	const { t, i18n } = useTranslation();
	const hasActiveFilters = Object.values(filters).some(
		(value) =>
			typeof value === "string"
				? value !== ""
				: typeof value === "number"
				? value > 0 && value < 1000
				: value === true,
	);

	if (!hasActiveFilters) return null;

	return (
		<div className="flex flex-wrap gap-2 mb-6">
			{filters.search && (
				<Badge
					variant="secondary"
					className="gap-1 px-3 py-1.5 text-sm">
					{t("products.search")}: {filters.search}
					<Button
						variant="ghost"
						size="icon"
						className="h-4 w-4 p-0 hover:bg-transparent"
						onClick={() =>
							handleFilterChange("search", "")
						}>
						<X className="h-3 w-3" />
					</Button>
				</Badge>
			)}

			{filters.category && (
				<Badge
					variant="secondary"
					className="gap-1 px-3 py-1.5 text-sm">
					{t("products.category")}:{" "}
					{i18n.language === "ar"
						? categories?.find(
								(c) => c.slug === filters.category,
						  )?.name_ar
						: categories?.find(
								(c) => c.slug === filters.category,
						  )?.name}
					<Button
						variant="ghost"
						size="icon"
						className="h-4 w-4 p-0 hover:bg-transparent"
						onClick={() =>
							handleFilterChange("category", "")
						}>
						<X className="h-3 w-3" />
					</Button>
				</Badge>
			)}

			{(filters.minPrice > 0 ||
				filters.maxPrice < 1000) && (
				<Badge
					variant="secondary"
					className="gap-1 px-3 py-1.5 text-sm">
					{t("filters.priceRange")}: ${filters.minPrice} - $
					{filters.maxPrice}
					<Button
						variant="ghost"
						size="icon"
						className="h-4 w-4 p-0 hover:bg-transparent"
						onClick={() => {
							handleFilterChange("minPrice", 0);
							handleFilterChange("maxPrice", 1000);
						}}>
						<X className="h-3 w-3" />
					</Button>
				</Badge>
			)}

			{filters.isNew && (
				<Badge
					variant="secondary"
					className="gap-1 px-3 py-1.5 text-sm">
					{t("product.new")}
					<Button
						variant="ghost"
						size="icon"
						className="h-4 w-4 p-0 hover:bg-transparent"
						onClick={() =>
							handleFilterChange("isNew", false)
						}>
						<X className="h-3 w-3" />
					</Button>
				</Badge>
			)}

			{filters.isOnSale && (
				<Badge
					variant="secondary"
					className="gap-1 px-3 py-1.5 text-sm">
					{t("product.sale")}
					<Button
						variant="ghost"
						size="icon"
						className="h-4 w-4 p-0 hover:bg-transparent"
						onClick={() =>
							handleFilterChange("isOnSale", false)
						}>
						<X className="h-3 w-3" />
					</Button>
				</Badge>
			)}

			{filters.isFeatured && (
				<Badge
					variant="secondary"
					className="gap-1 px-3 py-1.5 text-sm">
					{t("home.featured")}
					<Button
						variant="ghost"
						size="icon"
						className="h-4 w-4 p-0 hover:bg-transparent"
						onClick={() =>
							handleFilterChange("isFeatured", false)
						}>
						<X className="h-3 w-3" />
					</Button>
				</Badge>
			)}
		</div>
	);
};

export default FilterBadges;
