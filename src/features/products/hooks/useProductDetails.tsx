import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import type { Product, Category } from "../types";

export const useProductDetails = () => {
	const { t } = useTranslation();
	const { slug } = useParams<{ slug: string }>();
	const { user } = useAuth();
	const [quantity, setQuantity] = useState(1);

	// Fetch product details
	const {
		data: product,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["product", slug],
		queryFn: async () => {
			if (!slug)
				throw new Error("Product slug is required");

			const { data, error } = await supabase
				.from("products")
				.select(
					`
          *,
          categories:category_id (
            id, name, name_ar, slug
          )
        `,
				)
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

			return data as Product & { categories: Category };
		},
	});

	// Fetch related products
	const { data: relatedProducts } = useQuery({
		queryKey: ["related-products", product?.category_id],
		queryFn: async () => {
			if (!product?.category_id) return [];

			const { data, error } = await supabase
				.from("products")
				.select("*")
				.eq("category_id", product.category_id)
				.neq("id", product.id)
				.limit(4);

			if (error) {
				console.error(
					"Error fetching related products:",
					error,
				);
				return [];
			}

			return data as Product[];
		},
		enabled: !!product?.category_id,
	});

	return {
		product,
		isLoading,
		error,
		relatedProducts: relatedProducts || [],
		quantity,
		setQuantity,
	};
};

export default useProductDetails;
