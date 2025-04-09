import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
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
	// Settings,
	// Bell,
	LayoutDashboard,
	Home,
	// ChevronRight,
	Package,
	LayoutGrid,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
	DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";
import { Separator } from "@/components/ui/separator";

interface HeaderProps {
	isAdmin?: boolean;
}

const Header = ({ isAdmin = false }: HeaderProps) => {
	const { t } = useTranslation();
	const { currentLanguage, changeLanguage, isRTL } =
		useLanguage();
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const theme = Cookies.get("theme");
		return theme === "dark";
	});
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const isMobile = useIsMobile();
	const { cartItems } = useCart();
	const { user, signOut } = useAuth();
	const navigate = useNavigate();

	const cartCount = cartItems.length;

	useEffect(() => {
		const theme = Cookies.get("theme") || "light";
		setIsDarkMode(theme === "dark");
		document.documentElement.classList.toggle(
			"dark",
			theme === "dark",
		);
	}, []);

	const toggleTheme = () => {
		const newTheme = !isDarkMode ? "dark" : "light";
		setIsDarkMode(!isDarkMode);
		document.documentElement.classList.toggle("dark");
		Cookies.set("theme", newTheme, { expires: 365 });
	};

	const isUserAdmin = user?.role === "admin";

	const handleNavigation = (path: string) => {
		setIsSheetOpen(false);
		navigate(path);
	};

	return (
		<header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between sm:px-6 px-2">
				<div className="flex items-center gap-4">
					{!isAdmin && (
						<Sheet
							open={isSheetOpen}
							onOpenChange={setIsSheetOpen}>
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
										<button
											onClick={() =>
												handleNavigation(
													isAdmin
														? "/admin/dashboard"
														: "/",
												)
											}
											className="admin-sidebar-item group relative admin-sidebar-item-inactive sidebar-hover-effect w-full text-start">
											<Home className="h-5 w-5" />
											<span>
												{isAdmin
													? t("admin.dashboard")
													: t("common.home")}
											</span>
										</button>

										<button
											onClick={() =>
												handleNavigation("/products")
											}
											className="admin-sidebar-item group relative admin-sidebar-item-inactive sidebar-hover-effect w-full text-start">
											<Package className="h-5 w-5" />
											<span>{t("common.products")}</span>
										</button>

										<button
											onClick={() =>
												handleNavigation("/categories")
											}
											className="admin-sidebar-item group relative admin-sidebar-item-inactive sidebar-hover-effect w-full text-start">
											<LayoutGrid className="h-5 w-5" />
											<span>{t("common.categories")}</span>
										</button>

										{isUserAdmin && !isAdmin && (
											<button
												onClick={() =>
													handleNavigation("/admin")
												}
												className="admin-sidebar-item group relative admin-sidebar-item-inactive sidebar-hover-effect w-full text-start">
												<LayoutDashboard className="h-5 w-5" />
												<span>{t("admin.dashboard")}</span>
											</button>
										)}
									</div>

									<Separator className="my-4" />

									<div className="space-y-1">
										{user ? (
											<>
												<button
													onClick={() =>
														handleNavigation("/profile")
													}
													className="admin-sidebar-item group relative admin-sidebar-item-inactive sidebar-hover-effect w-full text-start">
													<User className="h-5 w-5" />
													<span>{t("common.profile")}</span>
												</button>
												<button
													onClick={() =>
														handleNavigation("/favorites")
													}
													className="admin-sidebar-item group relative admin-sidebar-item-inactive sidebar-hover-effect w-full text-start">
													<Heart className="h-5 w-5" />
													<span>
														{t("common.favorites")}
													</span>
												</button>
												<button
													onClick={() =>
														handleNavigation("/cart")
													}
													className="admin-sidebar-item group relative admin-sidebar-item-inactive sidebar-hover-effect w-full text-start">
													<ShoppingCart className="h-5 w-5" />
													<span>{t("common.cart")}</span>
													{cartCount > 0 && (
														<Badge
															variant="secondary"
															className="absolute right-2">
															{cartCount}
														</Badge>
													)}
												</button>
											</>
										) : (
											<button
												onClick={() =>
													handleNavigation("/auth")
												}
												className="admin-sidebar-item group relative admin-sidebar-item-inactive sidebar-hover-effect w-full text-start">
												<User className="h-5 w-5" />
												<span>{t("common.signIn")}</span>
											</button>
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
													onClick={() =>
														changeLanguage("en")
													}
													className={cn(
														"w-full transition-all",
														currentLanguage === "en" &&
															"shadow-md",
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
													onClick={() =>
														changeLanguage("ar")
													}
													className={cn(
														"w-full transition-all",
														currentLanguage === "ar" &&
															"shadow-md",
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
											<button
												onClick={signOut}
												className="admin-sidebar-item group relative admin-sidebar-item-inactive sidebar-hover-effect text-destructive w-full text-start">
												<span>{t("common.signOut")}</span>
											</button>
										</>
									)}
								</nav>
							</SheetContent>
						</Sheet>
					)}

					<Link
						to={isAdmin ? "/admin/dashboard" : "/"}
						className="flex items-center space-x-2 rtl:space-x-reverse">
						<span className="md:text-2xl text-lg font-heading font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
							{isAdmin
								? t("admin.title")
								: t("common.appName")}
						</span>
					</Link>
				</div>

				{!isMobile && (
					<NavigationMenu className="hidden md:flex">
						<NavigationMenuList>
							<NavigationMenuItem>
								<Link
									to="/"
									className={navigationMenuTriggerStyle()}>
									{t("common.home")}
								</Link>
							</NavigationMenuItem>

							<NavigationMenuItem>
								<NavigationMenuTrigger>
									{t("common.products")}
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<div className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
										<div className="row-span-3">
											<div className="relative aspect-square overflow-hidden rounded-md">
												<img
													src="https://images.unsplash.com/photo-1596025959570-be1f91c9ebba"
													alt="Featured product"
													className="object-cover w-full h-full"
													onError={(e) => {
														(
															e.target as HTMLImageElement
														).src = "/placeholder.svg";
													}}
												/>
											</div>
										</div>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
											<Button
												variant="ghost"
												asChild
												className="justify-center h-auto py-2 px-3">
												<Link
													to="/products"
													className={cn(
														"block select-none space-y-1 rounded-md leading-none no-underline outline-none",
													)}>
													<div className="text-sm font-medium leading-none">
														{t("home.featured")}
													</div>
												</Link>
											</Button>

											<Button
												variant="ghost"
												asChild
												className="justify-center h-auto py-2 px-3">
												<Link
													to="/products?filter=new"
													className={cn(
														"block select-none space-y-1 rounded-md leading-none no-underline outline-none",
													)}>
													<div className="text-sm font-medium leading-none">
														{t("home.newArrivals")}
													</div>
												</Link>
											</Button>

											<Button
												variant="ghost"
												asChild
												className="justify-center h-auto py-2 px-3">
												<Link
													to="/products?filter=sale"
													className={cn(
														"block select-none space-y-1 rounded-md leading-none no-underline outline-none",
													)}>
													<div className="text-sm font-medium leading-none">
														{t("home.sale")}
													</div>
												</Link>
											</Button>

											<Button
												variant="ghost"
												asChild
												className="justify-center h-auto py-2 px-3">
												<Link
													to="/products?filter=trending"
													className={cn(
														"block select-none space-y-1 rounded-md leading-none no-underline outline-none",
													)}>
													<div className="text-sm font-medium leading-none flex justify-center items-center">
														{t("home.trending")}
													</div>
												</Link>
											</Button>
										</div>
									</div>
								</NavigationMenuContent>
							</NavigationMenuItem>

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
				)}

				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="hidden sm:flex">
								<Globe className="h-5 w-5" />
								<span className="sr-only">
									{t("common.language")}
								</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => changeLanguage("en")}>
								<span
									className={
										currentLanguage === "en"
											? "font-bold"
											: ""
									}>
									English
								</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => changeLanguage("ar")}>
								<span
									className={
										currentLanguage === "ar"
											? "font-bold"
											: ""
									}>
									العربية
								</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Button
						variant="ghost"
						size="icon"
						onClick={toggleTheme}
						className="hidden sm:flex">
						{isDarkMode ? (
							<Sun className="h-5 w-5" />
						) : (
							<Moon className="h-5 w-5" />
						)}
						<span className="sr-only">
							{t("common.toggleTheme")}
						</span>
					</Button>

					{isAdmin ? (
						<>
							{/* <Button variant="ghost" size="icon">
								<Bell className="h-5 w-5" />
								<span className="sr-only">
									{t("admin.notifications")}
								</span>
							</Button> */}
						</>
					) : (
						<>
							<Link
								to="/favorites"
								className="hidden sm:block">
								<Button variant="ghost" size="icon">
									<Heart className="h-5 w-5" />
									<span className="sr-only">
										{t("common.favorites")}
									</span>
								</Button>
							</Link>

							<Link to="/cart" className="relative">
								<Button variant="ghost" size="icon">
									<ShoppingCart className="h-5 w-5" />
									<span className="sr-only">
										{t("common.cart")}
									</span>
									{cartCount > 0 && (
										<Badge
											className={cn(
												"absolute -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center",
												isRTL ? "-left-1" : "-right-1",
											)}
											variant="destructive">
											{cartCount}
										</Badge>
									)}
								</Button>
							</Link>
						</>
					)}

					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<User className="h-5 w-5" />
									<span className="sr-only">
										{t("common.profile")}
									</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-56">
								<DropdownMenuLabel>
									{user.email}
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{isAdmin ? (
									<>
										<DropdownMenuItem asChild>
											<Link
												to="/admin/profile"
												className="flex items-center">
												<User className="h-4 w-4 mr-2" />
												{t("admin.profile")}
											</Link>
										</DropdownMenuItem>
									</>
								) : (
									<>
										<DropdownMenuItem asChild>
											<Link
												to="/profile"
												className="flex items-center">
												<User className="h-4 w-4 mr-2" />
												{t("common.profile")}
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link
												to="/cart"
												className="flex items-center">
												<ShoppingCart className="h-4 w-4 mr-2" />
												{t("common.cart")}
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link
												to="/favorites"
												className="flex items-center">
												<Heart className="h-4 w-4 mr-2" />
												{t("common.favorites")}
											</Link>
										</DropdownMenuItem>
									</>
								)}
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={signOut}
									className="text-destructive">
									{t("common.signOut")}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Link to="/auth">
							<Button variant="ghost" size="icon">
								<User className="h-5 w-5" />
								<span className="sr-only">
									{t("common.signIn")}
								</span>
							</Button>
						</Link>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
