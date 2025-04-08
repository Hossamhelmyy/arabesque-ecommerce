import { useTranslation } from "react-i18next";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
	Pencil,
	Trash2,
	Plus,
	MoveVertical,
} from "lucide-react";
import type { BannerItem } from "../../types";

interface BannerListProps {
	banners: BannerItem[];
	isLoading: boolean;
	onEdit: (banner: BannerItem) => void;
	onDelete: (bannerId: string) => void;
	onCreate: () => void;
}

export const BannerList = ({
	banners,
	isLoading,
	onEdit,
	onDelete,
	onCreate,
}: BannerListProps) => {
	const { t } = useTranslation();

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-xl font-semibold">
					{t("admin.homepageBanners")}
				</h2>
				<Button onClick={onCreate}>
					<Plus className="mr-2 h-4 w-4" />
					{t("admin.addBanner")}
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>{t("admin.manageBanners")}</CardTitle>
					<CardDescription>
						{t("admin.manageBannersDesc")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="space-y-3">
							{Array.from({ length: 3 }).map((_, index) => (
								<div
									key={index}
									className="flex items-center space-x-4 p-4 border rounded-md">
									<Skeleton className="h-5 w-5" />
									<Skeleton className="h-16 w-16" />
									<div className="flex-1 space-y-2">
										<Skeleton className="h-4 w-[200px]" />
										<Skeleton className="h-3 w-[100px]" />
									</div>
									<Skeleton className="h-7 w-16" />
									<div className="flex space-x-2">
										<Skeleton className="h-9 w-9" />
										<Skeleton className="h-9 w-9" />
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="space-y-3">
							{banners.length === 0 ? (
								<p className="text-center py-8 text-muted-foreground">
									{t("admin.noBanners")}
								</p>
							) : (
								banners.map((banner) => (
									<div
										key={banner.id}
										className="flex items-center space-x-4 p-4 border rounded-md">
										<div className="flex-none">
											<MoveVertical className="h-5 w-5 text-muted-foreground cursor-move" />
										</div>
										<div className="flex-none w-16 h-16 rounded-md overflow-hidden bg-gray-100">
											<img
												src={banner.image}
												alt={banner.title}
												className="w-full h-full object-cover"
												onError={(e) => {
													(
														e.target as HTMLImageElement
													).src =
														"https://placehold.co/400?text=Error";
												}}
											/>
										</div>
										<div className="flex-1">
											<h3 className="font-medium">
												{banner.title}
											</h3>
											<p className="text-sm text-muted-foreground">
												{t("admin.position")}:{" "}
												{banner.position}
											</p>
										</div>
										<div className="flex-none">
											<Badge
												variant={
													banner.active
														? "default"
														: "outline"
												}
												className="whitespace-nowrap">
												{banner.active
													? t("admin.active")
													: t("admin.inactive")}
											</Badge>
										</div>
										<div className="flex-none flex space-x-2">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => onEdit(banner)}>
												<Pencil className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="text-destructive"
												onClick={() => onDelete(banner.id)}>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								))
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};
