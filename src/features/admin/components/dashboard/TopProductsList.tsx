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
import type { TopProduct } from "../../types";

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

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("admin.topProducts")}</CardTitle>
				<CardDescription>
					{t("admin.topProductsDesc")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-start">
									{t("admin.product")}
								</TableHead>
								<TableHead className="text-start">
									{t("admin.sales")}
								</TableHead>
								<TableHead className="text-start">
									{t("admin.revenue")}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Array.from({ length: 5 }).map((_, index) => (
								<TableRow key={index}>
									<TableCell>
										<div className="flex items-center space-x-3">
											<Skeleton className="h-10 w-10 rounded-full" />
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
							))}
						</TableBody>
					</Table>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-start">
									{t("admin.product")}
								</TableHead>
								<TableHead className="text-start">
									{t("admin.sales")}
								</TableHead>
								<TableHead className="text-start">
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
												<Avatar className="h-10 w-10">
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
												<div className="font-medium">
													{product.name}
												</div>
											</div>
										</TableCell>
										<TableCell className="text-right">
											{product.quantity}
										</TableCell>
										<TableCell className="text-right">
											{formatCurrency(product.total)}
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
