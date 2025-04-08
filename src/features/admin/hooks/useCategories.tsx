import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
	useQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Category } from "../types";

// Define the database schema that matches what Supabase returns
interface SupabaseCategory {
	id: string;
	name: string;
	name_ar: string;
	description: string | null;
	description_ar: string | null;
	slug: string;
	parent_id?: string | null;
	image?: string;
	created_at: string;
	updated_at: string;
}

// Helper function to generate slug
const generateSlug = (name: string): string => {
	return name
		.toLowerCase()
		.replace(/[^\w ]+/g, "")
		.replace(/ +/g, "-");
};

// Map from DB schema to our app type
const mapToCategoryModel = (
	dbCategory: SupabaseCategory,
): Category => {
	return {
		id: dbCategory.id,
		name: dbCategory.name,
		name_ar: dbCategory.name_ar,
		slug: dbCategory.slug,
		description: dbCategory.description,
		description_ar: dbCategory.description_ar,
		image: dbCategory.image || null,
		created_at: dbCategory.created_at,
		updated_at: dbCategory.updated_at,
	};
};

// Type for form values - what the form will provide
export interface CategoryFormValues {
	name: string;
	name_ar: string;
	description: string;
	description_ar: string;
	image: string;
}

export function useCategories() {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] =
		useState<Category | null>(null);
	const [filteredCategories, setFilteredCategories] =
		useState<Category[]>([]);

	// Fetch categories
	const {
		data: categories = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["admin", "categories"],
		queryFn: async () => {
			try {
				const { data, error } = await supabase
					.from("categories")
					.select("*")
					.order("created_at", { ascending: false });

				if (error) throw error;

				// Transform data to match our Category type
				return (data || []).map((item) =>
					mapToCategoryModel(item as SupabaseCategory),
				);
			} catch (error) {
				console.error("Error fetching categories:", error);
				toast({
					title: "Error",
					description:
						"Failed to fetch categories. Please try again.",
					variant: "destructive",
				});
				return [];
			}
		},
	});

	// Filter categories based on search query
	useEffect(() => {
		if (!categories) return;

		if (!searchQuery) {
			setFilteredCategories(categories);
			return;
		}

		const filtered = categories.filter(
			(category) =>
				category.name
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				category.description
					.toLowerCase()
					.includes(searchQuery.toLowerCase()),
		);

		setFilteredCategories(filtered);
	}, [categories, searchQuery]);

	// Create a new category
	const createCategoryMutation = useMutation({
		mutationFn: async (formData: CategoryFormValues) => {
			try {
				const slug = generateSlug(formData.name);

				// Map to database format - include name_ar which is required by the DB
				const dbData = {
					name: formData.name,
					name_ar: formData.name_ar,
					slug: slug,
					image: formData.image,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				};

				const { data, error } = await supabase
					.from("categories")
					.insert(dbData)
					.select()
					.single();

				if (error) throw error;

				// Map DB response back to our app model
				const mappedCategory = mapToCategoryModel(
					data as SupabaseCategory,
				);

				// Add description from form data (since it's not in the DB but needed in our app)
				mappedCategory.description = formData.description;
				mappedCategory.description_ar =
					formData.description_ar;

				return mappedCategory;
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error
						? error.message
						: "Failed to create category";
				throw new Error(errorMessage);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["admin", "categories"],
			});
			toast({
				title: "Success",
				description: "Category created successfully",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Error",
				description:
					error.message || "Failed to create category",
				variant: "destructive",
			});
		},
	});

	// Update an existing category
	const updateCategoryMutation = useMutation({
		mutationFn: async ({
			id,
			formData,
		}: {
			id: string;
			formData: CategoryFormValues;
		}) => {
			try {
				const slug = generateSlug(formData.name);

				// Map to database format - include name_ar which is required by the DB
				const dbData = {
					name: formData.name,
					name_ar: formData.name_ar,
					slug: slug,
					image: formData.image,
					updated_at: new Date().toISOString(),
				};

				const { data, error } = await supabase
					.from("categories")
					.update(dbData)
					.eq("id", id)
					.select()
					.single();

				if (error) throw error;

				// Map DB response back to our app model
				const mappedCategory = mapToCategoryModel(
					data as SupabaseCategory,
				);

				// Add description from form data (since it's not in the DB but needed in our app)
				mappedCategory.description = formData.description;
				mappedCategory.description_ar =
					formData.description_ar;

				return mappedCategory;
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error
						? error.message
						: "Failed to update category";
				throw new Error(errorMessage);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["admin", "categories"],
			});
			toast({
				title: "Success",
				description: "Category updated successfully",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Error",
				description:
					error.message || "Failed to update category",
				variant: "destructive",
			});
		},
	});

	// Delete a category
	const deleteCategoryMutation = useMutation({
		mutationFn: async (id: string) => {
			try {
				const { error } = await supabase
					.from("categories")
					.delete()
					.eq("id", id);

				if (error) throw error;
				return id;
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error
						? error.message
						: "Failed to delete category";
				throw new Error(errorMessage);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["admin", "categories"],
			});
			toast({
				title: "Success",
				description: "Category deleted successfully",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Error",
				description:
					error.message || "Failed to delete category",
				variant: "destructive",
			});
		},
	});

	// Wrapper functions
	const createCategory = async (
		formData: CategoryFormValues,
	) => {
		return createCategoryMutation.mutateAsync(formData);
	};

	const updateCategory = async (
		id: string,
		formData: CategoryFormValues,
	) => {
		return updateCategoryMutation.mutateAsync({
			id,
			formData,
		});
	};

	const deleteCategory = async (id: string) => {
		return deleteCategoryMutation.mutateAsync(id);
	};

	// Format date
	const formatDate = useCallback((dateString: string) => {
		return format(new Date(dateString), "MMM d, yyyy");
	}, []);

	return {
		categories,
		filteredCategories,
		isLoading,
		isSubmitting:
			createCategoryMutation.isPending ||
			updateCategoryMutation.isPending ||
			deleteCategoryMutation.isPending,
		searchQuery,
		selectedCategory,
		setSearchQuery,
		setSelectedCategory,
		createCategory,
		updateCategory,
		deleteCategory,
		formatDate,
	};
}

export default useCategories;
