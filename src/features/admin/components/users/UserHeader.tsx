import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { UsersIcon } from "lucide-react";

interface UserHeaderProps {
	searchQuery: string;
	onSearch: (query: string) => void;
}

export const UserHeader = ({
	searchQuery,
	onSearch,
}: UserHeaderProps) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div className="space-y-1">
				<h1 className="text-3xl font-bold tracking-tight flex items-center">
					<UsersIcon className="mr-2 h-8 w-8" />
					{t("admin.users")}
				</h1>
				<p className="text-muted-foreground">
					{t("admin.manageUsersDesc")}
				</p>
			</div>
			<div className="w-full md:w-auto">
				<Input
					placeholder={t("admin.searchUsers")}
					value={searchQuery}
					onChange={(e) => onSearch(e.target.value)}
					className="max-w-sm"
				/>
			</div>
		</div>
	);
};
