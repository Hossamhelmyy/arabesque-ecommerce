import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface CategoryHeaderProps {
	searchQuery: string;
	onSearch: (
		e: React.ChangeEvent<HTMLInputElement>,
	) => void;
	onAddNewClick: () => void;
}

export const CategoryHeader = ({
	searchQuery,
	onSearch,
	onAddNewClick,
}: CategoryHeaderProps) => {
	const { t } = useTranslation();

	return (
		<div className="flex sm:items-center justify-between sm:flex-row items-start flex-col gap-3">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder={t("admin.searchCategories")}
					value={searchQuery}
					onChange={onSearch}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
			</div>
			<Button
				onClick={onAddNewClick}
				size="sm"
				className="h-8">
				<Plus className="mr-2 h-4 w-4" />
				{t("admin.addCategory")}
			</Button>
		</div>
	);
};
