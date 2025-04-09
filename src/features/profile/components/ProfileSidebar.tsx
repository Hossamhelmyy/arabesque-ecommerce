import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from "@/components/ui/avatar";
import {
	User,
	Package,
	Home,
	Heart,
	ShieldCheck,
	LogOut,
} from "lucide-react";
import type { Profile } from "../types";

interface ProfileSidebarProps {
	profile: Profile | null;
	activeTab: string;
	onTabChange: (tab: string) => void;
}

export const ProfileSidebar = ({
	profile,
	activeTab,
	onTabChange,
}: ProfileSidebarProps) => {
	const { t } = useTranslation();
	const { user, signOut } = useAuth();

	const getInitials = (
		firstName?: string | null,
		lastName?: string | null,
	) => {
		if (!firstName && !lastName) return "U";
		return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
	};

	return (
		<Card>
			<CardContent className="p-6">
				<div className="flex flex-col items-center mb-6 text-center">
					<Avatar className="h-24 w-24 mb-4">
						<AvatarImage src={profile?.avatar_url || ""} />
						<AvatarFallback className="text-xl">
							{getInitials(
								profile?.first_name,
								profile?.last_name,
							)}
						</AvatarFallback>
					</Avatar>
					<h2 className="text-xl font-bold">
						{profile?.first_name && profile?.last_name
							? `${profile.first_name} ${profile.last_name}`
							: user?.email}
					</h2>
					<p className="text-sm text-muted-foreground mt-1">
						{user?.email}
					</p>
				</div>

				<div className="space-y-1">
					<Button
						variant={
							activeTab === "profile" ? "default" : "ghost"
						}
						className="w-full justify-start"
						onClick={() => onTabChange("profile")}>
						<User className="mr-2 h-4 w-4" />
						{t("profile.accountDetails")}
					</Button>
					<Button
						variant={
							activeTab === "orders" ? "default" : "ghost"
						}
						className="w-full justify-start"
						onClick={() => onTabChange("orders")}>
						<Package className="mr-2 h-4 w-4" />
						{t("profile.myOrders")}
					</Button>
					<Button
						variant={
							activeTab === "addresses"
								? "default"
								: "ghost"
						}
						className="w-full justify-start"
						onClick={() => onTabChange("addresses")}>
						<Home className="mr-2 h-4 w-4" />
						{t("profile.addresses")}
					</Button>
					<Button
						variant={
							activeTab === "wishlist" ? "default" : "ghost"
						}
						className="w-full justify-start"
						onClick={() => onTabChange("wishlist")}
						asChild>
						<Link to="/favorites">
							<Heart className="mr-2 h-4 w-4" />
							{t("profile.wishlist")}
						</Link>
					</Button>
					<Button
						variant={
							activeTab === "security" ? "default" : "ghost"
						}
						className="w-full justify-start"
						onClick={() => onTabChange("security")}>
						<ShieldCheck className="mr-2 h-4 w-4" />
						{t("profile.passwordSecurity")}
					</Button>
					<Button
						variant="ghost"
						className="w-full justify-start text-destructive hover:text-destructive"
						onClick={signOut}>
						<LogOut className="mr-2 h-4 w-4" />
						{t("common.signOut")}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
