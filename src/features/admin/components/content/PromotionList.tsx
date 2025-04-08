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
	Calendar,
} from "lucide-react";
import type { Promotion } from "../../types";

interface PromotionListProps {
	promotions: Promotion[];
	isLoading: boolean;
	onEdit: (promotion: Promotion) => void;
	onDelete: (promotionId: string) => void;
	onCreate: () => void;
	formatDate: (date: string) => string;
}

export const PromotionList = ({
	promotions,
	isLoading,
	onEdit,
	onDelete,
	onCreate,
	formatDate,
}: PromotionListProps) => {
	const { t } = useTranslation();

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-xl font-semibold">
					{t("admin.promotions")}
				</h2>
				<Button onClick={onCreate}>
					<Plus className="mr-2 h-4 w-4" />
					{t("admin.addPromotion")}
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>
						{t("admin.managePromotions")}
					</CardTitle>
					<CardDescription>
						{t("admin.managePromotionsDesc")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="space-y-3">
							{Array.from({ length: 3 }).map((_, index) => (
								<div
									key={index}
									className="flex items-center space-x-4 p-4 border rounded-md">
									<Skeleton className="h-16 w-16" />
									<div className="flex-1 space-y-2">
										<Skeleton className="h-4 w-[250px]" />
										<Skeleton className="h-3 w-[150px]" />
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
							{promotions.length === 0 ? (
								<p className="text-center py-8 text-muted-foreground">
									{t("admin.noPromotions")}
								</p>
							) : (
								promotions.map((promotion) => (
									<div
										key={promotion.id}
										className="flex items-center space-x-4 p-4 border rounded-md">
										<div className="flex-none w-16 h-16 rounded-md overflow-hidden bg-gray-100">
											<img
												src={
													promotion.image ||
													"https://placehold.co/400?text=No+Image"
												}
												alt={promotion.title}
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
												{promotion.title}
											</h3>
											<div className="flex items-center text-sm text-muted-foreground">
												<Calendar className="h-3.5 w-3.5 mr-1" />
												{formatDate(promotion.startDate)} -{" "}
												{formatDate(promotion.endDate)}
											</div>
										</div>
										<div className="flex-none">
											<Badge
												variant={
													promotion.active
														? "default"
														: "outline"
												}
												className="whitespace-nowrap">
												{promotion.active
													? t("admin.active")
													: t("admin.inactive")}
											</Badge>
										</div>
										<div className="flex-none flex space-x-2">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => onEdit(promotion)}>
												<Pencil className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="text-destructive"
												onClick={() =>
													onDelete(promotion.id)
												}>
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
