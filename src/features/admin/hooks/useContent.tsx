import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export type Banner = {
	id: string;
	title: string;
	subtitle: string;
	image: string;
	link: string;
	active: boolean;
	position: number;
};

export type Promotion = {
	id: string;
	title: string;
	description: string;
	code: string;
	startDate: string;
	endDate: string;
	active: boolean;
};

export type Page = {
	id: string;
	title: string;
	slug: string;
	content: string;
	lastUpdated: string;
	isPublished: boolean;
};

// Demo data for homepage banners
const initialBanners: Banner[] = [
	{
		id: "banner1",
		title: "Summer Collection",
		subtitle: "Explore our newest arrivals",
		image:
			"https://source.unsplash.com/random/1200x400/?arabic,decor",
		link: "/category/summer",
		active: true,
		position: 1,
	},
	{
		id: "banner2",
		title: "Special Offers",
		subtitle: "Up to 40% off selected items",
		image:
			"https://source.unsplash.com/random/1200x400/?arabic,furniture",
		link: "/sales",
		active: true,
		position: 2,
	},
	{
		id: "banner3",
		title: "Handcrafted Art",
		subtitle: "Discover artisan creations",
		image:
			"https://source.unsplash.com/random/1200x400/?arabic,art",
		link: "/category/art",
		active: false,
		position: 3,
	},
];

// Demo data for promotions
const initialPromotions: Promotion[] = [
	{
		id: "promo1",
		title: "Summer Sale",
		description: "Get 20% off all summer items",
		code: "SUMMER20",
		startDate: "2023-07-01",
		endDate: "2023-08-31",
		active: true,
	},
	{
		id: "promo2",
		title: "Free Shipping",
		description: "Free shipping on orders over $100",
		code: "FREESHIP",
		startDate: "2023-06-15",
		endDate: "2023-12-31",
		active: true,
	},
	{
		id: "promo3",
		title: "New Customer Discount",
		description: "10% off your first order",
		code: "WELCOME10",
		startDate: "2023-01-01",
		endDate: "2023-12-31",
		active: true,
	},
];

// Demo data for pages
const initialPages: Page[] = [
	{
		id: "page1",
		title: "About Us",
		slug: "about-us",
		content:
			"<h1>About Arabesque</h1><p>Your premier destination for authentic Middle Eastern decor and handicrafts.</p>",
		lastUpdated: "2023-06-15",
		isPublished: true,
	},
	{
		id: "page2",
		title: "Terms of Service",
		slug: "terms-of-service",
		content:
			"<h1>Terms of Service</h1><p>Please read these terms carefully before using our website.</p>",
		lastUpdated: "2023-05-23",
		isPublished: true,
	},
	{
		id: "page3",
		title: "Privacy Policy",
		slug: "privacy-policy",
		content:
			"<h1>Privacy Policy</h1><p>This Privacy Policy describes how your personal information is collected, used, and shared.</p>",
		lastUpdated: "2023-05-23",
		isPublished: true,
	},
	{
		id: "page4",
		title: "FAQ",
		slug: "faq",
		content:
			"<h1>Frequently Asked Questions</h1><p>Find answers to commonly asked questions about our products and services.</p>",
		lastUpdated: "2023-07-10",
		isPublished: true,
	},
];

