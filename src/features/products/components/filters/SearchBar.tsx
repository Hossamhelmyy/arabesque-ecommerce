import { useTranslation } from "react-i18next";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterState } from "../../types";

interface SearchBarProps {
	search: string;
	handleFilterChange: (
		key: keyof FilterState,
		value: FilterState[keyof FilterState],
	) => void;
	handleQuickSearch: (
		e: React.FormEvent<HTMLFormElement>,
	) => void;
	setFilterOpen: (open: boolean) => void;
}

const SearchBar = ({
	search,
	handleFilterChange,
	handleQuickSearch,
	setFilterOpen,
}: SearchBarProps) => {
	const { t } = useTranslation();

	return (
		<div className="flex items-center gap-3">
			<form onSubmit={handleQuickSearch} className="flex-1">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder={t("products.searchPlaceholder")}
						value={search}
						onChange={(e) =>
							handleFilterChange("search", e.target.value)
						}
						className="pl-9 h-10 bg-background border-muted-foreground/20 focus-visible:ring-primary"
					/>
				</div>
			</form>

			<Button
				variant="outline"
				size="icon"
				className="h-10 w-10 border-muted-foreground/20"
				onClick={() => setFilterOpen(true)}>
				<SlidersHorizontal className="h-4 w-4" />
				<span className="sr-only">
					{t("filters.title")}
				</span>
			</Button>
		</div>
	);
};

export default SearchBar;
