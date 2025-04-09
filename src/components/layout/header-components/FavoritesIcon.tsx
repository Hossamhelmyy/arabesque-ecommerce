import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export const FavoritesIcon = () => {
	const { t } = useTranslation();

	return (
		<Link to="/favorites" className="hidden sm:block">
			<Button variant="ghost" size="icon">
				<Heart className="h-5 w-5" />
				<span className="sr-only">
					{t("common.favorites")}
				</span>
			</Button>
		</Link>
	);
};

export default FavoritesIcon;
