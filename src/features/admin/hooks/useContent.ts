import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { BannerItem, Promotion } from "../types";

// Define the database types to match Supabase schema
type DbBanner = {
	id: string;
	title: string;
	subtitle: string;
	image: string;
	link: string;
	active: boolean;
	position: number;
	created_at?: string;
	updated_at?: string;
};

type DbPromotion = {
	id: string;
	title: string;
	description: string;
	code: string;
	image?: string;
	discount?: string;
	startDate: string;
	endDate: string;
	active: boolean;
	created_at?: string;
	updated_at?: string;
};

export const useContent = () => {
	const [banners, setBanners] = useState<BannerItem[]>([]);
	const [promotions, setPromotions] = useState<Promotion[]>(
		[],
	);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	const fetchBanners = useCallback(async () => {
		try {
			const { data: bannersData, error } = await supabase
				.from("banners")
				.select("*")
				.order("position", { ascending: true });

			if (error) throw error;

			setBanners(bannersData || []);
		} catch (error) {
			console.error("Error fetching banners:", error);
			toast({
				title: "Error",
				description: "Failed to load banners",
				variant: "destructive",
			});
		}
	}, [toast]);

	const fetchPromotions = useCallback(async () => {
		try {
			const { data: promotionsData, error } = await supabase
				.from("promotions")
				.select("*")
				.order("start_date", { ascending: false });

			if (error) throw error;

			// Transform the data to match the Promotion type
			const transformedPromotions: Promotion[] = (
				promotionsData || []
			).map((promo) => ({
				id: promo.id,
				title: promo.title,
				description: promo.description,
				code: promo.code,
				image: promo.image,
				discount: promo.discount,
				startDate: promo.start_date,
				endDate: promo.end_date,
				active: promo.active,
				created_at: promo.created_at,
				updated_at: promo.updated_at,
			}));

			setPromotions(transformedPromotions);
		} catch (error) {
			console.error("Error fetching promotions:", error);
			toast({
				title: "Error",
				description: "Failed to load promotions",
				variant: "destructive",
			});
		}
	}, [toast]);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			await Promise.all([
				fetchBanners(),
				fetchPromotions(),
			]);
			setIsLoading(false);
		};

		fetchData();
	}, [fetchBanners, fetchPromotions]);

	const createBanner = async (
		banner: Partial<BannerItem>,
	) => {
		setIsSubmitting(true);
		try {
			const { data, error } = await supabase
				.from("banners")
				.insert(banner)
				.select()
				.single();

			if (error) throw error;

			setBanners((prevBanners) => [...prevBanners, data]);
			return data;
		} catch (error) {
			console.error("Error creating banner:", error);
			toast({
				title: "Error",
				description: "Failed to create banner",
				variant: "destructive",
			});
			throw error;
		} finally {
			setIsSubmitting(false);
		}
	};

	const updateBanner = async (
		banner: Partial<BannerItem> & { id: string },
	) => {
		setIsSubmitting(true);
		try {
			const { data, error } = await supabase
				.from("banners")
				.update(banner)
				.eq("id", banner.id)
				.select()
				.single();

			if (error) throw error;

			setBanners((prevBanners) =>
				prevBanners.map((b) =>
					b.id === banner.id ? data : b,
				),
			);
		} catch (error) {
			console.error("Error updating banner:", error);
			toast({
				title: "Error",
				description: "Failed to update banner",
				variant: "destructive",
			});
			throw error;
		} finally {
			setIsSubmitting(false);
		}
	};

	const deleteBanner = async (bannerId: string) => {
		setIsSubmitting(true);
		try {
			const { error } = await supabase
				.from("banners")
				.delete()
				.eq("id", bannerId);

			if (error) throw error;

			setBanners((prevBanners) =>
				prevBanners.filter((b) => b.id !== bannerId),
			);
		} catch (error) {
			console.error("Error deleting banner:", error);
			toast({
				title: "Error",
				description: "Failed to delete banner",
				variant: "destructive",
			});
			throw error;
		} finally {
			setIsSubmitting(false);
		}
	};

	const createPromotion = async (
		promotion: Partial<Promotion>,
	) => {
		setIsSubmitting(true);
		try {
			// Convert to database format
			const dbPromotion = {
				...promotion,
				start_date: promotion.startDate,
				end_date: promotion.endDate,
			};

			const { data, error } = await supabase
				.from("promotions")
				.insert(dbPromotion)
				.select()
				.single();

			if (error) throw error;

			// Transform the response to match the Promotion type
			const newPromotion: Promotion = {
				id: data.id,
				title: data.title,
				description: data.description,
				code: data.code,
				image: data.image,
				discount: data.discount,
				startDate: data.start_date,
				endDate: data.end_date,
				active: data.active,
				created_at: data.created_at,
				updated_at: data.updated_at,
			};

			setPromotions((prevPromotions) => [
				...prevPromotions,
				newPromotion,
			]);
			return newPromotion;
		} catch (error) {
			console.error("Error creating promotion:", error);
			toast({
				title: "Error",
				description: "Failed to create promotion",
				variant: "destructive",
			});
			throw error;
		} finally {
			setIsSubmitting(false);
		}
	};

	const updatePromotion = async (
		promotion: Partial<Promotion> & { id: string },
	) => {
		setIsSubmitting(true);
		try {
			// Convert to database format
			const dbPromotion = {
				...promotion,
				start_date: promotion.startDate,
				end_date: promotion.endDate,
			};

			const { data, error } = await supabase
				.from("promotions")
				.update(dbPromotion)
				.eq("id", promotion.id)
				.select()
				.single();

			if (error) throw error;

			// Transform the response to match the Promotion type
			const updatedPromotion: Promotion = {
				id: data.id,
				title: data.title,
				description: data.description,
				code: data.code,
				image: data.image,
				discount: data.discount,
				startDate: data.start_date,
				endDate: data.end_date,
				active: data.active,
				created_at: data.created_at,
				updated_at: data.updated_at,
			};

			setPromotions((prevPromotions) =>
				prevPromotions.map((p) =>
					p.id === promotion.id ? updatedPromotion : p,
				),
			);
		} catch (error) {
			console.error("Error updating promotion:", error);
			toast({
				title: "Error",
				description: "Failed to update promotion",
				variant: "destructive",
			});
			throw error;
		} finally {
			setIsSubmitting(false);
		}
	};

	const deletePromotion = async (promotionId: string) => {
		setIsSubmitting(true);
		try {
			const { error } = await supabase
				.from("promotions")
				.delete()
				.eq("id", promotionId);

			if (error) throw error;

			setPromotions((prevPromotions) =>
				prevPromotions.filter((p) => p.id !== promotionId),
			);
		} catch (error) {
			console.error("Error deleting promotion:", error);
			toast({
				title: "Error",
				description: "Failed to delete promotion",
				variant: "destructive",
			});
			throw error;
		} finally {
			setIsSubmitting(false);
		}
	};

	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "short",
			day: "numeric",
		};
		return new Date(dateString).toLocaleDateString(
			undefined,
			options,
		);
	};

	return {
		banners,
		promotions,
		isLoading,
		isSubmitting,
		createBanner,
		updateBanner,
		deleteBanner,
		createPromotion,
		updatePromotion,
		deletePromotion,
		formatDate,
	};
};
