import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Header from "@/components/layout/Header";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminLayout = () => {
	// Set the admin mode flag for Header component
	useEffect(() => {
		document.body.classList.add("admin-mode");
		return () => {
			document.body.classList.remove("admin-mode");
		};
	}, []);

	const isMobile = useIsMobile();

	return (
		<div className="flex min-h-screen flex-col">
			<div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur flex items-center">
				<div className="container flex h-16 items-center">
					{isMobile && <AdminSidebar isMobile={true} />}
					<Header isAdmin={true} />
				</div>
			</div>

			<div className="flex flex-1">
				<AdminSidebar />
				<main className="flex-1 p-4 md:p-5 overflow-x-hidden">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default AdminLayout;
