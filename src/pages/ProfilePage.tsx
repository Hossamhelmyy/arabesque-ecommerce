import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
	useQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { ProfileSidebar } from "@/features/profile/components/ProfileSidebar";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { PasswordForm } from "@/features/profile/components/PasswordForm";
import { OrdersList } from "@/features/profile/components/OrdersList";
import { AddressesList } from "@/features/profile/components/AddressesList";
import { ProfilePageSkeleton } from "@/features/profile/components/ProfilePageSkeleton";
import {
	fetchProfile,
	fetchOrders,
	fetchAddresses,
	updateProfile,
	updatePassword,
} from "@/features/profile/api";
import type {
	ProfileFormValues,
	PasswordFormValues,
} from "@/features/profile/types";

const ProfilePage = () => {
	const { t } = useTranslation();
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = useState("profile");

	// Fetch profile data
	const { data: profile, isLoading: profileLoading } =
		useQuery({
			queryKey: ["profile", user?.id],
			queryFn: () => (user ? fetchProfile(user.id) : null),
			enabled: !!user,
		});

	// Fetch orders
	const { data: orders, isLoading: ordersLoading } =
		useQuery({
			queryKey: ["orders", user?.id],
			queryFn: () => (user ? fetchOrders(user.id) : []),
			enabled: !!user,
		});

	// Fetch addresses
	const { isLoading: addressesLoading } = useQuery({
		queryKey: ["addresses", user?.id],
		queryFn: () => (user ? fetchAddresses(user.id) : []),
		enabled: !!user,
	});

	// Update profile mutation
	const updateProfileMutation = useMutation({
		mutationFn: (data: ProfileFormValues) =>
			user
				? updateProfile(user.id, data)
				: Promise.reject(),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["profile", user?.id],
			});
			toast({
				title: t("profile.updateSuccess"),
				description: t("profile.updateSuccessMessage"),
			});
		},
		onError: (error) => {
			console.error("Error updating profile:", error);
			toast({
				title: t("common.error"),
				description: "Failed to update profile",
				variant: "destructive",
			});
		},
	});

	// Update password mutation
	const updatePasswordMutation = useMutation({
		mutationFn: (data: PasswordFormValues) =>
			updatePassword(data.newPassword),
		onSuccess: () => {
			toast({
				title: t("profile.passwordUpdated"),
				description: t("profile.passwordUpdatedMessage"),
			});
		},
		onError: (error) => {
			console.error("Error changing password:", error);
			toast({
				title: t("common.error"),
				description: "Failed to update password",
				variant: "destructive",
			});
		},
	});

	const handleProfileSubmit = async (
		data: ProfileFormValues,
	) => {
		await updateProfileMutation.mutateAsync(data);
	};

	const handlePasswordSubmit = async (
		data: PasswordFormValues,
	) => {
		await updatePasswordMutation.mutateAsync(data);
	};

	if (profileLoading) {
		return <ProfilePageSkeleton />;
	}

	if (!user && !profileLoading) {
		return (
			<div className="container py-12">
				<div className="text-center py-16">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
						<User className="h-8 w-8 text-muted-foreground" />
					</div>
					<h2 className="text-xl font-medium mb-2">
						{t("profile.notLoggedIn")}
					</h2>
					<p className="text-muted-foreground max-w-md mx-auto mb-6">
						{t("profile.notLoggedInMessage")}
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button asChild>
							<Link to="/auth">
								{t("profile.signInButton")}
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link to="/auth?signup=true">
								{t("profile.createAccountButton")}
							</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container py-8 md:py-12">
			<div className="flex flex-col md:flex-row gap-8">
				{/* Sidebar */}
				<div className="md:w-1/4">
					<ProfileSidebar
						profile={profile}
						activeTab={activeTab}
						onTabChange={setActiveTab}
					/>
				</div>

				{/* Main content */}
				<div className="md:w-3/4">
					{activeTab === "profile" && (
						<ProfileForm
							profile={profile}
							isUpdating={updateProfileMutation.isPending}
							onSubmit={handleProfileSubmit}
						/>
					)}

					{activeTab === "orders" && (
						<OrdersList
							orders={orders}
							isLoading={ordersLoading}
						/>
					)}

					{activeTab === "addresses" && <AddressesList />}

					{activeTab === "security" && (
						<PasswordForm
							isChangingPassword={
								updatePasswordMutation.isPending
							}
							onSubmit={handlePasswordSubmit}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
