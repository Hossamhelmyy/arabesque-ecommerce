import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	Home,
	Edit,
	Trash2,
	CheckCircle,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreVertical } from "lucide-react";
import { AddressDialog } from "./AddressDialog";
import { AddressFormValues } from "./AddressForm";
import {
	fetchAddresses,
	addAddress,
	updateAddress,
	deleteAddress,
	setDefaultAddress,
} from "../api";
import { Address } from "../types";
import { Badge } from "@/components/ui/badge";

export const AddressesList = () => {
	const { t } = useTranslation();
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [addressToDelete, setAddressToDelete] = useState<
		string | null
	>(null);

	// Fetch addresses
	const { data: addresses = [], isLoading } = useQuery({
		queryKey: ["addresses", user?.id],
		queryFn: () => (user ? fetchAddresses(user.id) : []),
		enabled: !!user,
	});

	// Add address mutation
	const addAddressMutation = useMutation({
		mutationFn: (data: AddressFormValues) =>
			user
				? addAddress(user.id, data as Address)
				: Promise.reject("User not found"),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["addresses", user?.id],
			});
			toast({
				title: t("profile.addressAdded"),
				description: t("profile.addressAddedDescription"),
			});
		},
		onError: (error) => {
			console.error("Error adding address:", error);
			toast({
				title: t("common.error"),
				description: t("profile.errorAddingAddress"),
				variant: "destructive",
			});
		},
	});

	// Update address mutation
	const updateAddressMutation = useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: AddressFormValues;
		}) => updateAddress(id, data as Address),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["addresses", user?.id],
			});
			toast({
				title: t("profile.addressUpdated"),
				description: t("profile.addressUpdatedDescription"),
			});
		},
		onError: (error) => {
			console.error("Error updating address:", error);
			toast({
				title: t("common.error"),
				description: t("profile.errorUpdatingAddress"),
				variant: "destructive",
			});
		},
	});

	// Delete address mutation
	const deleteAddressMutation = useMutation({
		mutationFn: (id: string) => deleteAddress(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["addresses", user?.id],
			});
			toast({
				title: t("profile.addressDeleted"),
				description: t("profile.addressDeletedDescription"),
			});
		},
		onError: (error) => {
			console.error("Error deleting address:", error);
			toast({
				title: t("common.error"),
				description: t("profile.errorDeletingAddress"),
				variant: "destructive",
			});
		},
	});

	// Set default address mutation
	const setDefaultAddressMutation = useMutation({
		mutationFn: (id: string) =>
			user
				? setDefaultAddress(user.id, id)
				: Promise.reject("User not found"),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["addresses", user?.id],
			});
			toast({
				title: t("profile.defaultAddressSet"),
				description: t(
					"profile.defaultAddressSetDescription",
				),
			});
		},
		onError: (error) => {
			console.error(
				"Error setting default address:",
				error,
			);
			toast({
				title: t("common.error"),
				description: t(
					"profile.errorSettingDefaultAddress",
				),
				variant: "destructive",
			});
		},
	});

	const handleAddAddress = async (
		data: AddressFormValues,
	) => {
		await addAddressMutation.mutateAsync(data);
	};

	const handleUpdateAddress = async (
		id: string,
		data: AddressFormValues,
	) => {
		await updateAddressMutation.mutateAsync({ id, data });
	};

	const handleDeleteAddress = async () => {
		if (addressToDelete) {
			await deleteAddressMutation.mutateAsync(
				addressToDelete,
			);
			setAddressToDelete(null);
		}
	};

	const handleSetDefaultAddress = async (id: string) => {
		await setDefaultAddressMutation.mutateAsync(id);
	};

	const renderAddressCard = (address: Address) => (
		<div
			key={address.id}
			className="bg-card rounded-lg border p-4 relative">
			{address.is_default && (
				<Badge
					variant="outline"
					className="absolute top-2 right-2 flex items-center gap-1 text-primary">
					<CheckCircle className="h-3 w-3" />
					{t("profile.defaultAddress")}
				</Badge>
			)}

			<div className="mb-4 mt-6">
				<h3 className="font-medium">{address.full_name}</h3>
				<div className="text-sm text-muted-foreground space-y-1 mt-2">
					<p>{address.street_address}</p>
					<p>
						{address.city}, {address.state}{" "}
						{address.postal_code}
					</p>
					<p>{address.country}</p>
					<p className="pt-1">{address.phone_number}</p>
				</div>
			</div>

			<div className="flex justify-between items-center">
				{!address.is_default && (
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							handleSetDefaultAddress(address.id as string)
						}
						disabled={setDefaultAddressMutation.isPending}>
						{t("profile.setAsDefault")}
					</Button>
				)}

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 p-0 ml-auto">
							<MoreVertical className="h-4 w-4" />
							<span className="sr-only">
								{t("common.actions")}
							</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<AddressDialog
							onSave={(data) =>
								handleUpdateAddress(
									address.id as string,
									data,
								)
							}
							address={address}
							trigger={
								<DropdownMenuItem
									onSelect={(e) => e.preventDefault()}>
									<Edit className="mr-2 h-4 w-4" />
									{t("common.edit")}
								</DropdownMenuItem>
							}
						/>
						<AlertDialog
							open={addressToDelete === address.id}
							onOpenChange={(open) =>
								!open && setAddressToDelete(null)
							}>
							<AlertDialogTrigger asChild>
								<DropdownMenuItem
									onSelect={(e) => {
										e.preventDefault();
										setAddressToDelete(
											address.id as string,
										);
									}}
									className="text-destructive focus:text-destructive">
									<Trash2 className="mr-2 h-4 w-4" />
									{t("common.delete")}
								</DropdownMenuItem>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										{t("profile.confirmDeleteAddress")}
									</AlertDialogTitle>
									<AlertDialogDescription>
										{t(
											"profile.confirmDeleteAddressDescription",
										)}
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>
										{t("common.cancel")}
									</AlertDialogCancel>
									<AlertDialogAction
										onClick={handleDeleteAddress}
										className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
										{t("common.delete")}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<div>
					<CardTitle>{t("profile.addresses")}</CardTitle>
					<CardDescription>
						{t("profile.manageAddresses")}
					</CardDescription>
				</div>
				<AddressDialog onSave={handleAddAddress} />
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="space-y-4">
						{[1, 2].map((i) => (
							<div
								key={i}
								className="h-[180px] rounded-lg bg-muted animate-pulse"
							/>
						))}
					</div>
				) : addresses.length > 0 ? (
					<div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
						{addresses.map(renderAddressCard)}
					</div>
				) : (
					<div className="text-center py-8">
						<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
							<Home className="h-6 w-6 text-muted-foreground" />
						</div>
						<h3 className="font-medium mb-2">
							{t("profile.noAddresses")}
						</h3>
						<p className="text-muted-foreground mb-4">
							{t("profile.addAddressMessage")}
						</p>
						<AddressDialog onSave={handleAddAddress} />
					</div>
				)}
			</CardContent>
		</Card>
	);
};
