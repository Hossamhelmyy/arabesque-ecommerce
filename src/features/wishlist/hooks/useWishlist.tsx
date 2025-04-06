import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { WishlistItem } from "../types";

export const useWishlist = () => {
	const { user } = useAuth();
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [isLoading, setIsLoading] = useState(false);

	// Fetch user's wishlist
	const {
		data: wishlistItems,
		isLoading: isLoadingWishlist,
	} = useQuery({
		queryKey: ["wishlist", user?.id],
		queryFn: async () => {
			if (!user) return null;

			const { data, error } = await supabase
				.from("wish_list")
				.select("*, products(*)")
				.eq("user_id", user.id);

			if (error) {
				toast({
					title: t("common.error"),
					description: error.message,
					variant: "destructive",
				});
				throw error;
			}

			return data as WishlistItem[];
		},
		enabled: !!user,
	});

	// Check if a product is in the wishlist
	const isInWishlist = useCallback(
		(productId: string) => {
			if (!wishlistItems) return false;
			return wishlistItems.some(
				(item) => item.product_id === productId,
			);
		},
		[wishlistItems],
	);

	// Add to wishlist mutation
	const addToWishlistMutation = useMutation({
		mutationFn: async (productId: string) => {
			if (!user) throw new Error("User not authenticated");

			const { data, error } = await supabase
				.from("wish_list")
				.insert([
					{ user_id: user.id, product_id: productId },
				])
				.select("*");

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["wishlist", user?.id],
			});
			toast({
				title: t("wishlist.addedToWishlist"),
				description: t("wishlist.addedToWishlistDesc"),
			});
		},
		onError: (error) => {
			console.error("Error adding to wishlist:", error);
			toast({
				title: t("common.error"),
				description: t("wishlist.addError"),
				variant: "destructive",
			});
		},
	});

	// Remove from wishlist mutation
	const removeFromWishlistMutation = useMutation({
		mutationFn: async (productId: string) => {
			if (!user) throw new Error("User not authenticated");

			const { error } = await supabase
				.from("wish_list")
				.delete()
				.eq("user_id", user.id)
				.eq("product_id", productId);

			if (error) throw error;
			return productId;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["wishlist", user?.id],
			});
			toast({
				title: t("wishlist.removedFromWishlist"),
				description: t("wishlist.removedFromWishlistDesc"),
			});
		},
		onError: (error) => {
			console.error("Error removing from wishlist:", error);
			toast({
				title: t("common.error"),
				description: t("wishlist.removeError"),
				variant: "destructive",
			});
		},
	});

	// Add to wishlist
	const addToWishlist = async (productId: string) => {
		if (!user) {
			toast({
				title: t("common.authRequired"),
				description: t("wishlist.loginToAddToWishlist"),
				variant: "destructive",
			});
			return;
		}
		await addToWishlistMutation.mutateAsync(productId);
	};

	// Remove from wishlist
	const removeFromWishlist = async (productId: string) => {
		if (!user) return;
		await removeFromWishlistMutation.mutateAsync(productId);
	};

	return {
		wishlistItems,
		isLoading: isLoadingWishlist || isLoading,
		addToWishlist,
		removeFromWishlist,
		isInWishlist,
	};
};
