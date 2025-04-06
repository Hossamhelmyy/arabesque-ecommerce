import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyResultsProps {
	onClearFilters: () => void;
}

const EmptyResults = ({
	onClearFilters,
}: EmptyResultsProps) => {
	const { t } = useTranslation();

	return (
		<div className="text-center py-16">
			<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
				<Search className="h-8 w-8 text-muted-foreground" />
			</div>
			<h2 className="text-xl font-medium mb-2">
				{t("products.noResults")}
			</h2>
			<p className="text-muted-foreground max-w-md mx-auto mb-6">
				{t("products.noResultsDescription")}
			</p>
			<Button
				onClick={onClearFilters}
				variant="default"
				className="px-6">
				{t("products.clearFilters")}
			</Button>
		</div>
	);
};

export default EmptyResults;
