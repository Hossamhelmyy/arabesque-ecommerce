import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	ArrowRight,
	ArrowLeft,
	Grid3X3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DirectionalIcon } from "@/components/ui/directional-icon";

export interface Category {
	id: string;
	name: string;
	name_ar?: string;
	slug: string;
	description?: string;
	description_ar?: string;
	image?: string;
	parent_id?: string | null;
	created_at?: string;
	updated_at?: string;
	products_count?: number;
}

export interface CategoryCardProps {
	category: Category;
	className?: string;
	imagePriority?: boolean;
}

export const CategoryCard = ({
	category,
	className,
	imagePriority = false,
}: CategoryCardProps) => {
	const { t, i18n } = useTranslation();
	const { isRTL } = useLanguage();
	const [isHovered, setIsHovered] = useState(false);

	const displayName =
		i18n.language === "ar" && category.name_ar
			? category.name_ar
			: category.name;

	return (
		<Card
			className={cn(
				"overflow-hidden transition-all duration-300 hover:shadow-md group h-full",
				className,
			)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}>
			<Link
				to={`/category/${category.slug}`}
				aria-label={`${t(
					"categories.browseCategory",
				)}: ${displayName}`}
				className="flex flex-col h-full">
				<div className="relative overflow-hidden">
					{category.image ? (
						<div className="aspect-[4/3] overflow-hidden bg-muted">
							<img
								src={category.image}
								alt={displayName}
								className={cn(
									"w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
									isHovered && "scale-105",
								)}
								loading={imagePriority ? "eager" : "lazy"}
							/>
						</div>
					) : (
						<div className="aspect-[4/3] flex items-center justify-center bg-muted">
							<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
								<span className="text-xl font-medium text-primary">
									{displayName.charAt(0).toUpperCase()}
								</span>
							</div>
						</div>
					)}

					{/* Optional Overlay */}
					<div
						className={cn(
							"absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity",
							isHovered && "opacity-100",
						)}
					/>
				</div>

				<CardContent className="p-4 flex-grow">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="font-medium text-lg mb-1 line-clamp-1">
								{displayName}
							</h3>
							<p className="text-sm text-muted-foreground">
								{t("categories.browseProducts")}
							</p>
						</div>
						<Button
							variant="outline"
							size="icon"
							className={cn(
								"h-10 w-10 rounded-full transition-all duration-300",
								isHovered
									? "bg-primary text-primary-foreground"
									: "bg-muted text-muted-foreground",
							)}>
							<DirectionalIcon
								leftIcon={<ArrowLeft className="h-5 w-5" />}
								rightIcon={
									<ArrowRight className="h-5 w-5" />
								}
							/>
						</Button>
					</div>
				</CardContent>
			</Link>
		</Card>
	);
};

export const CategoryCardSkeleton = () => {
	return (
		<Card className="overflow-hidden">
			<div className="animate-pulse">
				<div className="aspect-[4/3] bg-muted" />
				<CardContent className="p-4">
					<div className="flex items-center justify-between">
						<div className="space-y-2">
							<div className="h-5 w-32 bg-muted rounded" />
							<div className="h-4 w-24 bg-muted rounded" />
						</div>
						<div className="h-10 w-10 bg-muted rounded-full" />
					</div>
				</CardContent>
			</div>
		</Card>
	);
};

export default CategoryCard;
