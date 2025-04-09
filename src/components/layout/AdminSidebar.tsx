import {
	Link,
	useLocation,
	useNavigate,
} from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import {
	LayoutDashboard,
	Package,
	ShoppingBag,
	Users,
	// FileText,
	// Settings,
	LayoutGrid,
	Menu,
	Home,
	Sun,
	Moon,
	Globe,
	ChevronRight,
} from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Badge } from "@/components/ui/badge";

interface AdminSidebarProps {
	isMobile?: boolean;
}

const AdminSidebar = ({
	isMobile = false,
}: AdminSidebarProps) => {
	const { pathname } = useLocation();
	const { t } = useTranslation();
	const { isRTL, currentLanguage, changeLanguage } =
		useLanguage();
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const theme = Cookies.get("theme");
		return theme === "dark";
	});
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const navigate = useNavigate();

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

	const handleNavigation = (path: string) => {
		setIsSheetOpen(false);
		navigate(path);
	};

	const isActive = (path: string) =>
		pathname.startsWith(path);

	const navItems = [
		{
			href: "/admin/dashboard",
			icon: <LayoutDashboard className="h-5 w-5" />,
			label: t("admin.dashboard"),
			badge: t("admin.overview"),
		},
		{
			href: "/admin/products",
			icon: <Package className="h-5 w-5" />,
			label: t("admin.products"),
			badge: t("admin.manage"),
		},
		{
			href: "/admin/categories",
			icon: <LayoutGrid className="h-5 w-5" />,
			label: t("admin.categories"),
			badge: t("admin.organize"),
		},
		{
			href: "/admin/orders",
			icon: <ShoppingBag className="h-5 w-5" />,
			label: t("admin.orders"),
			badge: t("admin.process"),
		},
		{
			href: "/admin/users",
			icon: <Users className="h-5 w-5" />,
			label: t("admin.users"),
			badge: t("admin.manage"),
		},

		// 	href: "/admin/content",
		// 	icon: <FileText className="h-5 w-5" />,
		// 	label: t("admin.content"),
		// },
		// {
		// 	href: "/admin/settings",
		// 	icon: <Settings className="h-5 w-5" />,
		// 	label: t("admin.settings"),
		// },
	];

	const renderNavItems = () => (
		<div className="space-y-1">
			{navItems.map((item) => (
				<button
					key={item.href}
					onClick={() => handleNavigation(item.href)}
					className={cn(
						"admin-sidebar-item group relative w-full text-start",
						isActive(item.href)
							? "admin-sidebar-item-active"
							: "admin-sidebar-item-inactive sidebar-hover-effect",
					)}>
					{item.icon}
					<span>{item.label}</span>
					{item.badge && (
						<Badge
							variant="secondary"
							className="absolute left-2 ltr:right-2 opacity-0 group-hover:opacity-100 transition-opacity">
							{item.badge}
						</Badge>
					)}
					{isActive(item.href) && (
						<ChevronRight className="absolute right-2 h-4 w-4 text-primary" />
					)}
				</button>
			))}
		</div>
	);

	if (isMobile) {
		return (
			<Sheet
				open={isSheetOpen}
				onOpenChange={setIsSheetOpen}>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="lg:hidden mx-[6px]">
						<Menu className="h-5 w-5" />
						<span className="sr-only">
							{t("admin.menu")}
						</span>
					</Button>
				</SheetTrigger>
				<SheetContent
					side={isRTL ? "right" : "left"}
					className="w-[80vw] sm:w-[350px] p-0">
					<Separator />
					<nav className="flex-1 py-8 px-4">
						{renderNavItems()}

						<button
							onClick={() => handleNavigation("/")}
							className="admin-sidebar-item admin-sidebar-item-inactive sidebar-hover-effect group relative w-full text-start">
							<Home className="h-5 w-5" />
							<span>{t("common.home")}</span>
							<Badge
								variant="outline"
								className="absolute left-2 ltr:right-2 opacity-0 group-hover:opacity-100 transition-opacity">
								{t("admin.storefront")}
							</Badge>
						</button>

						<Separator className="my-6" />

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
										onClick={() => changeLanguage("ar")}
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
					</nav>
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<div className="hidden lg:flex md:w-64 lg:w-72 h-full bg-sidebar-background border-r border-sidebar-border flex-col">
			<nav className="flex-1 py-8 px-4">
				{renderNavItems()}
			</nav>
		</div>
	);
};

export default AdminSidebar;
