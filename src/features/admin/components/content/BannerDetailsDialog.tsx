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
import type { BannerItem } from "../../types";

interface BannerDetailsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	selectedBanner: BannerItem | null;
	onSave: (banner: Partial<BannerItem>) => void;
	isSubmitting: boolean;
}

export const BannerDetailsDialog = ({
	open,
	onOpenChange,
	selectedBanner,
	onSave,
	isSubmitting,
}: BannerDetailsDialogProps) => {
	const { t } = useTranslation();
	const [formData, setFormData] = useState<
		Partial<BannerItem>
	>(
		selectedBanner || {
			title: "",
			subtitle: "",
			image: "",
			link: "",
			position: 1,
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
							{selectedBanner
								? t("admin.editBanner")
								: t("admin.createBanner")}
						</DialogTitle>
						<DialogDescription>
							{t("admin.bannerDetailsDesc")}
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
								htmlFor="subtitle"
								className="text-right">
								{t("admin.subtitle")}
							</Label>
							<Textarea
								id="subtitle"
								name="subtitle"
								value={formData.subtitle || ""}
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
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="link" className="text-right">
								{t("admin.link")}
							</Label>
							<Input
								id="link"
								name="link"
								value={formData.link || ""}
								onChange={handleChange}
								className="col-span-3"
								disabled={isSubmitting}
								required
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label
								htmlFor="position"
								className="text-right">
								{t("admin.position")}
							</Label>
							<Input
								id="position"
								name="position"
								type="number"
								min="1"
								value={formData.position || "1"}
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
								: selectedBanner
								? t("common.save")
								: t("common.create")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
