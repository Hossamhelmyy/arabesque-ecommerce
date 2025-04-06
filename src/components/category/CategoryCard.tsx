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

export type CategoryCardProps = {
	category: {
		id: string;
		name: string;
		name_ar: string;
		slug: string;
		image: string | null;
		products_count?: number;
	};
	imagePriority?: boolean;
	className?: string;
};

export const CategoryCard = ({
	category,
	imagePriority = false,
	className,
}: CategoryCardProps) => {
	const { t, i18n } = useTranslation();
	const { isRTL } = useLanguage();
	const [isHovered, setIsHovered] = useState(false);

	const displayName =
		i18n.language === "ar"
			? category.name_ar
			: category.name;

	return (
		<Card
			className={cn(
				"group overflow-hidden border transition-all hover:shadow-lg",
				className,
			)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}>
			<Link
				to={`/category/${category.slug}`}
				className="block h-full">
				<div className="relative overflow-hidden aspect-[4/3]">
					{/* Overlay gradient */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

					{/* Category image */}
					{category.image ? (
						<img
							src={category.image}
							alt={displayName}
							loading={imagePriority ? "eager" : "lazy"}
							className={cn(
								"w-full h-full object-cover transition-transform duration-700",
								isHovered ? "scale-110" : "scale-100",
							)}
							onError={(e) => {
								(e.target as HTMLImageElement).src =
									"/placeholder.svg";
							}}
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center bg-muted">
							<Grid3X3 className="h-12 w-12 text-muted-foreground opacity-50" />
						</div>
					)}

					{/* Category name overlay */}
					<div className="absolute bottom-0 left-0 right-0 p-4 z-20">
						<h3 className="font-bold text-xl text-white mb-1 line-clamp-1">
							{displayName}
						</h3>
						{category.products_count !== undefined && (
							<Badge
								variant="outline"
								className="bg-black/30 text-white border-white/20 backdrop-blur-sm">
								{t("category.productsCount", {
									count: category.products_count,
								})}
							</Badge>
						)}
					</div>
				</div>

				<CardContent className="p-4">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="font-medium text-lg mb-1 line-clamp-1">
								{displayName}
							</h3>
							<p className="text-sm text-muted-foreground">
								{t("category.browseProducts")}
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
							{isRTL ? (
								<ArrowLeft className="h-5 w-5" />
							) : (
								<ArrowRight className="h-5 w-5" />
							)}
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
