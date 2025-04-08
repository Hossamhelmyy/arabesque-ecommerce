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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Image,
	MoreHorizontal,
	Pencil,
	Trash2,
} from "lucide-react";
import type { Product, Category } from "../../types";

interface ProductListProps {
	products: Product[];
	categories: Category[];
	isLoading: boolean;
	onEdit: (product: Product) => void;
	onDelete: (id: string) => void;
	formatDate: (date: string) => string;
	formatPrice: (price: number) => string;
}

export const ProductList = ({
	products,
	categories,
	isLoading,
	onEdit,
	onDelete,
	formatDate,
	formatPrice,
}: ProductListProps) => {
	const { t } = useTranslation();

	const getCategoryName = (categoryId: string | null) => {
		if (!categoryId) return t("admin.uncategorized");
		const category = categories.find(
			(c) => c.id === categoryId,
		);
		return category?.name || t("admin.uncategorized");
	};

	return (
		<div className="rounded-md border shadow-sm bg-card">
			<div className="relative w-full overflow-auto">
				<Table>
					<TableHeader className="bg-muted/50">
						<TableRow>
							<TableHead className="text-start">
								{t("admin.product")}
							</TableHead>
							<TableHead className="text-start">
								{t("admin.category")}
							</TableHead>
							<TableHead className="text-start">
								{t("admin.status")}
							</TableHead>
							<TableHead className="text-start">
								{t("admin.price")}
							</TableHead>
							<TableHead className="text-start">
								{t("admin.created")}
							</TableHead>
							<TableHead className="text-right">
								{t("admin.actions")}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							Array.from({ length: 5 }).map((_, index) => (
								<TableRow key={index}>
									<TableCell>
										<div className="flex items-center gap-3">
											<Skeleton className="h-10 w-10 rounded-md" />
											<div className="space-y-1">
												<Skeleton className="h-4 w-[150px]" />
												<Skeleton className="h-3 w-[120px]" />
											</div>
										</div>
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-[80px]" />
									</TableCell>
									<TableCell>
										<div className="flex flex-wrap gap-1">
											<Skeleton className="h-5 w-16 rounded-full" />
										</div>
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-[60px]" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-[80px]" />
									</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-2">
											<Skeleton className="h-8 w-8 rounded-md" />
											<Skeleton className="h-8 w-8 rounded-md" />
										</div>
									</TableCell>
								</TableRow>
							))
						) : products.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="h-24 text-center">
									{t("admin.noProductsFound")}
								</TableCell>
							</TableRow>
						) : (
							products.map((product) => (
								<TableRow
									key={product.id}
									className="group hover:bg-muted/50">
									<TableCell>
										<div className="flex items-center gap-3">
											<div className="h-10 w-10 rounded-md overflow-hidden bg-background">
												{product.image ? (
													<img
														src={product.image}
														alt={product.name}
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
											<div>
												<div className="font-medium">
													{product.name}
												</div>
												<div className="text-sm text-muted-foreground">
													{product.name_ar}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell>
										{getCategoryName(product.category_id)}
									</TableCell>
									<TableCell>
										<div className="flex flex-wrap gap-1">
											{product.is_featured && (
												<Badge variant="outline">
													{t("admin.featured")}
												</Badge>
											)}
											{product.is_new && (
												<Badge variant="outline">
													{t("admin.new")}
												</Badge>
											)}
											{product.is_on_sale && (
												<Badge variant="outline">
													{t("admin.onSale")}
												</Badge>
											)}
											{!product.is_featured &&
												!product.is_new &&
												!product.is_on_sale && (
													<span className="text-sm text-muted-foreground">
														-
													</span>
												)}
										</div>
									</TableCell>
									<TableCell>
										<div className="font-medium text-sm">
											{formatPrice(product.price)}
										</div>
										{product.original_price &&
											product.is_on_sale && (
												<div className="text-xs text-muted-foreground line-through">
													{formatPrice(
														product.original_price,
													)}
												</div>
											)}
									</TableCell>
									<TableCell>
										{formatDate(product.created_at)}
									</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => onEdit(product)}>
												<Pencil className="h-4 w-4 mr-1" />
												{t("admin.edit")}
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="text-destructive hover:text-destructive"
												onClick={() =>
													onDelete(product.id)
												}>
												<Trash2 className="h-4 w-4 mr-1" />
												{t("admin.delete")}
											</Button>
										</div>

										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="md:hidden">
													<MoreHorizontal className="h-4 w-4" />
													<span className="sr-only">
														{t("admin.actions")}
													</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() => onEdit(product)}>
													<Pencil className="h-4 w-4 mr-2" />
													{t("admin.edit")}
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														onDelete(product.id)
													}
													className="text-destructive focus:text-destructive">
													<Trash2 className="h-4 w-4 mr-2" />
													{t("admin.delete")}
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
