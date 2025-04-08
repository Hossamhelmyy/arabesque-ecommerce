import { useTranslation } from "react-i18next";

export const SettingsHeader = () => {
	const { t } = useTranslation();

	return (
		<div className="space-y-2">
			<h1 className="text-3xl font-bold tracking-tight">
				{t("admin.settings")}
			</h1>
			<p className="text-muted-foreground">
				{t("admin.settingsDescription")}
			</p>
		</div>
	);
};
