import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import type { Category } from "../types";

export const useCategories = () => {
	const { i18n } = useTranslation();
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredCategories, setFilteredCategories] =
		useState<Category[]>([]);

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
				products: undefined,
			})) as Category[];
		},
	});

	// Filter categories based on search term
	useEffect(() => {
		if (!categories) return;

		if (searchTerm.trim() === "") {
			setFilteredCategories(categories);
		} else {
			const filtered = categories.filter((category) => {
				const name =
					i18n.language === "ar" && category.name_ar
						? category.name_ar
						: category.name;
				return name
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
			});
			setFilteredCategories(filtered);
		}
	}, [searchTerm, categories, i18n.language]);

	return {
		categories,
		filteredCategories,
		isLoading,
		error,
		searchTerm,
		setSearchTerm,
	};
};
