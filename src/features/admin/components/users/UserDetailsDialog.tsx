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
import { ScrollArea } from "@/components/ui/scroll-area";
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
			<DialogContent className="p-0 w-[100vw] sm:max-w-[525px]">
				<div className="p-6">
					<DialogHeader className="pb-4 !text-center">
						<DialogTitle className="text-2xl">
							{t("admin.userDetails")}
						</DialogTitle>
						<DialogDescription>
							{t("admin.userDetailsDesc")}
						</DialogDescription>
					</DialogHeader>
					<ScrollArea className="sm:h-[50dvh] h-[calc(100dvh-110px)] pe-3">
						<div className="flex flex-col space-y-6">
							<div className="flex items-start space-x-4">
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

							<Separator />

							<Tabs
								defaultValue="account"
								className="w-full">
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
									className="space-y-6 mt-0">
									<div className="space-y-4">
										<div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
											<Label className="text-left sm:text-right font-medium text-muted-foreground">
												{t("admin.userId")}
											</Label>
											<code className="col-span-1 sm:col-span-3 text-sm bg-muted px-2 py-1 rounded">
												{user.id}
											</code>
										</div>
										<div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
											<Label className="text-left sm:text-right font-medium text-muted-foreground">
												{t("admin.email")}
											</Label>
											<div className="col-span-1 sm:col-span-3 text-sm">
												{user.email}
											</div>
										</div>
										<div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
											<Label className="text-left sm:text-right font-medium text-muted-foreground">
												{t("admin.currentRole")}
											</Label>
											<div className="col-span-1 sm:col-span-3">
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
										<div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
											<Label className="text-left sm:text-right font-medium text-muted-foreground">
												{t("admin.lastLogin")}
											</Label>
											<div className="col-span-1 sm:col-span-3 text-sm">
												{user.lastLogin
													? formatDate(user.lastLogin)
													: t("admin.notAvailable")}
											</div>
										</div>
									</div>
								</TabsContent>

								<TabsContent
									value="role"
									className="space-y-6 mt-0">
									<div className="space-y-4">
										<div>
											<Label htmlFor="role">
												{t("admin.selectRole")}
											</Label>
											<Select
												value={selectedRole}
												onValueChange={handleRoleChange}>
												<SelectTrigger className="mt-1">
													<SelectValue />
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
											<p className="mt-2 text-sm text-muted-foreground">
												{t("admin.roleChangeWarning")}
											</p>
										</div>
									</div>
								</TabsContent>
							</Tabs>

							<DialogFooter className="mt-6 pt-4 border-t">
								<Button
									variant="outline"
									onClick={() => onOpenChange(false)}>
									{t("common.cancel")}
								</Button>
								<Button
									onClick={handleSubmit}
									disabled={isSubmitting}>
									{isSubmitting ? (
										<Skeleton className="h-5 w-20" />
									) : (
										t("common.save")
									)}
								</Button>
							</DialogFooter>
						</div>
					</ScrollArea>
				</div>
			</DialogContent>
		</Dialog>
	);
};
