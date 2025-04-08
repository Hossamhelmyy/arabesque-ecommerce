import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Promotion } from "../../types";

interface PromotionDetailsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	selectedPromotion: Promotion | null;
	onSave: (promotion: Partial<Promotion>) => void;
	isSubmitting: boolean;
}

export const PromotionDetailsDialog = ({
	open,
	onOpenChange,
	selectedPromotion,
	onSave,
	isSubmitting,
}: PromotionDetailsDialogProps) => {
	const { t } = useTranslation();
	const [formData, setFormData] = useState<
		Partial<Promotion>
	>(
		selectedPromotion || {
			title: "",
			description: "",
			image: "",
			discount: "",
			code: "",
			startDate: new Date().toISOString().split("T")[0],
			endDate: new Date(
				new Date().setMonth(new Date().getMonth() + 1),
			)
				.toISOString()
				.split("T")[0],
			active: true,
		},
	);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSwitchChange = (checked: boolean) => {
		setFormData((prev) => ({ ...prev, active: checked }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formData);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[525px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>
							{selectedPromotion
								? t("admin.editPromotion")
								: t("admin.createPromotion")}
						</DialogTitle>
						<DialogDescription>
							{t("admin.promotionDetailsDesc")}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="title" className="text-right">
								{t("admin.title")}
							</Label>
							<Input
								id="title"
								name="title"
								value={formData.title || ""}
								onChange={handleChange}
								className="col-span-3"
								disabled={isSubmitting}
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label
								htmlFor="description"
								className="text-right">
								{t("admin.description")}
							</Label>
							<Textarea
								id="description"
								name="description"
								value={formData.description || ""}
								onChange={handleChange}
								className="col-span-3"
								disabled={isSubmitting}
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="image" className="text-right">
								{t("admin.imageURL")}
							</Label>
							<Input
								id="image"
								name="image"
								value={formData.image || ""}
								onChange={handleChange}
								className="col-span-3"
								disabled={isSubmitting}
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label
								htmlFor="discount"
								className="text-right">
								{t("admin.discount")}
							</Label>
							<Input
								id="discount"
								name="discount"
								value={formData.discount || ""}
								onChange={handleChange}
								placeholder="e.g., 20% OFF, $10 OFF"
								className="col-span-3"
								disabled={isSubmitting}
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="code" className="text-right">
								{t("admin.promoCode")}
							</Label>
							<Input
								id="code"
								name="code"
								value={formData.code || ""}
								onChange={handleChange}
								className="col-span-3"
								disabled={isSubmitting}
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label
								htmlFor="startDate"
								className="text-right">
								{t("admin.startDate")}
							</Label>
							<Input
								id="startDate"
								name="startDate"
								type="date"
								value={formData.startDate || ""}
								onChange={handleChange}
								className="col-span-3"
								disabled={isSubmitting}
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label
								htmlFor="endDate"
								className="text-right">
								{t("admin.endDate")}
							</Label>
							<Input
								id="endDate"
								name="endDate"
								type="date"
								value={formData.endDate || ""}
								onChange={handleChange}
								className="col-span-3"
								disabled={isSubmitting}
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label
								htmlFor="active"
								className="text-right">
								{t("admin.active")}
							</Label>
							<div className="flex items-center space-x-2 col-span-3">
								<Switch
									id="active"
									checked={formData.active}
									onCheckedChange={handleSwitchChange}
									disabled={isSubmitting}
								/>
								<Label htmlFor="active">
									{formData.active
										? t("admin.active")
										: t("admin.inactive")}
								</Label>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isSubmitting}>
							{t("common.cancel")}
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting
								? t("common.saving")
								: selectedPromotion
								? t("common.save")
								: t("common.create")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
