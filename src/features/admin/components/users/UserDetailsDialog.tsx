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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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

	const getRoleBadgeVariant = (role: string) => {
		switch (role) {
			case "admin":
				return "default";
			case "moderator":
				return "secondary";
			default:
				return "outline";
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[525px] p-0">
				<DialogHeader className="p-6 pb-0">
					<DialogTitle className="text-2xl">
						{t("admin.userDetails")}
					</DialogTitle>
					<DialogDescription>
						{t("admin.userDetailsDesc")}
					</DialogDescription>
				</DialogHeader>

				<ScrollArea className="max-h-[80vh]">
					<div className="p-6">
						<div className="flex items-start space-x-4 pb-6">
							<Avatar className="h-20 w-20 border-2 border-border">
								<AvatarImage
									src={user.avatar}
									alt={user.name}
									className="object-cover"
								/>
								<AvatarFallback className="text-lg">
									{getInitials(user.name)}
								</AvatarFallback>
							</Avatar>
							<div className="space-y-1">
								<h3 className="text-xl font-semibold tracking-tight">
									{user.name}
								</h3>
								<p className="text-sm text-muted-foreground">
									{user.email}
								</p>
								<Badge
									variant={getRoleBadgeVariant(
										user.role || "customer",
									)}>
									{user.role
										? t(`admin.${user.role}Role`)
										: t("admin.customerRole")}
								</Badge>
								<p className="text-sm text-muted-foreground pt-1">
									{t("admin.memberSince")}:{" "}
									{formatDate(user.createdAt)}
								</p>
							</div>
						</div>

						<Separator className="mb-6" />

						<Tabs defaultValue="account" className="w-full">
							<TabsList className="grid w-full grid-cols-2 mb-4">
								<TabsTrigger
									value="account"
									className="text-sm">
									{t("admin.accountInfo")}
								</TabsTrigger>
								<TabsTrigger
									value="role"
									className="text-sm">
									{t("admin.roleManagement")}
								</TabsTrigger>
							</TabsList>

							<TabsContent
								value="account"
								className="space-y-6 mt-0 animate-in fade-in-50">
								<div className="space-y-4">
									<div className="grid grid-cols-4 items-center gap-4">
										<Label className="text-right font-medium text-muted-foreground">
											{t("admin.userId")}
										</Label>
										<code className="col-span-3 text-sm bg-muted px-2 py-1 rounded">
											{user.id}
										</code>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label className="text-right font-medium text-muted-foreground">
											{t("admin.email")}
										</Label>
										<div className="col-span-3 text-sm">
											{user.email}
										</div>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label className="text-right font-medium text-muted-foreground">
											{t("admin.currentRole")}
										</Label>
										<div className="col-span-3">
											<Badge
												variant={getRoleBadgeVariant(
													user.role || "customer",
												)}>
												{user.role
													? t(`admin.${user.role}Role`)
													: t("admin.customerRole")}
											</Badge>
										</div>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label className="text-right font-medium text-muted-foreground">
											{t("admin.lastLogin")}
										</Label>
										<div className="col-span-3 text-sm">
											{user.lastLogin
												? formatDate(user.lastLogin)
												: t("admin.notAvailable")}
										</div>
									</div>
								</div>
							</TabsContent>

							<TabsContent
								value="role"
								className="mt-0 animate-in fade-in-50">
								<div className="space-y-4">
									<div>
										<Label
											htmlFor="role"
											className="text-sm font-medium">
											{t("admin.selectRole")}
										</Label>
										<Select
											value={selectedRole}
											onValueChange={handleRoleChange}
											disabled={isSubmitting}>
											<SelectTrigger
												id="role"
												className="w-full mt-1.5">
												<SelectValue
													placeholder={t(
														"admin.selectRole",
													)}
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
										<p className="text-sm text-muted-foreground mt-2">
											{t("admin.roleChangeWarning")}
										</p>
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</ScrollArea>

				<DialogFooter className="p-6 pt-0">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						className="mr-2">
						{t("common.cancel")}
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={
							isSubmitting || selectedRole === user.role
						}
						className="min-w-[100px]">
						{isSubmitting
							? t("common.saving")
							: t("common.saveChanges")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
