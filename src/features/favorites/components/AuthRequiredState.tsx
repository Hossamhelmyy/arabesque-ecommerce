import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AuthRequiredState = () => {
	const { t } = useTranslation();

	return (
		<div className="text-center py-16">
			<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
				<Heart className="h-8 w-8 text-muted-foreground" />
			</div>
			<h2 className="text-xl font-medium mb-2">
				{t("profile.notLoggedIn")}
			</h2>
			<p className="text-muted-foreground max-w-md mx-auto mb-6">
				{t("profile.notLoggedInMessage")}
			</p>
			<div className="flex flex-col sm:flex-row gap-4 justify-center">
				<Button asChild>
					<Link to="/auth">
						{t("profile.signInButton")}
					</Link>
				</Button>
				<Button variant="outline" asChild>
					<Link to="/auth?signup=true">
						{t("profile.createAccountButton")}
					</Link>
				</Button>
			</div>
		</div>
	);
};
