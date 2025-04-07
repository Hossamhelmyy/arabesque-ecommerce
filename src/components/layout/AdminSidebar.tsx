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
} from "lucide-react";

const AdminSidebar = () => {
	const { pathname } = useLocation();
	const { t } = useTranslation();

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

	return (
		<div className="hidden md:flex md:w-64 lg:w-72 h-full bg-sidebar-background border-r border-sidebar-border flex-col">
			<nav className="flex-1 py-8 px-4">
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
			</nav>
		</div>
	);
};

export default AdminSidebar;
