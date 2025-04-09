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
import { useLanguage } from "@/context/LanguageContext";
import {
	ScrollArea,
	ScrollBar,
} from "@/components/ui/scroll-area";

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
	const { isRTL } = useLanguage();

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
						<ScrollArea
							dir={isRTL ? "rtl" : "ltr"}
							className="w-full">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="text-start whitespace-nowrap">
											{t("admin.user")}
										</TableHead>
										<TableHead className="text-start whitespace-nowrap">
											{t("admin.email")}
										</TableHead>
										<TableHead className="text-start whitespace-nowrap">
											{t("admin.role")}
										</TableHead>
										<TableHead className="text-start whitespace-nowrap">
											{t("admin.joined")}
										</TableHead>
										<TableHead className="text-start whitespace-nowrap">
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
														<Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
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
						</ScrollArea>
					</div>
				) : (
					<ScrollArea
						dir={isRTL ? "rtl" : "ltr"}
						className="w-full">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="text-start whitespace-nowrap">
										{t("admin.user")}
									</TableHead>
									<TableHead className="text-start whitespace-nowrap">
										{t("admin.email")}
									</TableHead>
									<TableHead className="text-start whitespace-nowrap">
										{t("admin.role")}
									</TableHead>
									<TableHead className="text-start whitespace-nowrap">
										{t("admin.joined")}
									</TableHead>
									<TableHead className="text-start whitespace-nowrap">
										{t("admin.actions")}
									</TableHead>
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
											<TableCell
												dir={isRTL ? "rtl" : "ltr"}>
												<div className="flex items-center gap-3">
													<Avatar className="flex-shrink-0">
														<AvatarImage
															src={user.avatar}
															alt={user.name}
														/>
														<AvatarFallback>
															{getInitials(user.name)}
														</AvatarFallback>
													</Avatar>
													<div className="font-medium  truncate">
														{user.name}
													</div>
												</div>
											</TableCell>
											<TableCell className="max-w-[180px] truncate whitespace-nowrap">
												{user.email}
											</TableCell>
											<TableCell className="whitespace-nowrap">
												{getRoleBadge(user.role)}
											</TableCell>
											<TableCell className="whitespace-nowrap">
												{formatDate(user.createdAt)}
											</TableCell>
											<TableCell className="whitespace-nowrap">
												<Button
													variant="ghost"
													size="icon"
													onClick={() =>
														onViewDetails(user)
													}
													title={t("admin.viewDetails")}>
													<EyeIcon className="h-4 w-4" />
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				)}
			</CardContent>
		</Card>
	);
};
