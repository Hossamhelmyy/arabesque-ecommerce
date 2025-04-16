import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
	AddressForm,
	AddressFormValues,
} from "./AddressForm";
import { Address } from "@/features/profile/types";

interface AddressDialogProps {
	onSave: (data: AddressFormValues) => Promise<void>;
	address?: Address;
	trigger?: React.ReactNode;
	title?: string;
	description?: string;
}

export const AddressDialog = ({
	onSave,
	address,
	trigger,
	title,
	description,
}: AddressDialogProps) => {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (data: AddressFormValues) => {
		setIsSubmitting(true);
		try {
			await onSave(data);
			setOpen(false);
		} catch (error) {
			console.error("Error saving address:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const defaultTitle = address
		? t("profile.editAddress")
		: t("profile.addAddress");

	const defaultDescription = address
		? t("profile.editAddressDescription")
		: t("profile.addAddressDescription");

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger || (
					<Button
						variant="outline"
						size="sm"
						className="gap-2">
						<PlusCircle className="h-4 w-4" />
						{t("profile.addAddress")}
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="text-start">
						{title || defaultTitle}
					</DialogTitle>
					<DialogDescription className="text-start">
						{description || defaultDescription}
					</DialogDescription>
				</DialogHeader>
				<AddressForm
					onSubmit={handleSubmit}
					address={address}
					isSubmitting={isSubmitting}
				/>
			</DialogContent>
		</Dialog>
	);
};
