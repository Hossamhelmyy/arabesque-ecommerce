import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	useQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { generateSlug } from "@/utils/string";
import type {
	Product,
	Category,
	ProductsData,
} from "../types";

export const useProducts = (): ProductsData => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [selectedProduct, setSelectedProduct] =
		useState<Product | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Fetch all products
	const {
		data: products = [],
		isLoading: isProductsLoading,
	} = useQuery({
		queryKey: ["admin", "products"],
		queryFn: async () => {
			try {
				const { data, error } = await supabase
					.from("products")
					.select("*, category:category_id(*)")
					.order("created_at", { ascending: false });

				if (error) throw error;
				return data as unknown as Product[];
			} catch (error) {
				console.error("Error fetching products:", error);
				toast({
					title: "Error",
					description:
						"Failed to fetch products. Please try again.",
					variant: "destructive",
				});
				return [];
			}
		},
	});

	// Fetch all categories
	const {
		data: categories = [],
		isLoading: isCategoriesLoading,
	} = useQuery({
		queryKey: ["admin", "categories"],
		queryFn: async () => {
			try {
				const { data, error } = await supabase
					.from("categories")
					.select("*")
					.order("name", { ascending: true });

				if (error) throw error;
				return data as Category[];
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

	// Create product mutation
	const createProductMutation = useMutation({
		mutationFn: async (
			productData: Omit<
				Product,
				"id" | "created_at" | "updated_at" | "slug"
			>,
		) => {
			setIsSubmitting(true);
			try {
				// Generate slug from name if not provided
				const slug = generateSlug(productData.name);

				// Construct a properly typed product object
				const productToInsert = {
					name: productData.name,
					name_ar: productData.name_ar || "",
					description: productData.description,
					description_ar: productData.description_ar || "",
					price: productData.price,
					original_price: productData.original_price,
					stock_quantity: productData.stock_quantity || 0,
					image: productData.image,
					category_id: productData.category_id,
					is_featured: productData.is_featured || false,
					is_new: productData.is_new || false,
					is_on_sale: productData.is_on_sale || false,
					slug,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				};

				const { data, error } = await supabase
					.from("products")
					.insert([productToInsert])
					.select()
					.single();

				if (error) throw error;
				return data;
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error
						? error.message
						: "Failed to create product";
				throw new Error(errorMessage);
			} finally {
				setIsSubmitting(false);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["admin", "products"],
			});

			toast({
				title: "Success",
				description: "Product created successfully",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Error",
				description:
					error.message || "Failed to create product",
				variant: "destructive",
			});
		},
	});

	// Update product mutation
	const updateProductMutation = useMutation({
		mutationFn: async ({
			id,
			productData,
		}: {
			id: string;
			productData: Partial<Product>;
		}) => {
			setIsSubmitting(true);
			try {
				// If name is being updated, regenerate the slug
				const updateData = { ...productData };
				if (productData.name) {
					updateData.slug = generateSlug(productData.name);
				}

				updateData.updated_at = new Date().toISOString();

				const { data, error } = await supabase
					.from("products")
					.update(updateData)
					.eq("id", id)
					.select()
					.single();

				if (error) throw error;
				return data as unknown as Product;
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error
						? error.message
						: "Failed to update product";
				throw new Error(errorMessage);
			} finally {
				setIsSubmitting(false);
			}
		},
		onSuccess: (updatedProduct) => {
			queryClient.invalidateQueries({
				queryKey: ["admin", "products"],
			});

			// Update selected product if it's the one being updated
			if (
				selectedProduct &&
				selectedProduct.id === updatedProduct.id
			) {
				setSelectedProduct(updatedProduct);
			}

			toast({
				title: "Success",
				description: "Product updated successfully",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Error",
				description:
					error.message || "Failed to update product",
				variant: "destructive",
			});
		},
	});

	// Delete product mutation
	const deleteProductMutation = useMutation({
		mutationFn: async (id: string) => {
			setIsSubmitting(true);
			try {
				const { error } = await supabase
					.from("products")
					.delete()
					.eq("id", id);

				if (error) throw error;
				return id;
			} catch (error: unknown) {
				const errorMessage =
					error instanceof Error
						? error.message
						: "Failed to delete product";
				throw new Error(errorMessage);
			} finally {
				setIsSubmitting(false);
			}
		},
		onSuccess: (id) => {
			queryClient.invalidateQueries({
				queryKey: ["admin", "products"],
			});

			// Clear selected product if it's the one being deleted
			if (selectedProduct && selectedProduct.id === id) {
				setSelectedProduct(null);
			}

			toast({
				title: "Success",
				description: "Product deleted successfully",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Error",
				description:
					error.message || "Failed to delete product",
				variant: "destructive",
			});
		},
	});

	// Wrapper functions
	const createProduct = async (
		productData: Omit<
			Product,
			"id" | "created_at" | "updated_at" | "slug"
		>,
	) => {
		await createProductMutation.mutateAsync(productData);
	};

	const updateProduct = async (
		id: string,
		productData: Partial<Product>,
	) => {
		await updateProductMutation.mutateAsync({
			id,
			productData,
		});
	};

	const deleteProduct = async (id: string) => {
		await deleteProductMutation.mutateAsync(id);
	};

	// Filter products based on search and category
	const filteredProducts = products.filter((product) => {
		const matchesSearch =
			searchQuery === "" ||
			product.name
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			product.description
				.toLowerCase()
				.includes(searchQuery.toLowerCase());

		const matchesCategory =
			categoryFilter === "" ||
			product.category_id === categoryFilter;

		return matchesSearch && matchesCategory;
	});

	// Filter handlers
	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	const handleCategoryFilter = (categoryId: string) => {
		setCategoryFilter(categoryId);
	};

	// Format functions
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(price);
	};

	return {
		products,
		categories,
		filteredProducts,
		isLoading: isProductsLoading || isCategoriesLoading,
		isSubmitting,
		selectedProduct,
		searchQuery,
		categoryFilter,
		handleSearch,
		handleCategoryFilter,
		setSelectedProduct,
		setSearchQuery,
		createProduct,
		updateProduct,
		deleteProduct,
		formatDate,
		formatPrice,
	};
};

export default useProducts;
