import { useState, useEffect } from "react";
import {
	Outlet,
	NavLink,
	useLocation,
	useNavigate,
} from "react-router-dom";
import {
	LayoutDashboard,
	Package,
	FolderTree,
	ShoppingCart,
	Users,
	Settings,
	LayoutList,
	LogOut,
	Menu,
	X,
	ChevronDown,
	Sun,
	Moon,
	Home,
	Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type NavItem = {
	title: string;
	href: string;
	icon: React.ReactNode;
	badge?: number;
};

const mainNav: NavItem[] = [
	{
		title: "Dashboard",
		href: "/admin",
		icon: <LayoutDashboard className="h-5 w-5" />,
	},
	{
		title: "Products",
		href: "/admin/products",
		icon: <Package className="h-5 w-5" />,
	},
	{
		title: "Categories",
		href: "/admin/categories",
		icon: <FolderTree className="h-5 w-5" />,
	},
	{
		title: "Orders",
		href: "/admin/orders",
		icon: <ShoppingCart className="h-5 w-5" />,
		badge: 3,
	},
	{
		title: "Users",
		href: "/admin/users",
		icon: <Users className="h-5 w-5" />,
	},
	{
		title: "Content",
		href: "/admin/content",
		icon: <LayoutList className="h-5 w-5" />,
	},
	{
		title: "Settings",
		href: "/admin/settings",
		icon: <Settings className="h-5 w-5" />,
	},
];

const AdminLayout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const { user, signOut } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();
	const [theme, setTheme] = useState<"light" | "dark">(
		"light",
	);

	// Close sidebar on mobile by default
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 768) {
				setIsSidebarOpen(false);
			} else {
				setIsSidebarOpen(true);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () =>
			window.removeEventListener("resize", handleResize);
	}, []);

	const handleLogout = async () => {
		await signOut();
		navigate("/auth");
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
		// This would typically interact with your theme system
		// Just a placeholder for demonstration
	};

	return (
		<div className="flex h-screen bg-gray-50 dark:bg-gray-900">
			{/* Sidebar */}
			<aside
				className={cn(
					"fixed inset-y-0 z-50 flex flex-col border-r border-border/40 bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 md:relative",
					isSidebarOpen
						? "w-64"
						: "w-0 md:w-20 overflow-hidden",
				)}>
				{/* Sidebar header */}
				<div className="flex h-16 items-center border-b border-border/40 px-4">
					<div
						className={cn(
							"flex items-center",
							!isSidebarOpen && "md:justify-center",
						)}>
						{/* Logo */}
						<div className="flex items-center font-heading tracking-tight text-primary">
							{isSidebarOpen ? (
								<span className="text-xl font-semibold">
									Arabesque
									<span className="font-light">Admin</span>
								</span>
							) : (
								<span className="hidden md:block text-2xl font-bold">
									A
								</span>
							)}
						</div>
					</div>
					{/* Mobile close button */}
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleSidebar}
						className="ml-auto md:hidden">
						<X className="h-5 w-5" />
					</Button>
				</div>

				{/* Sidebar content */}
				<ScrollArea className="flex-1 py-4">
					<div className="px-3 py-2">
						<h2
							className={cn(
								"mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground",
								!isSidebarOpen && "md:hidden",
							)}>
							OVERVIEW
						</h2>
						<nav className="space-y-1">
							{mainNav.map((item) => (
								<NavLink
									key={item.href}
									to={item.href}
									end={item.href === "/admin"}
									className={({ isActive }) =>
										cn(
											"flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
											isActive
												? "bg-primary text-primary-foreground"
												: "text-muted-foreground hover:bg-muted hover:text-foreground",
											!isSidebarOpen &&
												"md:justify-center md:px-0",
										)
									}>
									<div className="flex items-center gap-3">
										{item.icon}
										<span
											className={cn(
												"text-sm font-medium",
												!isSidebarOpen && "md:hidden",
											)}>
											{item.title}
										</span>
									</div>
									{item.badge && isSidebarOpen && (
										<Badge
											variant="secondary"
											className="ml-auto text-[10px] h-5 min-w-5 flex items-center justify-center rounded-full px-1.5">
											{item.badge}
										</Badge>
									)}
								</NavLink>
							))}
						</nav>
					</div>

					<Separator className="my-4 opacity-50" />

					<div className="px-3 py-2">
						<h2
							className={cn(
								"mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground",
								!isSidebarOpen && "md:hidden",
							)}>
							ACCOUNT
						</h2>
						<nav className="space-y-1">
							<Button
								variant="ghost"
								className="flex w-full items-center justify-start gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
								onClick={() => navigate("/")}>
								<Home className="h-5 w-5" />
								<span
									className={cn(
										"text-sm font-medium",
										!isSidebarOpen && "md:hidden",
									)}>
									Visit Store
								</span>
							</Button>
							<Button
								variant="ghost"
								className="flex w-full items-center justify-start gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
								onClick={handleLogout}>
								<LogOut className="h-5 w-5" />
								<span
									className={cn(
										"text-sm font-medium",
										!isSidebarOpen && "md:hidden",
									)}>
									Log Out
								</span>
							</Button>
						</nav>
					</div>
				</ScrollArea>
			</aside>

			{/* Main content */}
			<div className="flex flex-1 flex-col overflow-hidden">
				{/* Header */}
				<header className="flex h-16 items-center gap-4 border-b border-border/40 bg-white dark:bg-gray-800 px-4 sm:px-6">
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleSidebar}
						className="md:hidden">
						<Menu className="h-5 w-5" />
					</Button>

					<div className="hidden md:block text-sm font-medium">
						{mainNav.find((item) =>
							location.pathname.startsWith(item.href),
						)?.title || "Dashboard"}
					</div>

					<div className="ml-auto flex items-center gap-3">
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleTheme}>
							{theme === "light" ? (
								<Moon className="h-5 w-5" />
							) : (
								<Sun className="h-5 w-5" />
							)}
						</Button>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="relative">
									<Bell className="h-5 w-5" />
									<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
										2
									</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-80">
								<DropdownMenuLabel>
									Notifications
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<div className="max-h-60 overflow-y-auto">
									<div className="p-2 hover:bg-muted rounded-md mb-1 cursor-pointer">
										<div className="font-medium text-sm">
											New order received
										</div>
										<div className="text-xs text-muted-foreground">
											Order #1234 has been placed
										</div>
										<div className="text-xs text-muted-foreground mt-1">
											10 minutes ago
										</div>
									</div>
									<div className="p-2 hover:bg-muted rounded-md cursor-pointer">
										<div className="font-medium text-sm">
											Low stock alert
										</div>
										<div className="text-xs text-muted-foreground">
											Arabian Nights Lamp is running low
										</div>
										<div className="text-xs text-muted-foreground mt-1">
											1 hour ago
										</div>
									</div>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="relative flex items-center gap-2 rounded-full pr-2">
									<Avatar className="h-8 w-8">
										<AvatarImage
											src={user?.profile?.avatar_url || ""}
											alt={user?.email || ""}
										/>
										<AvatarFallback className="text-xs">
											{user?.email
												?.charAt(0)
												.toUpperCase() || "U"}
										</AvatarFallback>
									</Avatar>
									<span className="hidden md:inline-flex text-sm font-medium">
										{user?.email?.split("@")[0] || "Admin"}
									</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-56"
								align="end">
								<DropdownMenuLabel>
									My Account
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => navigate("/")}>
									<Home className="mr-2 h-4 w-4" />
									<span>Visit Store</span>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={handleLogout}>
									<LogOut className="mr-2 h-4 w-4" />
									<span>Log out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</header>

				{/* Page content */}
				<main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
					<div className="mx-auto max-w-7xl">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
};

export default AdminLayout;
