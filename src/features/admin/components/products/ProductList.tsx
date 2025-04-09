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
	ScrollArea,
	ScrollBar,
} from "@/components/ui/scroll-area";
import { Image, Edit, Trash2 } from "lucide-react";
import type { Product, Category } from "../../types";
import { useLanguage } from "@/context/LanguageContext";

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
	const { t, i18n } = useTranslation();
	const { isRTL } = useLanguage();

	const getCategoryName = (
		categoryId: string | null,
		lang: "ar" | "en",
	) => {
		if (!categoryId) return t("admin.uncategorized");
		const category = categories.find(
			(c) => c.id === categoryId,
		);
		return lang === "ar"
			? category?.name_ar
			: category?.name || t("admin.uncategorized");
	};

	return (
		<div className="rounded-md border shadow-sm bg-card">
			<ScrollArea
				dir={isRTL ? "rtl" : "ltr"}
				className="w-full">
				<Table>
					<TableHeader className="bg-muted/50">
						<TableRow>
							<TableHead className="text-start whitespace-nowrap">
								{t("admin.product")}
							</TableHead>
							<TableHead className="text-start whitespace-nowrap">
								{t("admin.category")}
							</TableHead>
							<TableHead className="text-start whitespace-nowrap">
								{t("admin.status")}
							</TableHead>
							<TableHead className="text-start whitespace-nowrap">
								{t("admin.price")}
							</TableHead>
							<TableHead className="text-start whitespace-nowrap">
								{t("admin.created")}
							</TableHead>
							<TableHead className="text-start whitespace-nowrap">
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
											<Skeleton className="h-10 w-10 rounded-md flex-shrink-0" />
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
									<TableCell className="min-w-[200px]">
										<div className="flex items-center gap-3">
											<div className="h-10 w-10 rounded-md overflow-hidden bg-background flex-shrink-0">
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
											<div className="min-w-0">
												<div className="font-medium truncate max-w-[150px]">
													{product.name}
												</div>
												<div className="text-sm text-muted-foreground truncate max-w-[150px]">
													{product.name_ar}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell className="whitespace-nowrap">
										{getCategoryName(
											product.category_id,
											i18n.language === "ar" ? "ar" : "en",
										)}
									</TableCell>
									<TableCell className="min-w-[120px]">
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
									<TableCell className="whitespace-nowrap">
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
									<TableCell className="whitespace-nowrap">
										{formatDate(product.created_at)}
									</TableCell>
									<TableCell className="whitespace-nowrap">
										<div className="flex items-center justify-start gap-2">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => onEdit(product)}>
												<Edit className="h-4 w-4 text-blue-500" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="text-red-500 hover:text-destructive"
												onClick={() =>
													onDelete(product.id)
												}>
												<Trash2 className="h-4 w-4 mr-1" />
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
