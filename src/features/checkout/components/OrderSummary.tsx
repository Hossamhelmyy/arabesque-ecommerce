import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import type {
	CartItem,
	OrderSummary as OrderSummaryType,
} from "../types";

interface OrderSummaryProps {
	items: CartItem[];
	summary: OrderSummaryType;
}

export const OrderSummary = ({
	items,
	summary,
}: OrderSummaryProps) => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariant = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 },
	};

	return (
		<Card className="border-2">
			<CardHeader className="space-y-2">
				<CardTitle className="text-2xl font-bold">
					{t("checkout.orderSummary")}
				</CardTitle>
				<CardDescription className="text-sm">
					{t("checkout.orderSummaryDesc")}
				</CardDescription>
			</CardHeader>
			<CardContent className="p-6">
				<ScrollArea className="h-[300px] pr-4">
					<motion.div
						className="space-y-6"
						variants={container}
						initial="hidden"
						animate="show">
						{items.map((item) => (
							<motion.div
								dir={isRTL ? "rtl" : "ltr"}
								key={item.id}
								variants={itemVariant}
								className="group flex items-start gap-4  rounded-lg p-2 transition-colors hover:bg-muted/50">
								<div className="relative h-20 w-20 overflow-hidden rounded-md border">
									<img
										src={item.product.image_url}
										alt={item.product.name}
										className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
									/>
								</div>
								<div className="flex flex-1 flex-col space-y-2">
									<div className="flex justify-between">
										<h3 className="font-semibold tracking-tight text-base">
											{item.product.name}
										</h3>
										<p className="font-medium text-base">
											{formatPrice(item.product.price)}
										</p>
									</div>
									<div className="flex items-center justify-between">
										<Badge
											variant="secondary"
											className="text-xs">
											{t("checkout.quantity", {
												count: item.quantity,
											})}
										</Badge>
										<p className="text-sm text-muted-foreground">
											{t("checkout.itemTotal", {
												total: formatPrice(
													item.product.price *
														item.quantity,
												),
											})}
										</p>
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>
				</ScrollArea>

				<Separator className="my-6" />

				<div className="space-y-4">
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">
							{t("checkout.subtotal")}
						</span>
						<span className="font-medium">
							{formatPrice(summary.subtotal)}
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">
							{t("checkout.shipping")}
						</span>
						<span className="font-medium">
							{summary.shipping === 0
								? t("checkout.freeShipping")
								: formatPrice(summary.shipping)}
						</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">
							{t("checkout.tax")}
						</span>
						<span className="font-medium">
							{formatPrice(summary.tax)}
						</span>
					</div>
				</div>
			</CardContent>
			<CardFooter className="border-t bg-muted/50 p-6">
				<div className="flex w-full justify-between">
					<span className="text-lg font-semibold">
						{t("checkout.total")}
					</span>
					<div className="flex flex-col items-end">
						<span className="text-2xl font-bold">
							{formatPrice(summary.total)}
						</span>
						<span className="text-xs text-muted-foreground">
							{t("checkout.taxIncluded")}
						</span>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
};
