import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useContent } from "../hooks/useContent";
import { ContentHeader } from "../components/content/ContentHeader";
import { BannerList } from "../components/content/BannerList";
import { BannerDetailsDialog } from "../components/content/BannerDetailsDialog";
import { PromotionList } from "../components/content/PromotionList";
import { PromotionDetailsDialog } from "../components/content/PromotionDetailsDialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { BannerItem, Promotion } from "../types";

export const ContentView = () => {
	const { t } = useTranslation();
	const { toast } = useToast();
	const {
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
	} = useContent();

	// State for dialogs
	const [bannerDialogOpen, setBannerDialogOpen] =
		useState(false);
	const [promotionDialogOpen, setPromotionDialogOpen] =
		useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] =
		useState(false);

	// State for items
	const [selectedBanner, setSelectedBanner] =
		useState<BannerItem | null>(null);
	const [selectedPromotion, setSelectedPromotion] =
		useState<Promotion | null>(null);
	const [itemToDelete, setItemToDelete] = useState<{
		id: string;
		type: "banner" | "promotion";
	} | null>(null);

	// Banner handlers
	const handleCreateBanner = () => {
		setSelectedBanner(null);
		setBannerDialogOpen(true);
	};

	const handleEditBanner = (banner: BannerItem) => {
		setSelectedBanner(banner);
		setBannerDialogOpen(true);
	};

	const handleSaveBanner = async (
		banner: Partial<BannerItem>,
	) => {
		try {
			if (selectedBanner) {
				await updateBanner({
					...banner,
					id: selectedBanner.id,
				});
				toast({
					title: t("admin.bannerUpdated"),
					description: t("admin.bannerUpdatedDesc"),
				});
			} else {
				await createBanner(banner);
				toast({
					title: t("admin.bannerCreated"),
					description: t("admin.bannerCreatedDesc"),
				});
			}
			setBannerDialogOpen(false);
		} catch (error) {
			toast({
				title: t("admin.error"),
				description: t("admin.errorSavingBanner"),
				variant: "destructive",
			});
		}
	};

	const handleDeleteBanner = (bannerId: string) => {
		setItemToDelete({ id: bannerId, type: "banner" });
		setDeleteDialogOpen(true);
	};

	// Promotion handlers
	const handleCreatePromotion = () => {
		setSelectedPromotion(null);
		setPromotionDialogOpen(true);
	};

	const handleEditPromotion = (promotion: Promotion) => {
		setSelectedPromotion(promotion);
		setPromotionDialogOpen(true);
	};

	const handleSavePromotion = async (
		promotion: Partial<Promotion>,
	) => {
		try {
			if (selectedPromotion) {
				await updatePromotion({
					...promotion,
					id: selectedPromotion.id,
				});
				toast({
					title: t("admin.promotionUpdated"),
					description: t("admin.promotionUpdatedDesc"),
				});
			} else {
				await createPromotion(promotion);
				toast({
					title: t("admin.promotionCreated"),
					description: t("admin.promotionCreatedDesc"),
				});
			}
			setPromotionDialogOpen(false);
		} catch (error) {
			toast({
				title: t("admin.error"),
				description: t("admin.errorSavingPromotion"),
				variant: "destructive",
			});
		}
	};

	const handleDeletePromotion = (promotionId: string) => {
		setItemToDelete({ id: promotionId, type: "promotion" });
		setDeleteDialogOpen(true);
	};

	// Delete confirmation handlers
	const handleConfirmDelete = async () => {
		if (!itemToDelete) return;

		try {
			if (itemToDelete.type === "banner") {
				await deleteBanner(itemToDelete.id);
				toast({
					title: t("admin.bannerDeleted"),
					description: t("admin.bannerDeletedDesc"),
				});
			} else {
				await deletePromotion(itemToDelete.id);
				toast({
					title: t("admin.promotionDeleted"),
					description: t("admin.promotionDeletedDesc"),
				});
			}
		} catch (error) {
			toast({
				title: t("admin.error"),
				description: t("admin.errorDeletingItem"),
				variant: "destructive",
			});
		} finally {
			setDeleteDialogOpen(false);
			setItemToDelete(null);
		}
	};

	return (
		<div className="container mx-auto py-6 space-y-6">
			<ContentHeader />

			<Tabs defaultValue="banners">
				<TabsList className="grid w-full grid-cols-2 mb-6">
					<TabsTrigger value="banners">
						{t("admin.banners")}
					</TabsTrigger>
					<TabsTrigger value="promotions">
						{t("admin.promotions")}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="banners">
					<BannerList
						banners={banners}
						isLoading={isLoading}
						onEdit={handleEditBanner}
						onDelete={handleDeleteBanner}
						onCreate={handleCreateBanner}
					/>
				</TabsContent>

				<TabsContent value="promotions">
					<PromotionList
						promotions={promotions}
						isLoading={isLoading}
						onEdit={handleEditPromotion}
						onDelete={handleDeletePromotion}
						onCreate={handleCreatePromotion}
						formatDate={formatDate}
					/>
				</TabsContent>
			</Tabs>

			{/* Dialogs */}
			<BannerDetailsDialog
				open={bannerDialogOpen}
				onOpenChange={setBannerDialogOpen}
				selectedBanner={selectedBanner}
				onSave={handleSaveBanner}
				isSubmitting={isSubmitting}
			/>

			<PromotionDetailsDialog
				open={promotionDialogOpen}
				onOpenChange={setPromotionDialogOpen}
				selectedPromotion={selectedPromotion}
				onSave={handleSavePromotion}
				isSubmitting={isSubmitting}
			/>

			<AlertDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t("admin.confirmDeletion")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{itemToDelete?.type === "banner"
								? t("admin.confirmDeleteBanner")
								: t("admin.confirmDeletePromotion")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isSubmitting}>
							{t("common.cancel")}
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDelete}
							disabled={isSubmitting}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
							{isSubmitting
								? t("common.deleting")
								: t("common.delete")}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};
