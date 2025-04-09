import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import {
	LayoutDashboard,
	Package,
	ShoppingBag,
	Users,
	FileText,
	Settings,
	LayoutGrid,
	Menu,
	Home,
} from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface AdminSidebarProps {
	isMobile?: boolean;
}

const AdminSidebar = ({
	isMobile = false,
}: AdminSidebarProps) => {
	const { pathname } = useLocation();
	const { t } = useTranslation();
	const { isRTL } = useLanguage();

	const isActive = (path: string) =>
		pathname.startsWith(path);

	const navItems = [
		{
			href: "/admin/dashboard",
			icon: <LayoutDashboard className="h-5 w-5" />,
			label: t("admin.dashboard"),
		},
		{
			href: "/admin/products",
			icon: <Package className="h-5 w-5" />,
			label: t("admin.products"),
		},
		{
			href: "/admin/categories",
			icon: <LayoutGrid className="h-5 w-5" />,
			label: t("admin.categories"),
		},
		{
			href: "/admin/orders",
			icon: <ShoppingBag className="h-5 w-5" />,
			label: t("admin.orders"),
		},
		{
			href: "/admin/users",
			icon: <Users className="h-5 w-5" />,
			label: t("admin.users"),
		},
		{
			href: "/admin/content",
			icon: <FileText className="h-5 w-5" />,
			label: t("admin.content"),
		},
		{
			href: "/admin/settings",
			icon: <Settings className="h-5 w-5" />,
			label: t("admin.settings"),
		},
	];

	const renderNavItems = () => (
		<div className="space-y-1">
			{navItems.map((item) => (
				<Link
					key={item.href}
					to={item.href}
					className={cn(
						"admin-sidebar-item",
						isActive(item.href)
							? "admin-sidebar-item-active"
							: "admin-sidebar-item-inactive sidebar-hover-effect",
					)}>
					{item.icon}
					<span>{item.label}</span>
				</Link>
			))}
		</div>
	);

	if (isMobile) {
		return (
			<Sheet>
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
					<nav className="flex-1 py-8 px-4">
						{renderNavItems()}
						<Link
							to={"/"}
							className={cn(
								"admin-sidebar-item admin-sidebar-item-inactive sidebar-hover-effect",
							)}>
							<Home className="h-5 w-5" />
							<span>{t("common.home")}</span>
						</Link>
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
