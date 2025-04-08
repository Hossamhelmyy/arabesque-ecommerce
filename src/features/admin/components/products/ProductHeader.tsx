import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProductHeaderProps {
	searchQuery: string;
	onSearch: (
		e: React.ChangeEvent<HTMLInputElement>,
	) => void;
	onAddNewClick: () => void;
}

export const ProductHeader = ({
	searchQuery,
	onSearch,
	onAddNewClick,
}: ProductHeaderProps) => {
	const { t } = useTranslation();

	return (
		<>
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					{t("admin.products")}
				</h1>
				<p className="text-muted-foreground">
					{t("admin.manageProducts")}
				</p>
			</div>

			<div className="flex sm:items-center justify-between sm:flex-row items-start flex-col gap-3">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder={t("admin.searchProducts")}
						className="pl-8"
						value={searchQuery}
						onChange={onSearch}
					/>
				</div>

				<Button onClick={onAddNewClick}>
					<Plus className="mr-2 h-4 w-4" />
					{t("admin.addProduct")}
				</Button>
			</div>
		</>
	);
};
