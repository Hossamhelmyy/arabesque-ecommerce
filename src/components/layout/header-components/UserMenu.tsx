import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { User, ShoppingCart, Heart } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
	DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";

interface UserMenuProps {
	isAdmin: boolean;
}

export const UserMenu = ({ isAdmin }: UserMenuProps) => {
	const { t } = useTranslation();
	const { user, signOut } = useAuth();
	const { isRTL } = useLanguage();
	if (!user) {
		return (
			<Link to="/auth">
				<Button variant="ghost" size="icon">
					<User className="h-5 w-5" />
					<span className="sr-only">
						{t("common.signIn")}
					</span>
				</Button>
			</Link>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<User className="h-5 w-5" />
					<span className="sr-only">
						{t("common.profile")}
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel className="truncate">
					{user.email}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{isAdmin ? (
					<>
						<DropdownMenuItem
							dir={isRTL ? "rtl" : "ltr"}
							asChild>
							<Link
								to="/admin/profile"
								className="flex items-center">
								<User className="h-4 w-4 me-2" />
								{t("admin.profile")}
							</Link>
						</DropdownMenuItem>
					</>
				) : (
					<>
						<DropdownMenuItem
							dir={isRTL ? "rtl" : "ltr"}
							asChild>
							<Link
								to="/profile"
								className="flex items-center">
								<User className="h-4 w-4 me-2" />
								{t("common.profile")}
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							dir={isRTL ? "rtl" : "ltr"}
							asChild>
							<Link
								to="/cart"
								className="flex items-center">
								<ShoppingCart className="h-4 w-4 me-2" />
								{t("common.cart")}
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							dir={isRTL ? "rtl" : "ltr"}
							asChild>
							<Link
								to="/favorites"
								className="flex items-center">
								<Heart className="h-4 w-4 me-2" />
								{t("common.favorites")}
							</Link>
						</DropdownMenuItem>
					</>
				)}
				<DropdownMenuSeparator />
				<DropdownMenuItem
					dir={isRTL ? "rtl" : "ltr"}
					onClick={signOut}
					className="text-destructive">
					{t("common.signOut")}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserMenu;
