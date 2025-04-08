import { useTranslation } from "react-i18next";

export const ContentHeader = () => {
	const { t } = useTranslation();

	return (
		<div>
			<h1 className="text-3xl font-bold tracking-tight">
				{t("admin.contentManagement")}
			</h1>
			<p className="text-muted-foreground">
				{t("admin.contentManagementDesc")}
			</p>
		</div>
	);
};
