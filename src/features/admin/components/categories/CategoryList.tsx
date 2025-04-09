import { useTranslation } from "react-i18next";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Image } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
	ScrollArea,
	ScrollBar,
} from "@/components/ui/scroll-area";
import type { Category } from "../../types";
import { useLanguage } from "@/context/LanguageContext";

interface CategoryListProps {
	categories: Category[];
	isLoading: boolean;
	onEdit: (category: Category) => void;
	onDelete: (id: string) => void;
	formatDate: (date: string) => string;
}

export const CategoryList = ({
	categories,
	isLoading,
	onEdit,
	onDelete,
	formatDate,
}: CategoryListProps) => {
	const { t, i18n } = useTranslation();
	const isArabic = i18n.language === "ar";
	const { isRTL } = useLanguage();

	if (isLoading) {
		return (
			<div className="rounded-md border">
				<ScrollArea
					dir={isRTL ? "rtl" : "ltr"}
					className="w-full">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-start whitespace-nowrap">
									{t("admin.name")}
								</TableHead>
								<TableHead className="text-start whitespace-nowrap">
									{t("admin.description")}
								</TableHead>
								<TableHead className="text-start whitespace-nowrap">
									{t("admin.createdAt")}
								</TableHead>
								<TableHead className="text-start whitespace-nowrap">
									{t("admin.updatedAt")}
								</TableHead>
								<TableHead className="text-start whitespace-nowrap">
									{t("admin.actions")}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Array.from({ length: 5 }).map((_, index) => (
								<TableRow key={index}>
									<TableCell>
										<div className="flex items-center gap-3">
											<Skeleton className="h-10 w-10 rounded-md flex-shrink-0" />
											<Skeleton className="h-4 w-[100px]" />
										</div>
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-[200px]" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-[100px]" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-[100px]" />
									</TableCell>
									<TableCell>
										<div className="flex justify-start space-x-2">
											<Skeleton className="h-8 w-8" />
											<Skeleton className="h-8 w-8" />
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</div>
		);
	}

	return (
		<div className="rounded-md border">
			<ScrollArea
				dir={isRTL ? "rtl" : "ltr"}
				className="w-full">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-start whitespace-nowrap">
								{t("admin.name")}
							</TableHead>
							<TableHead className="text-start whitespace-nowrap">
								{t("admin.description")}
							</TableHead>
							<TableHead className="text-start whitespace-nowrap">
								{t("admin.createdAt")}
							</TableHead>
							<TableHead className="text-start whitespace-nowrap">
								{t("admin.updatedAt")}
							</TableHead>
							<TableHead className="text-start whitespace-nowrap">
								{t("admin.actions")}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{categories.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="text-center">
									{t("admin.noCategories")}
								</TableCell>
							</TableRow>
						) : (
							categories.map((category) => (
								<TableRow key={category.id}>
									<TableCell className="min-w-[180px]">
										<div className="flex items-center gap-3">
											<div className="h-10 w-10 rounded-md overflow-hidden bg-background flex-shrink-0">
												{category.image ? (
													<img
														src={category.image}
														alt={
															isArabic
																? category.name_ar
																: category.name
														}
														className="h-full w-full object-cover"
														onError={(e) => {
															(
																e.target as HTMLImageElement
															).src = "/placeholder.svg";
														}}
													/>
												) : (
													<div className="h-full w-full flex items-center justify-center bg-muted">
														<Image className="h-5 w-5 text-muted-foreground" />
													</div>
												)}
											</div>
											<div
												className={`font-medium text-start truncate max-w-[150px]`}
												dir={isArabic ? "rtl" : "ltr"}>
												{isArabic
													? category.name_ar
													: category.name}
											</div>
										</div>
									</TableCell>
									<TableCell className="max-w-[250px]">
										<div
											className={`${
												isArabic
													? "text-right"
													: "text-left"
											} truncate`}
											dir={isArabic ? "rtl" : "ltr"}>
											{isArabic
												? category.description_ar
												: category.description}
										</div>
									</TableCell>
									<TableCell className="whitespace-nowrap">
										{formatDate(category.created_at)}
									</TableCell>
									<TableCell className="whitespace-nowrap">
										{formatDate(category.updated_at)}
									</TableCell>
									<TableCell className="whitespace-nowrap">
										<div className="flex justify-start space-x-2">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => onEdit(category)}>
												<Edit className="h-4 w-4 text-blue-500" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												onClick={() =>
													onDelete(category.id)
												}>
												<Trash2 className="h-4 w-4 text-red-500" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
};
