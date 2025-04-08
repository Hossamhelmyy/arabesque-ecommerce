import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Header from "@/components/layout/Header";
import { useEffect } from "react";

const AdminLayout = () => {
	// Set the admin mode flag for Header component
	useEffect(() => {
		document.body.classList.add("admin-mode");
		return () => {
			document.body.classList.remove("admin-mode");
		};
	}, []);

	return (
		<div className="flex min-h-screen flex-col">
			<Header isAdmin={true} />

			<div className="flex flex-1">
				<AdminSidebar />
				<main className="flex-1 p-6 md:p-8 overflow-x-hidden">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default AdminLayout;
