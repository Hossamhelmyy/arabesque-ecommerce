import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { profileFormSchema } from "../schemas";
import type { Profile, ProfileFormValues } from "../types";

interface ProfileFormProps {
	profile: Profile | null;
	isUpdating: boolean;
	onSubmit: (data: ProfileFormValues) => Promise<void>;
}

export const ProfileForm = ({
	profile,
	isUpdating,
	onSubmit,
}: ProfileFormProps) => {
	const { t } = useTranslation();

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			firstName: profile?.first_name || "",
			lastName: profile?.last_name || "",
			firstName_ar: profile?.first_name_ar || "",
			lastName_ar: profile?.last_name_ar || "",
			phone: profile?.phone || "",
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("profile.personalInfo")}</CardTitle>
				<CardDescription>
					{t("profile.updateProfileDesc")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6">
						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{t("checkout.firstName")} (English)
											</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{t("checkout.lastName")} (English)
											</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="firstName_ar"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{t("checkout.firstName")} (العربية)
											</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastName_ar"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{t("checkout.lastName")} (العربية)
											</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("checkout.phone")}
										</FormLabel>
										<FormControl>
											<Input {...field} type="tel" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type="submit" disabled={isUpdating}>
							{isUpdating ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t("common.saving")}
								</>
							) : (
								t("profile.updateProfile")
							)}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
