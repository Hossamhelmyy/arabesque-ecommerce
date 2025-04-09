import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { EmailSettings } from "../../types";

interface EmailSettingsFormProps {
	initialValues: EmailSettings;
	onSubmit: (values: EmailSettings) => Promise<void>;
	isSubmitting: boolean;
}

const emailSettingsSchema = z.object({
	smtp_host: z
		.string()
		.min(1, "validation.smtpHostRequired"),
	smtp_port: z
		.string()
		.min(1, "validation.smtpPortRequired"),
	smtp_user: z
		.string()
		.min(1, "validation.smtpUsernameRequired"),
	smtp_password: z
		.string()
		.min(1, "validation.smtpPasswordRequired"),
	sender_name: z
		.string()
		.min(1, "validation.senderNameRequired"),
	sender_email: z
		.string()
		.email("validation.email")
		.min(1, "validation.senderEmailRequired"),
	email_template: z.string().optional(),
});

export const EmailSettingsForm = ({
	initialValues,
	onSubmit,
	isSubmitting,
}: EmailSettingsFormProps) => {
	const { t } = useTranslation();
	const form = useForm<EmailSettings>({
		resolver: zodResolver(emailSettingsSchema),
		defaultValues: initialValues,
	});

	const handleSubmit = async (values: EmailSettings) => {
		await onSubmit(values);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("admin.emailSettings")}</CardTitle>
				<CardDescription>
					{t("admin.emailSettingsDescription")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="smtp_host"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("admin.smtpHost")}
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
								name="smtp_port"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("admin.smtpPort")}
										</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="smtp_user"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("admin.smtpUsername")}
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
								name="smtp_password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("admin.smtpPassword")}
										</FormLabel>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="sender_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("admin.senderName")}
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
								name="sender_email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											{t("admin.senderEmail")}
										</FormLabel>
										<FormControl>
											<Input type="email" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="email_template"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{t("admin.emailTemplate")}
									</FormLabel>
									<FormControl>
										<Textarea
											rows={4}
											{...field}
											value={field.value || ""}
											placeholder={t(
												"admin.emailTemplatePlaceholder",
											)}
										/>
									</FormControl>
									<FormDescription>
										{t("admin.emailTemplateDescription")}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting
								? t("common.saving")
								: t("common.save")}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
