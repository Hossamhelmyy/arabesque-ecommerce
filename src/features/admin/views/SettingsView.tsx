import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useSettings } from "../hooks/useSettings";
import { StoreSettingsForm } from "../components/settings/StoreSettingsForm";
import { EmailSettingsForm } from "../components/settings/EmailSettingsForm";
import { ShippingSettingsForm } from "../components/settings/ShippingSettingsForm";
import { SettingsHeader } from "../components/settings/SettingsHeader";

export const SettingsView = () => {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState("store");

	const {
		settings,
		isLoading,
		isSubmitting,
		updateStoreSettings,
		updateEmailSettings,
		updateShippingSettings,
		getStoreSettingsValues,
		getEmailSettingsValues,
		getShippingSettingsValues,
	} = useSettings();

	if (isLoading) {
		return (
			<div className="container mx-auto py-6 flex justify-center items-center h-[calc(100vh-100px)]">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="container mx-auto py-6 space-y-6">
			<SettingsHeader />

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-6">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="store">
						{t("admin.storeSettings")}
					</TabsTrigger>
					<TabsTrigger value="email">
						{t("admin.emailSettings")}
					</TabsTrigger>
					<TabsTrigger value="shipping">
						{t("admin.shippingSettings")}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="store">
					<StoreSettingsForm
						initialValues={getStoreSettingsValues()}
						onSubmit={updateStoreSettings}
						isSubmitting={isSubmitting}
					/>
				</TabsContent>

				<TabsContent value="email">
					<EmailSettingsForm
						initialValues={getEmailSettingsValues()}
						onSubmit={updateEmailSettings}
						isSubmitting={isSubmitting}
					/>
				</TabsContent>

				<TabsContent value="shipping">
					<ShippingSettingsForm
						initialValues={getShippingSettingsValues()}
						onSubmit={updateShippingSettings}
						isSubmitting={isSubmitting}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
};
