import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "../../types";

interface UserDetailsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: User;
	onUpdateRole: (userId: string, role: string) => void;
	isSubmitting: boolean;
	formatDate: (date: string) => string;
}

export const UserDetailsDialog = ({
	open,
	onOpenChange,
	user,
	onUpdateRole,
	isSubmitting,
	formatDate,
}: UserDetailsDialogProps) => {
	const { t } = useTranslation();
	const [selectedRole, setSelectedRole] = useState(
		user.role || "customer",
	);

	const getInitials = (name: string) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	};

	const handleRoleChange = (value: string) => {
		setSelectedRole(value);
	};

	const handleSubmit = () => {
		onUpdateRole(user.id, selectedRole);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>
						{t("admin.userDetails")}
					</DialogTitle>
					<DialogDescription>
						{t("admin.userDetailsDesc")}
					</DialogDescription>
				</DialogHeader>

				<div className="flex items-center space-x-4 py-4">
					<Avatar className="h-16 w-16">
						<AvatarImage
							src={user.avatar}
							alt={user.name}
						/>
						<AvatarFallback>
							{getInitials(user.name)}
						</AvatarFallback>
					</Avatar>
					<div>
						<h3 className="text-lg font-medium">
							{user.name}
						</h3>
						<p className="text-sm text-muted-foreground">
							{user.email}
						</p>
						<p className="text-sm text-muted-foreground">
							{t("admin.memberSince")}:{" "}
							{formatDate(user.createdAt)}
						</p>
					</div>
				</div>

				<Tabs defaultValue="account">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="account">
							{t("admin.accountInfo")}
						</TabsTrigger>
						<TabsTrigger value="role">
							{t("admin.roleManagement")}
						</TabsTrigger>
					</TabsList>

					<TabsContent
						value="account"
						className="space-y-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label className="text-right font-medium">
								{t("admin.userId")}
							</Label>
							<div className="col-span-3 text-sm">
								{user.id.substring(0, 8)}...
							</div>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label className="text-right font-medium">
								{t("admin.email")}
							</Label>
							<div className="col-span-3 text-sm">
								{user.email}
							</div>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label className="text-right font-medium">
								{t("admin.currentRole")}
							</Label>
							<div className="col-span-3 text-sm">
								{user.role || t("admin.customerRole")}
							</div>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label className="text-right font-medium">
								{t("admin.lastLogin")}
							</Label>
							<div className="col-span-3 text-sm">
								{user.lastLogin
									? formatDate(user.lastLogin)
									: t("admin.notAvailable")}
							</div>
						</div>
					</TabsContent>

					<TabsContent
						value="role"
						className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="role">
								{t("admin.selectRole")}
							</Label>
							<Select
								value={selectedRole}
								onValueChange={handleRoleChange}
								disabled={isSubmitting}>
								<SelectTrigger id="role">
									<SelectValue
										placeholder={t("admin.selectRole")}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="admin">
										{t("admin.adminRole")}
									</SelectItem>
									<SelectItem value="moderator">
										{t("admin.moderatorRole")}
									</SelectItem>
									<SelectItem value="customer">
										{t("admin.customerRole")}
									</SelectItem>
								</SelectContent>
							</Select>
							<p className="text-sm text-muted-foreground">
								{t("admin.roleChangeWarning")}
							</p>
						</div>
					</TabsContent>
				</Tabs>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}>
						{t("common.cancel")}
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={
							isSubmitting || selectedRole === user.role
						}>
						{isSubmitting
							? t("common.saving")
							: t("common.saveChanges")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
