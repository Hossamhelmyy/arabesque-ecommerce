import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	CategoryCard,
	CategoryCardSkeleton,
} from "@/components/category";
import { DirectionalIcon } from "@/components/ui/directional-icon";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Category } from "../types";

type CategoryListProps = {
	categories: Category[];
	isLoading?: boolean;
};

export const CategoryList = ({
	categories,
	isLoading,
}: CategoryListProps) => {
	const { t, i18n } = useTranslation();

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{[...Array(8)].map((_, index) => (
					<CategoryCardSkeleton key={index} />
				))}
			</div>
		);
	}

	if (categories.length === 0) {
		return (
			<div className="text-center py-8">
				<h2 className="text-xl font-medium mb-2">
					{t("categories.noResults")}
				</h2>
				<p className="text-muted-foreground mb-6">
					{t("categories.tryAnotherSearch")}
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{categories.map((category, index) => (
					<CategoryCard
						key={category.id}
						category={category}
						imagePriority={index < 4}
					/>
				))}
			</div>

			<Separator className="my-12" />

			<div className="text-center mb-8">
				<h2 className="text-2xl font-bold mb-2">
					{t("categories.browseAll")}
				</h2>
				<p className="text-muted-foreground">
					{t("categories.viewProducts")}
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{categories.map((category) => {
					const displayName =
						i18n.language === "ar" && category.name_ar
							? category.name_ar
							: category.name;

					return (
						<Button
							key={category.id}
							variant="outline"
							className="justify-between h-auto py-3"
							asChild>
							<Link to={`/category/${category.slug}`}>
								<span>{displayName}</span>
								<div className="flex items-center gap-1 text-muted-foreground rtl:space-x-reverse">
									<span className="text-xs">
										{category.products_count || 0}
									</span>
									<DirectionalIcon
										leftIcon={
											<ArrowLeft className="h-4 w-4" />
										}
										rightIcon={
											<ArrowRight className="h-4 w-4" />
										}
									/>
								</div>
							</Link>
						</Button>
					);
				})}
			</div>
		</>
	);
};
