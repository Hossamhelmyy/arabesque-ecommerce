import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import type { User } from "../types";

// Define the response type from Supabase for better type safety
interface UserResponse {
	id: string;
	email: string;
	role?: string;
	created_at: string;
	profiles?: {
		first_name?: string;
		last_name?: string;
		avatar_url?: string;
	};
}

export const useUsers = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [selectedUser, setSelectedUser] =
		useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const { toast } = useToast();

	const fetchUsers = useCallback(async () => {
		try {
			setIsLoading(true);
			const { data, error } = await supabase.from("users")
				.select(`
				id,
				email,
				role,
				created_at,
				profiles:profiles(
					id,
					first_name,
					last_name,
					avatar_url
				)
			`);

			if (error) throw error;

			// Transform the data to match our User interface
			const transformedUsers: User[] = (
				data as UserResponse[]
			).map((userData) => ({
				id: userData.id,
				name: userData.profiles
					? `${userData.profiles.first_name || ""} ${
							userData.profiles.last_name || ""
					  }`.trim()
					: userData.email.split("@")[0],
				email: userData.email,
				role: userData.role || "customer",
				avatar: userData.profiles?.avatar_url || "",
				createdAt: userData.created_at,
			}));

			setUsers(transformedUsers);
		} catch (error) {
			console.error("Error fetching users:", error);
			toast({
				title: "Error",
				description:
					"Failed to load users. Please try again.",
				variant: "destructive",
			});

			// Provide mock data for development
			const mockUsers: User[] = [
				{
					id: "1",
					name: "John Doe",
					email: "john@example.com",
					role: "admin",
					avatar: "",
					createdAt: new Date().toISOString(),
				},
				{
					id: "2",
					name: "Jane Smith",
					email: "jane@example.com",
					role: "customer",
					avatar: "",
					createdAt: new Date().toISOString(),
				},
				{
					id: "3",
					name: "Bob Johnson",
					email: "bob@example.com",
					role: "moderator",
					avatar: "",
					createdAt: new Date(
						Date.now() - 30 * 24 * 60 * 60 * 1000,
					).toISOString(),
				},
			];
			setUsers(mockUsers);
		} finally {
			setIsLoading(false);
		}
	}, [toast]);

	const updateUserRole = useCallback(
		async (userId: string, role: string) => {
			try {
				setIsSubmitting(true);
				// In a real app, this would update the user's role in Supabase
				// const { error } = await supabase.from("users").update({ role }).eq("id", userId);
				// if (error) throw error;

				// For demo purposes, we'll just update the state
				setUsers((prevUsers) =>
					prevUsers.map((user) =>
						user.id === userId ? { ...user, role } : user,
					),
				);

				return true;
			} catch (error) {
				console.error("Error updating user role:", error);
				throw error;
			} finally {
				setIsSubmitting(false);
			}
		},
		[],
	);

	const viewUserDetails = useCallback((user: User) => {
		setSelectedUser(user);
	}, []);

	const formatDate = useCallback((dateString: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "short",
			day: "numeric",
		};
		return new Date(dateString).toLocaleDateString(
			undefined,
			options,
		);
	}, []);

	const formatCurrency = useCallback((amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	}, []);

	const getInitials = useCallback((user: User) => {
		const firstName = user.profiles?.first_name || "";
		const lastName = user.profiles?.last_name || "";
		return `${firstName.charAt(0)}${lastName.charAt(
			0,
		)}`.toUpperCase();
	}, []);

	const getFullName = useCallback((user: User) => {
		const firstName = user.profiles?.first_name || "";
		const lastName = user.profiles?.last_name || "";
		return firstName || lastName
			? `${firstName} ${lastName}`.trim()
			: "No Name";
	}, []);

	// Load users on mount
	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	return {
		users,
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
