import { useTranslation } from "react-i18next";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import {
	ScrollArea,
	ScrollBar,
} from "@/components/ui/scroll-area";
import type { TopProduct } from "../../types";
import { useLanguage } from "@/context/LanguageContext";

interface TopProductsListProps {
	products: TopProduct[];
	isLoading: boolean;
	formatCurrency: (amount: number) => string;
}

export const TopProductsList = ({
	products,
	isLoading,
	formatCurrency,
}: TopProductsListProps) => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("admin.topProducts")}</CardTitle>
				<CardDescription>
					{t("admin.topProductsDesc")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ScrollArea
					dir={isRTL ? "rtl" : "ltr"}
					className="w-full">
					{isLoading ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="text-start whitespace-nowrap">
										{t("admin.product")}
									</TableHead>
									<TableHead className="text-start whitespace-nowrap">
										{t("admin.sales")}
									</TableHead>
									<TableHead className="text-start whitespace-nowrap">
										{t("admin.revenue")}
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{Array.from({ length: 5 }).map(
									(_, index) => (
										<TableRow key={index}>
											<TableCell>
												<div className="flex items-center space-x-3">
													<Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
													<Skeleton className="h-4 w-[180px]" />
												</div>
											</TableCell>
											<TableCell className="text-right">
												<Skeleton className="h-4 w-12 ml-auto" />
											</TableCell>
											<TableCell className="text-right">
												<Skeleton className="h-4 w-16 ml-auto" />
											</TableCell>
										</TableRow>
									),
								)}
							</TableBody>
						</Table>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="text-start whitespace-nowrap">
										{t("admin.product")}
									</TableHead>
									<TableHead className="text-start whitespace-nowrap">
										{t("admin.sales")}
									</TableHead>
									<TableHead className="text-start whitespace-nowrap">
										{t("admin.revenue")}
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{products.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={3}
											className="text-center">
											{t("admin.noProducts")}
										</TableCell>
									</TableRow>
								) : (
									products.map((product) => (
										<TableRow key={product.id}>
											<TableCell>
												<div className="flex items-center space-x-3">
													<Avatar className="h-10 w-10 flex-shrink-0">
														<AvatarImage
															src={product.image}
															alt={product.name}
															onError={(e) => {
																(
																	e.target as HTMLImageElement
																).src =
																	"https://placehold.co/100?text=Error";
															}}
														/>
														<AvatarFallback>
															{product.name
																.substring(0, 2)
																.toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<div className="font-medium truncate max-w-[150px]">
														{product.name}
													</div>
												</div>
											</TableCell>
											<TableCell className="text-right whitespace-nowrap">
												{product.quantity}
											</TableCell>
											<TableCell className="text-right whitespace-nowrap">
												{formatCurrency(product.total)}
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					)}
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</CardContent>
		</Card>
	);
};
