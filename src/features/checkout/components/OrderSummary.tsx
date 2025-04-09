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
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
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
		<Card className="border-2 sm:sticky sm:top-4">
			<CardHeader className="space-y-2 px-4 sm:px-6">
				<CardTitle className="text-xl sm:text-2xl font-bold">
					{t("checkout.orderSummary")}
				</CardTitle>
				<CardDescription className="text-sm">
					{t("checkout.orderSummaryDesc")}
				</CardDescription>
			</CardHeader>
			<CardContent className="p-4 sm:p-6">
				<ScrollArea className="h-[250px] sm:h-[300px] pr-4">
					<motion.div
						className="space-y-4 sm:space-y-6"
						variants={container}
						initial="hidden"
						animate="show">
						{items.map((item) => (
							<motion.div
								dir={isRTL ? "rtl" : "ltr"}
								key={item.id}
								variants={itemVariant}
								className="group flex items-start gap-3 sm:gap-4 rounded-lg p-2 transition-colors hover:bg-muted/50">
								<div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-md border bg-muted">
									<img
										src={item.product.image_url}
										alt={item.product.name}
										className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-110`}
										onError={(e) => {
											(e.target as HTMLImageElement).src =
												"/placeholder.svg";
										}}
									/>
								</div>
								<div className="flex flex-1 flex-col space-y-1 sm:space-y-2">
									<div className="flex justify-between items-start">
										<h3 className="font-semibold tracking-tight text-sm sm:text-base line-clamp-2">
											{item.product.name}
										</h3>
										<p className="font-medium text-sm sm:text-base whitespace-nowrap ms-2">
											{formatPrice(item.product.price)}
										</p>
									</div>
									<div className="flex items-center justify-between max-[400px]:flex-col max-[400px]:items-start">
										<Badge
											variant="secondary"
											className="text-xs sm:text-sm">
											{t("checkout.quantity", {
												count: item.quantity,
											})}
										</Badge>
										<p className="text-xs sm:text-sm text-muted-foreground">
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

				<Separator className="my-4 sm:my-6" />

				<div className="space-y-3 sm:space-y-4">
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
			<CardFooter className="border-t bg-muted/50 p-4 sm:p-6">
				<div className="flex w-full justify-between items-end">
					<span className="text-base sm:text-lg font-semibold">
						{t("checkout.total")}
					</span>
					<div className="flex flex-col items-end">
						<span className="text-xl sm:text-2xl font-bold">
							{formatPrice(summary.total)}
						</span>
						<span className="text-[10px] sm:text-xs text-muted-foreground">
							{t("checkout.taxIncluded")}
						</span>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
};
