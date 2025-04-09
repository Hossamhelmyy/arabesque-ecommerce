import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type CategorySearchProps = {
	searchTerm: string;
	onSearch: (term: string) => void;
};

export const CategorySearch = ({
	searchTerm,
	onSearch,
}: CategorySearchProps) => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();

	const clearSearch = () => {
		onSearch("");
	};

	return (
		<div className="max-w-md mx-auto mb-12">
			<div className="relative">
				<Search
					className={cn(
						"absolute top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4",
						isRTL ? "right-3" : "left-3",
					)}
				/>
				<Input
					type="text"
					placeholder={t("categories.searchPlaceholder")}
					className={cn(
						"h-10 bg-background border-muted-foreground/20",
						isRTL ? "pr-10 pl-10" : "pl-10 pr-10",
					)}
					value={searchTerm}
					onChange={(e) => onSearch(e.target.value)}
				/>
				{searchTerm && (
					<Button
						variant="ghost"
						className={cn(
							"absolute top-1/2 transform -translate-y-1/2 h-7 w-7 p-0",
							isRTL ? "left-2" : "right-2",
						)}
						onClick={clearSearch}>
						<X className="h-4 w-4" />
						<span className="sr-only">
							{t("categories.clearSearch")}
						</span>
					</Button>
				)}
			</div>
		</div>
	);
};
