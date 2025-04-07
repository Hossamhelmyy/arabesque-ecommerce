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
import type {
	Order,
	AdminUser,
	UsersData,
	UserProfile,
} from "../types";
import { Tables } from "@/integrations/supabase/types";

const useUsers = (): UsersData => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [selectedUser, setSelectedUser] =
		useState<AdminUser | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [userOrders, setUserOrders] = useState<Order[]>([]);
	const [isOrdersLoading, setIsOrdersLoading] =
		useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Fetch all users with profile data
	const { data: users = [], isLoading } = useQuery({
		queryKey: ["admin", "users"],
		queryFn: async () => {
			try {
				// Fetch users from auth schema
				// In a real app, we would use an admin API endpoint
				// For this demo, we'll fetch profiles and simulate auth data
				const { data: profilesData, error: profilesError } =
					await supabase.from("profiles").select("*");

				if (profilesError) throw profilesError;

				// Create users with profiles and order stats
				const usersWithStats = await Promise.all(
					(profilesData || []).map(async (profile) => {
						// Get order count
						const { count: ordersCount } = await supabase
							.from("orders")
							.select("id", { count: "exact", head: true })
							.eq("user_id", profile.id);

						// Get total spent
						const { data: orders } = await supabase
							.from("orders")
							.select("total")
							.eq("user_id", profile.id);

						const totalSpent =
							orders?.reduce(
								(sum, order) => sum + order.total,
								0,
							) || 0;

						// Get or create address object in the correct format
						let address = null;
						if (profile.address) {
							if (typeof profile.address === "string") {
								try {
									address = JSON.parse(profile.address);
								} catch (e) {
									console.error(
										"Error parsing address:",
										e,
									);
								}
							} else {
								address = profile.address;
							}
						}

						// Create a properly typed user object
						const adminUser: AdminUser = {
							id: profile.id,
							email: `user_${profile.id.substring(
								0,
								4,
							)}@example.com`, // Simulated email
							role:
								Math.random() > 0.9
									? "admin"
									: "authenticated", // Random role for demo
							created_at:
								profile.created_at ||
								new Date().toISOString(),
							profile: {
								id: profile.id,
								first_name: profile.first_name,
								last_name: profile.last_name,
								phone: profile.phone,
								avatar_url: profile.avatar_url,
								address: address,
							},
							orders_count: ordersCount || 0,
							total_spent: totalSpent,
						};

						return adminUser;
					}),
				);

				return usersWithStats || [];
			} catch (error) {
				console.error("Error fetching users:", error);
				toast({
					title: t("common.error"),
					description:
						"Failed to fetch users. Please try again.",
					variant: "destructive",
				});
				return [];
			}
		},
	});

	// Fetch user orders
	const fetchUserOrders = async (userId: string) => {
		try {
			setIsOrdersLoading(true);
			const { data, error } = await supabase
				.from("orders")
				.select("*")
				.eq("user_id", userId)
				.order("created_at", { ascending: false });

			if (error) throw error;

			// Transform the data to match Order type
			const typedOrders: Order[] = (data || []).map(
				(order) => ({
					id: order.id,
					created_at: order.created_at,
					updated_at: order.updated_at || null,
					user_id: order.user_id,
					status: order.status,
					total: order.total,
					payment_method: order.payment_method || "card",
					shipping_address:
						typeof order.shipping_address === "string"
							? JSON.parse(order.shipping_address)
							: order.shipping_address || {},
				}),
			);

			setUserOrders(typedOrders);
		} catch (error) {
			console.error("Error fetching user orders:", error);
			toast({
				title: t("common.error"),
				description: "Failed to fetch user orders.",
				variant: "destructive",
			});
			setUserOrders([]);
		} finally {
			setIsOrdersLoading(false);
		}
	};

	// View user details and fetch their orders
	const viewUserDetails = async (user: AdminUser) => {
		setSelectedUser(user);
		await fetchUserOrders(user.id);
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
			// This is a mock implementation since supabase.auth.admin is not available on the client
			// In a real app, you'd use a server endpoint

			// Simulate API delay
			await new Promise((resolve) =>
				setTimeout(resolve, 1000),
			);

			// Return a mock response
			return { id: userId, role };
		},
		onSuccess: (result) => {
			// Update local state
			queryClient.setQueryData(
				["admin", "users"],
				(oldData: AdminUser[] | undefined) =>
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
	) => {
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
	const getInitials = (user: AdminUser) => {
		if (user.profile?.first_name) {
			return `${user.profile.first_name.charAt(0)}${
				user.profile.last_name
					? user.profile.last_name.charAt(0)
					: ""
			}`;
		}
		return user.email.charAt(0).toUpperCase();
	};

	const getFullName = (user: AdminUser) => {
		if (user.profile?.first_name) {
			return `${user.profile.first_name} ${
				user.profile.last_name || ""
			}`;
		}
		return "N/A";
	};

	// Filter users based on search
	const filteredUsers = (users || []).filter((user) => {
		const searchLower = searchQuery.toLowerCase();
		return (
			searchQuery === "" ||
			user.email.toLowerCase().includes(searchLower) ||
			(user.profile?.first_name || "")
				.toLowerCase()
				.includes(searchLower) ||
			(user.profile?.last_name || "")
				.toLowerCase()
				.includes(searchLower) ||
			user.id.toLowerCase().includes(searchLower)
		);
	});

	return {
		users: filteredUsers,
		selectedUser,
		isLoading,
		isSubmitting,
		searchQuery,
		setSelectedUser,
		setSearchQuery,
		viewUserDetails,
		updateUserRole,
		userOrders,
		isOrdersLoading,
		formatDate,
		formatCurrency,
		getInitials,
		getFullName,
	};
};

export default useUsers;
