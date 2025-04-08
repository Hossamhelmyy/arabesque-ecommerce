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
import { Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "../../types";

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
	const { t } = useTranslation();

	if (isLoading) {
		return (
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{t("admin.name")}</TableHead>
							<TableHead>
								{t("admin.description")}
							</TableHead>
							<TableHead>{t("admin.createdAt")}</TableHead>
							<TableHead>{t("admin.updatedAt")}</TableHead>
							<TableHead className="text-right">
								{t("admin.actions")}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 5 }).map((_, index) => (
							<TableRow key={index}>
								<TableCell>
									<Skeleton className="h-4 w-[100px]" />
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
									<div className="flex justify-end space-x-2">
										<Skeleton className="h-8 w-8" />
										<Skeleton className="h-8 w-8" />
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{t("admin.name")}</TableHead>
						<TableHead>{t("admin.description")}</TableHead>
						<TableHead>{t("admin.createdAt")}</TableHead>
						<TableHead>{t("admin.updatedAt")}</TableHead>
						<TableHead className="text-right">
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
								<TableCell>{category.name}</TableCell>
								<TableCell>
									{category.description}
								</TableCell>
								<TableCell>
									{formatDate(category.created_at)}
								</TableCell>
								<TableCell>
									{formatDate(category.updated_at)}
								</TableCell>
								<TableCell>
									<div className="flex justify-end space-x-2">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => onEdit(category)}>
											<Edit className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => onDelete(category.id)}>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
};
