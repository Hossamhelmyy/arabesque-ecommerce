import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { Category } from "../types";
import type { Product } from "@/features/products/types";
import type { SortOptions } from "@/features/products/types";

export const useCategoryDetails = () => {
	const { t } = useTranslation();
	const { slug } = useParams<{ slug: string }>();
	const [sort, setSort] = useState<SortOptions>("newest");

	// Fetch category details
	const {
		data: category,
		isLoading: isCategoryLoading,
		error: categoryError,
	} = useQuery({
		queryKey: ["category", slug],
		queryFn: async () => {
			if (!slug)
				throw new Error("Category slug is required");

			const { data, error } = await supabase
				.from("categories")
				.select("*")
				.eq("slug", slug)
				.single();

			if (error) {
				toast({
					title: t("common.error"),
					description: error.message,
					variant: "destructive",
				});
				throw error;
			}

			return data as Category;
		},
	});

	// Fetch category products
	const {
		data: products,
		isLoading: isProductsLoading,
		error: productsError,
	} = useQuery({
		queryKey: ["category-products", slug, sort],
		queryFn: async () => {
			if (!category?.id) return [];

			let query = supabase
				.from("products")
				.select("*")
				.eq("category_id", category.id);

			switch (sort) {
				case "price_asc":
					query = query.order("price", { ascending: true });
					break;
				case "price_desc":
					query = query.order("price", {
						ascending: false,
					});
					break;
				case "newest":
					query = query.order("created_at", {
						ascending: false,
					});
					break;
				case "oldest":
					query = query.order("created_at", {
						ascending: true,
					});
					break;
				default:
					query = query.order("created_at", {
						ascending: false,
					});
			}

			const { data, error } = await query;

			if (error) {
				console.error(
					"Error fetching category products:",
					error,
				);
				return [];
			}

			return data as Product[];
		},
		enabled: !!category?.id,
	});

	return {
		category,
		products: products || [],
		isLoading: isCategoryLoading || isProductsLoading,
		error: categoryError || productsError,
		sort,
		setSort,
	};
};

export default useCategoryDetails;
