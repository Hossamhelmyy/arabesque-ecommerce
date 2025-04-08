import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	useQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { User, UsersData, Profile } from "../types";

export const useUsers = (): UsersData => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [selectedUser, setSelectedUser] =
		useState<User | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Fetch all users with profile data
	const { data: users = [], isLoading } = useQuery({
		queryKey: ["admin", "profiles"],
		queryFn: async () => {
			try {
				// Fetch profiles from the profiles table
				const { data: profilesData, error: profilesError } =
					await supabase.from("profiles").select("*");

				if (profilesError) throw profilesError;

				// Create users with profiles and order stats
				const usersWithData = await Promise.all(
					(
						(profilesData as unknown as Profile[]) || []
					).map(async (profile: Profile) => {
						// Get order count from orders table
						const { count: ordersCount } = await supabase
							.from("orders")
							.select("id", {
								count: "exact",
								head: true,
							})
							.eq("user_id", profile.id);

						// Get total spent from orders
						const { data: orders } = await supabase
							.from("orders")
							.select("total")
							.eq("user_id", profile.id);

						const totalSpent =
							orders?.reduce(
								(sum, order) => sum + order.total,
								0,
							) || 0;

						// Create a properly typed user object
						const user: User = {
							id: profile.id,
							name: profile.email,
							email: profile.email,
							role: profile.role,
							avatar: profile.avatar_url || "",
							createdAt:
								profile.created_at ||
								new Date().toISOString(),
							profiles: {
								first_name: profile.first_name,
								last_name: profile.last_name,
								avatar_url: profile.avatar_url,
								email: profile.email,
							},
						};

						return user;
					}),
				);

				return usersWithData || [];
			} catch (error) {
				console.error("Error fetching users:", error);
				toast({
					title: t("common.error"),
					description:
						"Failed to fetch users. Please try again.",
					variant: "destructive",
				});

				// Provide fallback mock data for development

				return;
			}
		},
	});

	// View user details
	const viewUserDetails = (user: User) => {
		setSelectedUser(user);
	};

	// Update user role mutation
	const updateUserRoleMutation = useMutation({
		mutationFn: async ({
			userId,
			role,
		}: {
			userId: string;
			role: string;
		}) => {
			// In a real app, this would update a user_roles table
			// For this demo, we'll simulate a successful update
			await new Promise((resolve) =>
				setTimeout(resolve, 500),
			); // Simulate API delay
			return { id: userId, role };
		},
		onSuccess: (result) => {
			// Update local cache
			queryClient.setQueryData(
				["admin", "profiles"],
				(oldData: User[] | undefined) =>
					(oldData || []).map((user) =>
						user.id === result.id
							? { ...user, role: result.role }
							: user,
					),
			);

			toast({
				title: "Success",
				description: `User role updated to ${result.role}.`,
			});
		},
		onError: (error) => {
			console.error("Error updating user role:", error);
			toast({
				title: t("common.error"),
				description: "Failed to update user role.",
				variant: "destructive",
			});
		},
	});

	// Update user role wrapper function
	const updateUserRole = async (
		userId: string,
		role: string,
	): Promise<boolean> => {
		try {
			setIsSubmitting(true);
			await updateUserRoleMutation.mutateAsync({
				userId,
				role,
			});

			// Update selected user if it's the one being updated
			if (selectedUser && selectedUser.id === userId) {
				setSelectedUser({ ...selectedUser, role });
			}

			return true;
		} catch (error) {
			console.error(error);
			return false;
		} finally {
			setIsSubmitting(false);
		}
	};

	// Format functions
	const formatDate = (dateString: string) => {
		return format(new Date(dateString), "MMM dd, yyyy");
	};

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(value);
	};

	// Helper functions
	const getInitials = (user: User) => {
		if (user.profiles?.first_name) {
			return `${user.profiles.first_name.charAt(0)}${
				user.profiles.last_name
					? user.profiles.last_name.charAt(0)
					: ""
			}`.toUpperCase();
		}
		return (user.email || "").charAt(0).toUpperCase();
	};

	const getFullName = (user: User) => {
		if (user.profiles?.first_name) {
			return `${user.profiles.first_name} ${
				user.profiles.last_name || ""
			}`.trim();
		}
		return "N/A";
	};

	// Filter users based on search
	const filteredUsers = users.filter((user) => {
		const searchLower = searchQuery.toLowerCase();
		return (
			searchQuery === "" ||
			(user.email || "")
				.toLowerCase()
				.includes(searchLower) ||
			(user.name || "")
				.toLowerCase()
				.includes(searchLower) ||
			(user.role || "")
				.toLowerCase()
				.includes(searchLower) ||
			user.id.toLowerCase().includes(searchLower)
		);
	});

	// Function to refresh users data
	const fetchUsers = async () => {
		await queryClient.invalidateQueries({
			queryKey: ["admin", "profiles"],
		});
	};

	return {
		users: filteredUsers,
		selectedUser,
		isLoading,
		isSubmitting,
		searchQuery,
		setSearchQuery,
		fetchUsers,
		viewUserDetails,
		updateUserRole,
		formatDate,
		formatCurrency,
		getInitials,
		getFullName,
	};
};
