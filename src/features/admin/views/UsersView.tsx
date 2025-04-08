import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { useUsers } from "../hooks/useUsers";
import { UserList } from "../components/users/UserList";
import { UserHeader } from "../components/users/UserHeader";
import { UserDetailsDialog } from "../components/users/UserDetailsDialog";
import type { User } from "../types";

export const UsersView = () => {
	const { t } = useTranslation();
	const { toast } = useToast();
	const {
		users,
		isLoading,
		isSubmitting,
		updateUserRole,
		formatDate,
		searchQuery,
		setSearchQuery,
		viewUserDetails,
		selectedUser,
	} = useUsers();

	const [userDetailsOpen, setUserDetailsOpen] =
		useState(false);

	// Filter users based on search query
	const filteredUsers = users.filter((user) => {
		if (!searchQuery.trim()) return true;

		const query = searchQuery.toLowerCase();
		return (
			user.name.toLowerCase().includes(query) ||
			user.email.toLowerCase().includes(query) ||
			(user.role && user.role.toLowerCase().includes(query))
		);
	});

	// Handle search input change
	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	// Handle viewing user details
	const handleViewDetails = (user: User) => {
		viewUserDetails(user);
		setUserDetailsOpen(true);
	};

	// Handle role update
	const handleUpdateRole = async (
		userId: string,
		role: string,
	) => {
		try {
			await updateUserRole(userId, role);
			toast({
				title: t("admin.roleUpdated"),
				description: t("admin.userRoleUpdatedDesc"),
			});
			setUserDetailsOpen(false);
		} catch (error) {
			toast({
				title: t("admin.error"),
				description: t("admin.errorUpdatingRole"),
				variant: "destructive",
			});
		}
	};

	return (
		<div className="container mx-auto py-6 space-y-6">
			<UserHeader
				searchQuery={searchQuery}
				onSearch={handleSearch}
			/>

			<UserList
				users={filteredUsers}
				isLoading={isLoading}
				onViewDetails={handleViewDetails}
				formatDate={formatDate}
			/>

			{selectedUser && (
				<UserDetailsDialog
					open={userDetailsOpen}
					onOpenChange={setUserDetailsOpen}
					user={selectedUser}
					onUpdateRole={handleUpdateRole}
					isSubmitting={isSubmitting}
					formatDate={formatDate}
				/>
			)}
		</div>
	);
};
