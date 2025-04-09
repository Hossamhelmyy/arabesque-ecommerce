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
import { passwordFormSchema } from "../schemas";
import type { PasswordFormValues } from "../types";

interface PasswordFormProps {
	isChangingPassword: boolean;
	onSubmit: (data: PasswordFormValues) => Promise<void>;
}

export const PasswordForm = ({
	isChangingPassword,
	onSubmit,
}: PasswordFormProps) => {
	const { t } = useTranslation();

	const form = useForm<PasswordFormValues>({
		resolver: zodResolver(passwordFormSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{t("profile.passwordSecurity")}
				</CardTitle>
				<CardDescription>
					{t("profile.updatePasswordDesc")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6">
						<FormField
							control={form.control}
							name="currentPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("profile.currentPassword")}
									</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("profile.newPassword")}
									</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("profile.confirmPassword")}
									</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							disabled={isChangingPassword}>
							{isChangingPassword ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t("common.updating")}
								</>
							) : (
								t("profile.changePassword")
							)}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
