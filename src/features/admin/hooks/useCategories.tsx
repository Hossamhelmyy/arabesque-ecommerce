import { useState } from "react";
import {
	useQuery,
	useQueryClient,
	useMutation,
} from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Category, CategoriesData } from "../types";

// Helper function to generate slug from name
const generateSlug = (name: string): string => {
	return name
		.toLowerCase()
		.replace(/[^\w ]+/g, "")
		.replace(/ +/g, "-");
};

const useCategories = (): CategoriesData => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const [selectedCategory, setSelectedCategory] =
		useState<Category | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] =
		useState<string>("");

	// Fetch all categories
	const { data: categories = [], isLoading } = useQuery({
		queryKey: ["admin", "categories"],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("categories")
				.select("*, products:products(id)")
				.order("name");

			if (error) {
				console.error("Error fetching categories:", error);
				throw new Error(error.message);
			}

			// Calculate products_count for each category
			return data.map((category) => ({
				...category,
				products_count: category.products
					? category.products.length
					: 0,
			}));
		},
	});

	// Format date helper function
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	// Filter categories based on search query
	const filteredCategories = categories.filter(
		(category) => {
			if (!searchQuery) return true;

			const nameMatch = category.name
				.toLowerCase()
				.includes(searchQuery.toLowerCase());

			// Use type assertion to Category to safely access description
			const descriptionMatch = (category as Category)
				.description
				? (category as Category).description
						.toLowerCase()
						.includes(searchQuery.toLowerCase())
				: false;

			return nameMatch || descriptionMatch;
		},
	);

	// Create a new category
	const createCategoryMutation = useMutation({
		mutationFn: async (
			newCategory: Omit<
				Category,
				| "id"
				| "created_at"
				| "updated_at"
				| "products_count"
			>,
		) => {
			const { data, error } = await supabase
				.from("categories")
				.insert([
					{
						name: newCategory.name,
						slug:
							newCategory.slug ||
							generateSlug(newCategory.name),
						description: newCategory.description,
						image_url: newCategory.image_url,
						parent_id: newCategory.parent_id || null,
						name_ar: newCategory.name_ar,
						description_ar: newCategory.description_ar,
					},
				])
				.select()
				.single();

			if (error) {
				console.error("Error creating category:", error);
				throw new Error(error.message);
			}

			return data;
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
			setError(error.message);
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
			category,
		}: {
			id: string;
			category: Partial<
				Omit<Category, "id" | "created_at" | "updated_at">
			>;
		}) => {
			// Generate slug if name is provided but slug is not
			const updateData = { ...category };
			if (category.name && !category.slug) {
				updateData.slug = generateSlug(category.name);
			}

			const { data, error } = await supabase
				.from("categories")
				.update(updateData)
				.eq("id", id)
				.select()
				.single();

			if (error) {
				console.error("Error updating category:", error);
				throw new Error(error.message);
			}

			return data;
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
			setError(error.message);
			toast({
				title: "Error",
				description:
					error.message || "Failed to update category",
				variant: "destructive",
			});
		},
	});

	// Delete an existing category
	const deleteCategoryMutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await supabase
				.from("categories")
				.delete()
				.eq("id", id);

			if (error) {
				console.error("Error deleting category:", error);
				throw new Error(error.message);
			}

			return id;
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
			setError(error.message);
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
		category: Omit<
			Category,
			"id" | "created_at" | "updated_at" | "products_count"
		>,
	) => {
		await createCategoryMutation.mutateAsync(category);
	};

	const updateCategory = async (
		id: string,
		category: Partial<
			Omit<Category, "id" | "created_at" | "updated_at">
		>,
	) => {
		await updateCategoryMutation.mutateAsync({
			id,
			category,
		});
	};

	const deleteCategory = async (id: string) => {
		await deleteCategoryMutation.mutateAsync(id);
	};

	return {
		categories,
		filteredCategories,
		isLoading,
		isSubmitting:
			createCategoryMutation.isPending ||
			updateCategoryMutation.isPending ||
			deleteCategoryMutation.isPending,
		selectedCategory,
		setSelectedCategory,
		createCategory,
		updateCategory,
		deleteCategory,
		error,
		searchQuery,
		setSearchQuery,
		formatDate,
	};
};

export default useCategories;
