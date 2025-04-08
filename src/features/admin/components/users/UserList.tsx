import { useTranslation } from "react-i18next";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EyeIcon } from "lucide-react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { User } from "../../types";

interface UserListProps {
	users: User[];
	isLoading: boolean;
	onViewDetails: (user: User) => void;
	formatDate: (date: string) => string;
}

export const UserList = ({
	users,
	isLoading,
	onViewDetails,
	formatDate,
}: UserListProps) => {
	const { t } = useTranslation();

	const getRoleBadge = (role: string) => {
		switch (role?.toLowerCase()) {
			case "admin":
				return (
					<Badge className="bg-red-500">
						{t("admin.adminRole")}
					</Badge>
				);
			case "moderator":
				return (
					<Badge className="bg-orange-500">
						{t("admin.moderatorRole")}
					</Badge>
				);
			default:
				return (
					<Badge variant="outline">
						{t("admin.customerRole")}
					</Badge>
				);
		}
	};

	const getInitials = (name: string) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("admin.usersList")}</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="space-y-4">
						<div className="flex items-center space-x-4">
							<Skeleton className="h-12 w-12 rounded-full" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-[250px]" />
								<Skeleton className="h-4 w-[200px]" />
							</div>
						</div>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t("admin.user")}</TableHead>
									<TableHead>{t("admin.email")}</TableHead>
									<TableHead>{t("admin.role")}</TableHead>
									<TableHead>{t("admin.joined")}</TableHead>
									<TableHead>
										{t("admin.actions")}
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{Array.from({ length: 5 }).map(
									(_, index) => (
										<TableRow key={index}>
											<TableCell>
												<div className="flex items-center space-x-4">
													<Skeleton className="h-10 w-10 rounded-full" />
													<Skeleton className="h-4 w-[150px]" />
												</div>
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-[180px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-[100px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-[80px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-8 w-8" />
											</TableCell>
										</TableRow>
									),
								)}
							</TableBody>
						</Table>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t("admin.user")}</TableHead>
								<TableHead>{t("admin.email")}</TableHead>
								<TableHead>{t("admin.role")}</TableHead>
								<TableHead>{t("admin.joined")}</TableHead>
								<TableHead>{t("admin.actions")}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={5}
										className="text-center">
										{t("admin.noUsers")}
									</TableCell>
								</TableRow>
							) : (
								users.map((user) => (
									<TableRow key={user.id}>
										<TableCell>
											<div className="flex items-center space-x-3">
												<Avatar>
													<AvatarImage
														src={user.avatar}
														alt={user.name}
													/>
													<AvatarFallback>
														{getInitials(user.name)}
													</AvatarFallback>
												</Avatar>
												<div className="font-medium">
													{user.name}
												</div>
											</div>
										</TableCell>
										<TableCell>{user.email}</TableCell>
										<TableCell>
											{getRoleBadge(user.role)}
										</TableCell>
										<TableCell>
											{formatDate(user.createdAt)}
										</TableCell>
										<TableCell>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => onViewDetails(user)}
												title={t("admin.viewDetails")}>
												<EyeIcon className="h-4 w-4" />
											</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
};
