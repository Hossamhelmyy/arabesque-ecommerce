import { useTranslation } from "react-i18next";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const AddressesList = () => {
	const { t } = useTranslation();

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("profile.addresses")}</CardTitle>
				<CardDescription>
					{t("profile.manageAddresses")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="text-center py-8">
					<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
						<Home className="h-6 w-6 text-muted-foreground" />
					</div>
					<h3 className="font-medium mb-2">
						{t("profile.noAddresses")}
					</h3>
					<p className="text-muted-foreground mb-4">
						{t("profile.addAddressMessage")}
					</p>
					<Button>{t("profile.addAddress")}</Button>
				</div>
			</CardContent>
		</Card>
	);
};
