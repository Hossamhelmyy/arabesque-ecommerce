import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { UsersIcon, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface UserHeaderProps {
	searchQuery: string;
	onSearch: (query: string) => void;
}

export const UserHeader = ({
	searchQuery,
	onSearch,
}: UserHeaderProps) => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();

	return (
		<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div className="space-y-1">
				<h1 className="text-3xl font-bold tracking-tight flex items-center rtl:space-x-reverse">
					<UsersIcon
						className={cn(
							"h-8 w-8",
							isRTL ? "ml-2" : "mr-2",
						)}
					/>
					{t("admin.users")}
				</h1>
				<p className="text-muted-foreground">
					{t("admin.manageUsers")}
				</p>
			</div>
			<div className="w-full md:w-auto">
				<div className="relative max-w-sm">
					<Search
						className={cn(
							"absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
							isRTL ? "right-3" : "left-3",
						)}
					/>
					<Input
						placeholder={t("admin.searchUsers")}
						value={searchQuery}
						onChange={(e) => onSearch(e.target.value)}
						className={cn(
							"h-10 bg-background",
							isRTL ? "pr-9" : "pl-9",
						)}
					/>
				</div>
			</div>
		</div>
	);
};
