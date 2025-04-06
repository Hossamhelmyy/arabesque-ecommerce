import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type {
	Product,
	Category,
} from "@/features/products/types";
import { Link } from "react-router-dom";

interface ProductInfoProps {
	product: Product & { categories?: Category };
}

const ProductInfo: React.FC<ProductInfoProps> = ({
	product,
}) => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();

	const formatPrice = (price: number) => {
		return price.toFixed(2);
	};

	const hasDiscount =
		product.original_price &&
		product.original_price > product.price;
	const discountPercentage = hasDiscount
		? Math.round(
				((product.original_price - product.price) /
					product.original_price) *
					100,
		  )
		: 0;

	return (
		<div className="space-y-6">
			<div>
				{/* Product Name & Status Badges */}
				<div className="flex flex-wrap items-start justify-between gap-2">
					<h1 className="text-2xl font-bold md:text-3xl">
						{isRTL ? product.name_ar : product.name}
					</h1>
					<div className="flex gap-2">
						{product.is_new && (
							<Badge
								variant="secondary"
								className="px-2 py-1">
								{t("product.new")}
							</Badge>
						)}
						{product.is_on_sale && (
							<Badge
								variant="destructive"
								className="px-2 py-1">
								{t("product.sale")}
							</Badge>
						)}
					</div>
				</div>

				{/* Price */}
				<div className="mt-2 flex items-center gap-2">
					<span className="text-xl font-bold text-primary md:text-2xl">
						${formatPrice(product.price)}
					</span>
					{hasDiscount && (
						<>
							<span className="text-sm text-muted-foreground line-through">
								${formatPrice(product.original_price)}
							</span>
							<Badge
								variant="outline"
								className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
								{discountPercentage}% {t("product.off")}
							</Badge>
						</>
					)}
				</div>

				{/* Categories */}
				{product.categories && (
					<div className="mt-2 text-sm text-muted-foreground">
						<span className="font-medium">
							{t("product.category")}:
						</span>{" "}
						<Link
							to={`/categories/${product.categories.slug}`}
							className="text-primary hover:underline">
							{isRTL
								? product.categories.name_ar
								: product.categories.name}
						</Link>
					</div>
				)}

				{/* Availability */}
				<div className="mt-2 flex items-center text-sm">
					<span className="font-medium text-muted-foreground">
						{t("product.availability")}:
					</span>
					<span
						className={`ml-2 flex items-center ${
							product.stock_quantity > 0
								? "text-green-600"
								: "text-red-600"
						}`}>
						{product.stock_quantity > 0 ? (
							<>{t("product.inStock")}</>
						) : (
							<>{t("product.outOfStock")}</>
						)}
					</span>
				</div>
			</div>

			<Separator />

			{/* Description */}
			<div>
				<h2 className="mb-2 font-medium">
					{t("product.description")}
				</h2>
				<div className="text-sm text-muted-foreground">
					{isRTL && product.description_ar
						? product.description_ar
						: product.description ||
						  t("product.noDescription")}
				</div>
			</div>
		</div>
	);
};

export default ProductInfo;
