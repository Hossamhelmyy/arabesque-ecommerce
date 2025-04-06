import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	ArrowRight,
	Loader2,
	ShoppingBag,
	ArrowLeft,
	Search,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
	CategoryCard,
	CategoryCardSkeleton,
} from "@/components/category";

type Category = {
	id: string;
	name: string;
	name_ar: string;
	slug: string;
	image: string | null;
	parent_id: string | null;
	products_count?: number;
};

const CategoriesPage = () => {
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const { isRTL } = useLanguage();
	const [searchQuery, setSearchQuery] = useState("");

	const {
		data: categories,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("categories")
				.select("*, products:products(id)")
				.order("name", { ascending: true });

			if (error) {
				throw error;
			}

			// Transform the data to include product count
			return data.map((category) => ({
				...category,
				products_count: category.products
					? category.products.length
					: 0,
				// Remove the products array to keep it clean
				products: undefined,
			})) as Category[];
		},
	});

	// Filter categories based on search query
	const filteredCategories = categories
		? categories.filter((category) => {
				const searchLower = searchQuery.toLowerCase();
				return (
					category.name
						.toLowerCase()
						.includes(searchLower) ||
					category.name_ar
						.toLowerCase()
						.includes(searchLower)
				);
		  })
		: [];

	if (isLoading) {
		return (
			<div className="container py-8 md:py-12">
				<div className="text-center mb-12">
					<h1 className="text-3xl md:text-4xl font-bold mb-3">
						{t("categories.title")}
					</h1>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						{t("categories.description")}
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{[...Array(8)].map((_, index) => (
						<CategoryCardSkeleton key={index} />
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container py-16 flex flex-col items-center justify-center">
				<div className="text-destructive mb-4">
					<span className="sr-only">
						{t("common.error")}
					</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-8 w-8 mx-auto">
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
				</div>
				<p className="text-muted-foreground">
					{t("common.error")}
				</p>
				<Button
					variant="outline"
					className="mt-4"
					onClick={() => window.location.reload()}>
					{t("common.retry")}
				</Button>
			</div>
		);
	}

	return (
		<div className="container py-8 md:py-12">
			<div className="text-center mb-12">
				<h1 className="text-3xl md:text-4xl font-bold mb-3">
					{t("categories.title")}
				</h1>
				<p className="text-muted-foreground max-w-2xl mx-auto">
					{t("categories.description")}
				</p>
			</div>

			<div className="max-w-md mx-auto mb-8">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder={t("categories.searchPlaceholder")}
						className="pl-9"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>

			{filteredCategories.length === 0 ? (
				<div className="text-center py-16">
					<div className="inline-block p-4 rounded-full bg-muted mb-4">
						<ShoppingBag className="h-8 w-8 text-muted-foreground" />
					</div>
					<h2 className="text-xl font-medium mb-2">
						{t("categories.noResults")}
					</h2>
					<p className="text-muted-foreground max-w-md mx-auto mb-6">
						{t("categories.tryAnotherSearch")}
					</p>
					<Button
						variant="outline"
						onClick={() => setSearchQuery("")}>
						{t("categories.clearSearch")}
					</Button>
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{filteredCategories.map((category, index) => (
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
						{filteredCategories.map((category) => {
							const displayName =
								i18n.language === "ar"
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
										<div className="flex items-center gap-1 text-muted-foreground">
											<span className="text-xs">
												{category.products_count || 0}
											</span>
											{isRTL ? (
												<ArrowLeft className="h-4 w-4" />
											) : (
												<ArrowRight className="h-4 w-4" />
											)}
										</div>
									</Link>
								</Button>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
};

export default CategoriesPage;
