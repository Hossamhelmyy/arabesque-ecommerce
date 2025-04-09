import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { LayoutDashboard } from "lucide-react";
import FeaturedProductsMenu from "./FeaturedProductsMenu";

interface DesktopNavigationProps {
	isAdmin: boolean;
	isUserAdmin: boolean;
}

export const DesktopNavigation = ({
	isAdmin,
	isUserAdmin,
}: DesktopNavigationProps) => {
	const { t } = useTranslation();

	return (
		<NavigationMenu className="hidden md:flex">
			<NavigationMenuList>
				<NavigationMenuItem>
					<Link
						to="/"
						className={navigationMenuTriggerStyle()}>
						{t("common.home")}
					</Link>
				</NavigationMenuItem>

				<FeaturedProductsMenu />

				<NavigationMenuItem>
					<Link
						to="/categories"
						className={navigationMenuTriggerStyle()}>
						{t("common.categories")}
					</Link>
				</NavigationMenuItem>

				{isUserAdmin && !isAdmin && (
					<NavigationMenuItem>
						<Link
							to="/admin"
							className={navigationMenuTriggerStyle()}>
							<LayoutDashboard className="mr-2 h-4 w-4" />
							{t("admin.dashboard")}
						</Link>
					</NavigationMenuItem>
				)}
			</NavigationMenuList>
		</NavigationMenu>
	);
};

export default DesktopNavigation;