export const useContent = () => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch banners
	const { data: banners = [], isLoading: bannersLoading } =
		useQuery({
			queryKey: ["banners"],
			queryFn: async () => {
				try {
					// In a real app, we would fetch this from the database
					// For now, we'll return dummy data
					await new Promise((resolve) =>
						setTimeout(resolve, 500),
					); // Simulate API delay
					return initialBanners;
				} catch (err) {
					const errorMessage =
						err instanceof Error
							? err.message
							: "Failed to fetch banners";
					setError(errorMessage);
					toast({
						title: t("Error"),
						description: errorMessage,
						variant: "destructive",
					});
					return [];
				}
			},
		});

	// Fetch promotions
	const {
		data: promotions = [],
		isLoading: promotionsLoading,
	} = useQuery({
		queryKey: ["promotions"],
		queryFn: async () => {
			try {
				// In a real app, we would fetch this from the database
				await new Promise((resolve) =>
					setTimeout(resolve, 500),
				); // Simulate API delay
				return initialPromotions;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to fetch promotions";
				setError(errorMessage);
				toast({
					title: t("Error"),
					description: errorMessage,
					variant: "destructive",
				});
				return [];
			}
		},
	});

	// Fetch pages
	const { data: pages = [], isLoading: pagesLoading } =
		useQuery({
			queryKey: ["pages"],
			queryFn: async () => {
				try {
					// In a real app, we would fetch this from the database
					await new Promise((resolve) =>
						setTimeout(resolve, 500),
					); // Simulate API delay
					return initialPages;
				} catch (err) {
					const errorMessage =
						err instanceof Error
							? err.message
							: "Failed to fetch pages";
					setError(errorMessage);
					toast({
						title: t("Error"),
						description: errorMessage,
						variant: "destructive",
					});
					return [];
				}
			},
		});

	// Update banner order
	const updateBannerOrder = useMutation({
		mutationFn: async (updatedBanners: Banner[]) => {
			setIsSubmitting(true);
			try {
				// In a real app, we would save to the database
				await new Promise((resolve) =>
					setTimeout(resolve, 500),
				); // Simulate API delay
				return updatedBanners;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to update banner order";
				throw new Error(errorMessage);
			} finally {
				setIsSubmitting(false);
			}
		},
		onSuccess: (data) => {
			queryClient.setQueryData(["banners"], data);
			toast({
				title: t("Success"),
				description: t("Banner order has been updated."),
			});
		},
		onError: (error: Error) => {
			toast({
				title: t("Error"),
				description:
					error.message ||
					t("Failed to update banner order."),
				variant: "destructive",
			});
		},
	});

	// Add a new banner
	const addBanner = useMutation({
		mutationFn: async (
			newBanner: Omit<Banner, "id" | "position">,
		) => {
			setIsSubmitting(true);
			try {
				// In a real app, we would save to the database
				await new Promise((resolve) =>
					setTimeout(resolve, 500),
				); // Simulate API delay

				// Generate a random ID and set position
				const banner: Banner = {
					...newBanner,
					id: `banner${Date.now()}`,
					position: (banners?.length || 0) + 1,
				};

				return banner;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to add banner";
				throw new Error(errorMessage);
			} finally {
				setIsSubmitting(false);
			}
		},
		onSuccess: (newBanner) => {
			queryClient.setQueryData(
				["banners"],
				(oldBanners: Banner[] = []) => [
					...oldBanners,
					newBanner,
				],
			);
			toast({
				title: t("Success"),
				description: t("New banner has been added."),
			});
		},
		onError: (error: Error) => {
			toast({
				title: t("Error"),
				description:
					error.message || t("Failed to add banner."),
				variant: "destructive",
			});
		},
	});

	// Update a banner
	const updateBanner = useMutation({
		mutationFn: async (updatedBanner: Banner) => {
			setIsSubmitting(true);
			try {
				// In a real app, we would save to the database
				await new Promise((resolve) =>
					setTimeout(resolve, 500),
				); // Simulate API delay
				return updatedBanner;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to update banner";
				throw new Error(errorMessage);
			} finally {
				setIsSubmitting(false);
			}
		},
		onSuccess: (updatedBanner) => {
			queryClient.setQueryData(
				["banners"],
				(oldBanners: Banner[] = []) =>
					oldBanners.map((banner) =>
						banner.id === updatedBanner.id
							? updatedBanner
							: banner,
					),
			);
			toast({
				title: t("Success"),
				description: t("Banner has been updated."),
			});
		},
		onError: (error: Error) => {
			toast({
				title: t("Error"),
				description:
					error.message || t("Failed to update banner."),
				variant: "destructive",
			});
		},
	});

	// Delete a banner
	const deleteBanner = useMutation({
		mutationFn: async (bannerId: string) => {
			setIsSubmitting(true);
			try {
				// In a real app, we would delete from the database
				await new Promise((resolve) =>
					setTimeout(resolve, 500),
				); // Simulate API delay
				return bannerId;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to delete banner";
				throw new Error(errorMessage);
			} finally {
				setIsSubmitting(false);
			}
		},
		onSuccess: (bannerId) => {
			queryClient.setQueryData(
				["banners"],
				(oldBanners: Banner[] = []) => {
					// Remove the deleted banner
					const filteredBanners = oldBanners.filter(
						(banner) => banner.id !== bannerId,
					);

					// Update positions for remaining banners
					return filteredBanners.map((banner, index) => ({
						...banner,
						position: index + 1,
					}));
				},
			);
			toast({
				title: t("Success"),
				description: t("Banner has been deleted."),
			});
		},
		onError: (error: Error) => {
			toast({
				title: t("Error"),
				description:
					error.message || t("Failed to delete banner."),
				variant: "destructive",
			});
		},
	});

	// Add a new promotion
	const addPromotion = useMutation({
		mutationFn: async (
			newPromotion: Omit<Promotion, "id">,
		) => {
			setIsSubmitting(true);
			try {
				// In a real app, we would save to the database
				await new Promise((resolve) =>
					setTimeout(resolve, 500),
				); // Simulate API delay

				// Generate a random ID
				const promotion: Promotion = {
					...newPromotion,
					id: `promo${Date.now()}`,
				};

				return promotion;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to add promotion";
				throw new Error(errorMessage);
			} finally {
				setIsSubmitting(false);
			}
		},
		onSuccess: (newPromotion) => {
			queryClient.setQueryData(
				["promotions"],
				(oldPromotions: Promotion[] = []) => [
					...oldPromotions,
					newPromotion,
				],
			);
			toast({
				title: t("Success"),
				description: t("New promotion has been added."),
			});
		},
		onError: (error: Error) => {
			toast({
				title: t("Error"),
				description:
					error.message || t("Failed to add promotion."),
				variant: "destructive",
			});
		},
	});

	// Update a promotion
	const updatePromotion = useMutation({
		mutationFn: async (updatedPromotion: Promotion) => {
			setIsSubmitting(true);
			try {
				// In a real app, we would save to the database
				await new Promise((resolve) =>
					setTimeout(resolve, 500),
				); // Simulate API delay
				return updatedPromotion;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to update promotion";
				throw new Error(errorMessage);
			} finally {
				setIsSubmitting(false);
			}
		},
		onSuccess: (updatedPromotion) => {
			queryClient.setQueryData(
				["promotions"],
				(oldPromotions: Promotion[] = []) =>
					oldPromotions.map((promotion) =>
						promotion.id === updatedPromotion.id
							? updatedPromotion
							: promotion,
					),
			);
			toast({
				title: t("Success"),
				description: t("Promotion has been updated."),
			});
		},
		onError: (error: Error) => {
			toast({
				title: t("Error"),
				description:
					error.message || t("Failed to update promotion."),
				variant: "destructive",
			});
		},
	});

	// Delete a promotion
	const deletePromotion = useMutation({
		mutationFn: async (promotionId: string) => {
			setIsSubmitting(true);
			try {
				// In a real app, we would delete from the database
				await new Promise((resolve) =>
					setTimeout(resolve, 500),
				); // Simulate API delay
				return promotionId;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to delete promotion";
				throw new Error(errorMessage);
			} finally {
				setIsSubmitting(false);
			}
		},
		onSuccess: (promotionId) => {
			queryClient.setQueryData(
				["promotions"],
				(oldPromotions: Promotion[] = []) =>
					oldPromotions.filter(
						(promotion) => promotion.id !== promotionId,
					),
			);
			toast({
				title: t("Success"),
				description: t("Promotion has been deleted."),
			});
		},
		onError: (error: Error) => {
			toast({
				title: t("Error"),
				description:
					error.message || t("Failed to delete promotion."),
				variant: "destructive",
			});
		},
	});

	// Add a new page
	const addPage = useMutation({
		mutationFn: async (
			newPage: Omit<Page, "id" | "lastUpdated">,
		) => {
			setIsSubmitting(true);
			try {
				// In a real app, we would save to the database
				await new Promise((resolve) =>
					setTimeout(resolve, 500),
				); // Simulate API delay

				// Generate a random ID and set last updated date
				const page: Page = {
					...newPage,
					id: `page${Date.now()}`,
					lastUpdated: new Date()
						.toISOString()
						.split("T")[0],
				};

				return page;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to add page";
				throw new Error(errorMessage);
			} finally {
				setIsSubmitting(false);
			}
		},
		onSuccess: (newPage) => {
			queryClient.setQueryData(
				["pages"],
				(oldPages: Page[] = []) => [...oldPages, newPage],
			);
			toast({
				title: t("Success"),
				description: t("New page has been added."),
			});
		},
		onError: (error: Error) => {
			toast({
				title: t("Error"),
				description:
					error.message || t("Failed to add page."),
				variant: "destructive",
			});
		},
	});

	// Update a page
	const updatePage = useMutation({
		mutationFn: async (
			updatedPage: Omit<Page, "lastUpdated">,
		) => {
			setIsSubmitting(true);
			try {
				// In a real app, we would save to the database
				await new Promise((resolve) =>
					setTimeout(resolve, 500),
				); // Simulate API delay

				// Update the last updated date
				const page: Page = {
					...updatedPage,
					lastUpdated: new Date()
						.toISOString()
						.split("T")[0],
				};

				return page;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to update page";
				throw new Error(errorMessage);
			} finally {
				setIsSubmitting(false);
			}
		},
		onSuccess: (updatedPage) => {
			queryClient.setQueryData(
				["pages"],
				(oldPages: Page[] = []) =>
					oldPages.map((page) =>
						page.id === updatedPage.id ? updatedPage : page,
					),
			);
			toast({
				title: t("Success"),
				description: t("Page has been updated."),
			});
		},
		onError: (error: Error) => {
			toast({
				title: t("Error"),
				description:
					error.message || t("Failed to update page."),
				variant: "destructive",
			});
		},
	});

	// Delete a page
	const deletePage = useMutation({
		mutationFn: async (pageId: string) => {
			setIsSubmitting(true);
			try {
				// In a real app, we would delete from the database
				await new Promise((resolve) =>
					setTimeout(resolve, 500),
				); // Simulate API delay
				return pageId;
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Failed to delete page";
				throw new Error(errorMessage);
			} finally {
				setIsSubmitting(false);
			}
		},
		onSuccess: (pageId) => {
			queryClient.setQueryData(
				["pages"],
				(oldPages: Page[] = []) =>
					oldPages.filter((page) => page.id !== pageId),
			);
			toast({
				title: t("Success"),
				description: t("Page has been deleted."),
			});
		},
		onError: (error: Error) => {
			toast({
				title: t("Error"),
				description:
					error.message || t("Failed to delete page."),
				variant: "destructive",
			});
		},
	});

	return {
		// Data
		banners,
		promotions,
		pages,

		// Loading states
		isLoading:
			bannersLoading || promotionsLoading || pagesLoading,
		isSubmitting,
		error,

		// Banner operations
		updateBannerOrder: (updatedBanners: Banner[]) =>
			updateBannerOrder.mutate(updatedBanners),
		addBanner: (banner: Omit<Banner, "id" | "position">) =>
			addBanner.mutate(banner),
		updateBanner: (banner: Banner) =>
			updateBanner.mutate(banner),
		deleteBanner: (bannerId: string) =>
			deleteBanner.mutate(bannerId),

		// Promotion operations
		addPromotion: (promotion: Omit<Promotion, "id">) =>
			addPromotion.mutate(promotion),
		updatePromotion: (promotion: Promotion) =>
			updatePromotion.mutate(promotion),
		deletePromotion: (promotionId: string) =>
			deletePromotion.mutate(promotionId),

		// Page operations
		addPage: (page: Omit<Page, "id" | "lastUpdated">) =>
			addPage.mutate(page),
		updatePage: (page: Omit<Page, "lastUpdated">) =>
			updatePage.mutate(page),
		deletePage: (pageId: string) =>
			deletePage.mutate(pageId),
	};
};
