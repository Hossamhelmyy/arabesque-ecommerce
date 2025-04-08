import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import type { BannerItem, Promotion } from "../types";

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

			// If no banners, provide some mock data
			if (!bannersData || bannersData.length === 0) {
				const mockBanners: BannerItem[] = [
					{
						id: "1",
						title: "Summer Collection",
						subtitle: "Explore our new summer arrivals",
						image:
							"https://placehold.co/1200x400/e4e4e7/7f7f86?text=Summer+Collection",
						link: "/collections/summer",
						position: 1,
						active: true,
					},
					{
						id: "2",
						title: "Sale up to 50%",
						subtitle:
							"Limited time offer on selected items",
						image:
							"https://placehold.co/1200x400/f5deb3/a9947d?text=Sale+50%+Off",
						link: "/collections/sale",
						position: 2,
						active: true,
					},
				];
				setBanners(mockBanners);
				return;
			}

			setBanners(bannersData as BannerItem[]);
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
				.order("startDate", { ascending: false });

			if (error) throw error;

			// If no promotions, provide some mock data
			if (!promotionsData || promotionsData.length === 0) {
				const mockPromotions: Promotion[] = [
					{
						id: "1",
						title: "Welcome Discount",
						description: "Get 10% off your first order",
						image:
							"https://placehold.co/600x400/d1d5db/6b7280?text=10%+Off",
						discount: "10% OFF",
						code: "WELCOME10",
						startDate: "2023-01-01",
						endDate: "2023-12-31",
						active: true,
					},
					{
						id: "2",
						title: "Free Shipping",
						description: "Free shipping on orders over $50",
						image:
							"https://placehold.co/600x400/dbeafe/3b82f6?text=Free+Shipping",
						discount: "Free Shipping",
						code: "FREESHIP",
						startDate: "2023-01-01",
						endDate: "2023-12-31",
						active: true,
					},
				];
				setPromotions(mockPromotions);
				return;
			}

			setPromotions(promotionsData as Promotion[]);
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
			// In a real app, you would save to Supabase
			// const { data, error } = await supabase.from('banners').insert(banner).select().single();
			// if (error) throw error;

			// For demo, we'll just update the state directly
			const newBanner: BannerItem = {
				id: Date.now().toString(),
				title: banner.title || "",
				subtitle: banner.subtitle || "",
				image: banner.image || "",
				link: banner.link || "",
				position: banner.position || 1,
				active:
					banner.active !== undefined
						? banner.active
						: true,
			};

			setBanners((prevBanners) => [
				...prevBanners,
				newBanner,
			]);
			return newBanner;
		} catch (error) {
			console.error("Error creating banner:", error);
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
			// In a real app, you would update in Supabase
			// const { error } = await supabase.from('banners').update(banner).eq('id', banner.id);
			// if (error) throw error;

			// For demo, we'll just update the state directly
			setBanners((prevBanners) =>
				prevBanners.map((b) =>
					b.id === banner.id ? { ...b, ...banner } : b,
				),
			);
		} catch (error) {
			console.error("Error updating banner:", error);
			throw error;
		} finally {
			setIsSubmitting(false);
		}
	};

	const deleteBanner = async (bannerId: string) => {
		setIsSubmitting(true);
		try {
			// In a real app, you would delete from Supabase
			// const { error } = await supabase.from('banners').delete().eq('id', bannerId);
			// if (error) throw error;

			// For demo, we'll just update the state directly
			setBanners((prevBanners) =>
				prevBanners.filter((b) => b.id !== bannerId),
			);
		} catch (error) {
			console.error("Error deleting banner:", error);
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
			// In a real app, you would save to Supabase
			// const { data, error } = await supabase.from('promotions').insert(promotion).select().single();
			// if (error) throw error;

			// For demo, we'll just update the state directly
			const newPromotion: Promotion = {
				id: Date.now().toString(),
				title: promotion.title || "",
				description: promotion.description || "",
				image: promotion.image || "",
				discount: promotion.discount || "",
				code: promotion.code || "",
				startDate:
					promotion.startDate ||
					new Date().toISOString().split("T")[0],
				endDate:
					promotion.endDate ||
					new Date(
						new Date().setMonth(new Date().getMonth() + 1),
					)
						.toISOString()
						.split("T")[0],
				active:
					promotion.active !== undefined
						? promotion.active
						: true,
			};

			setPromotions((prevPromotions) => [
				...prevPromotions,
				newPromotion,
			]);
			return newPromotion;
		} catch (error) {
			console.error("Error creating promotion:", error);
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
			// In a real app, you would update in Supabase
			// const { error } = await supabase.from('promotions').update(promotion).eq('id', promotion.id);
			// if (error) throw error;

			// For demo, we'll just update the state directly
			setPromotions((prevPromotions) =>
				prevPromotions.map((p) =>
					p.id === promotion.id
						? { ...p, ...promotion }
						: p,
				),
			);
		} catch (error) {
			console.error("Error updating promotion:", error);
			throw error;
		} finally {
			setIsSubmitting(false);
		}
	};

	const deletePromotion = async (promotionId: string) => {
		setIsSubmitting(true);
		try {
			// In a real app, you would delete from Supabase
			// const { error } = await supabase.from('promotions').delete().eq('id', promotionId);
			// if (error) throw error;

			// For demo, we'll just update the state directly
			setPromotions((prevPromotions) =>
				prevPromotions.filter((p) => p.id !== promotionId),
			);
		} catch (error) {
			console.error("Error deleting promotion:", error);
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
