import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	Menu,
	ShoppingCart,
	Heart,
	User,
	Sun,
	Moon,
	Globe,
	LayoutDashboard,
	Home,
	Package,
	LayoutGrid,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import MobileNavItem from "./MobileNavItem";

interface MobileNavigationProps {
	isAdmin: boolean;
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}

export const MobileNavigation = ({
	isAdmin = false,
	isOpen,
	setIsOpen,
}: MobileNavigationProps) => {
	const { t } = useTranslation();
	const { isRTL, currentLanguage, changeLanguage } =
		useLanguage();
	const { cartItems } = useCart();
	const { user, signOut } = useAuth();
	const navigate = useNavigate();
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const theme = Cookies.get("theme");
		return theme === "dark";
	});

	const isUserAdmin = user?.role === "admin";
	const cartCount = cartItems.length;

	const handleNavigation = (path: string) => {
		setIsOpen(false);
		navigate(path);
	};

	const toggleTheme = () => {
		const newTheme = !isDarkMode ? "dark" : "light";
		setIsDarkMode(!isDarkMode);
		document.documentElement.classList.toggle("dark");
		Cookies.set("theme", newTheme, { expires: 365 });
	};

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="md:hidden">
					<Menu className="h-5 w-5" />
					<span className="sr-only">
						{t("common.menu")}
					</span>
				</Button>
			</SheetTrigger>
			<SheetContent
				side={isRTL ? "right" : "left"}
				className="w-[80vw] sm:w-[350px] p-0">
				<Separator />
				<nav className="flex flex-col py-8 px-4">
					<div className="space-y-1">
						<MobileNavItem
							href={isAdmin ? "/admin/dashboard" : "/"}
							icon={<Home className="h-5 w-5" />}
							label={
								isAdmin
									? t("admin.dashboard")
									: t("common.home")
							}
							onClick={() =>
								handleNavigation(
									isAdmin ? "/admin/dashboard" : "/",
								)
							}
						/>
						<MobileNavItem
							href="/products"
							icon={<Package className="h-5 w-5" />}
							label={t("common.products")}
							onClick={() => handleNavigation("/products")}
						/>
						<MobileNavItem
							href="/categories"
							icon={<LayoutGrid className="h-5 w-5" />}
							label={t("common.categories")}
							onClick={() =>
								handleNavigation("/categories")
							}
						/>
						{isUserAdmin && !isAdmin && (
							<MobileNavItem
								href="/admin"
								icon={
									<LayoutDashboard className="h-5 w-5" />
								}
								label={t("admin.dashboard")}
								onClick={() => handleNavigation("/admin")}
							/>
						)}
					</div>

					<Separator className="my-4" />

					<div className="space-y-1">
						{user ? (
							<>
								<MobileNavItem
									href="/profile"
									icon={<User className="h-5 w-5" />}
									label={t("common.profile")}
									onClick={() =>
										handleNavigation("/profile")
									}
								/>
								<MobileNavItem
									href="/favorites"
									icon={<Heart className="h-5 w-5" />}
									label={t("common.favorites")}
									onClick={() =>
										handleNavigation("/favorites")
									}
								/>
								<MobileNavItem
									href="/cart"
									icon={
										<ShoppingCart className="h-5 w-5" />
									}
									label={t("common.cart")}
									badge={cartCount}
									onClick={() => handleNavigation("/cart")}
								/>
							</>
						) : (
							<MobileNavItem
								href="/auth"
								icon={<User className="h-5 w-5" />}
								label={t("common.signIn")}
								onClick={() => handleNavigation("/auth")}
							/>
						)}
					</div>

					<Separator className="my-4" />

					{/* Language and Theme Controls */}
					<div className="space-y-6 px-2">
						<div className="space-y-3">
							<div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
								<Globe className="h-4 w-4" />
								{t("common.language")}
							</div>
							<div className="grid grid-cols-2 gap-2">
								<Button
									variant={
										currentLanguage === "en"
											? "default"
											: "outline"
									}
									size="sm"
									onClick={() => changeLanguage("en")}
									className={cn(
										"w-full transition-all",
										currentLanguage === "en" && "shadow-md",
									)}>
									English
								</Button>
								<Button
									variant={
										currentLanguage === "ar"
											? "default"
											: "outline"
									}
									size="sm"
									onClick={() => changeLanguage("ar")}
									className={cn(
										"w-full transition-all",
										currentLanguage === "ar" && "shadow-md",
									)}>
									العربية
								</Button>
							</div>
						</div>

						<div className="space-y-3">
							<div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
								{isDarkMode ? (
									<Moon className="h-4 w-4" />
								) : (
									<Sun className="h-4 w-4" />
								)}
								{t("common.theme")}
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={toggleTheme}
								className="w-full justify-start gap-2">
								{isDarkMode ? (
									<>
										<Sun className="h-4 w-4" />
										{t("common.lightMode")}
									</>
								) : (
									<>
										<Moon className="h-4 w-4" />
										{t("common.darkMode")}
									</>
								)}
							</Button>
						</div>
					</div>

					{user && (
						<>
							<Separator className="my-4" />
							<MobileNavItem
								href="#"
								icon={<></>}
								label={t("common.signOut")}
								onClick={signOut}
								className="text-destructive"
							/>
						</>
					)}
				</nav>
			</SheetContent>
		</Sheet>
	);
};

export default MobileNavigation;
