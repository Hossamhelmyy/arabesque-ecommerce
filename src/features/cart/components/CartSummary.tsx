import React from "react";
import { useTranslation } from "react-i18next";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";
import type { CartSummary as CartSummaryType } from "../types";

interface CartSummaryProps {
	summary: CartSummaryType;
	itemCount: number;
	onCheckout: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
	summary,
	itemCount,
	onCheckout,
}) => {
	const { t } = useTranslation();

	return (
		<Card className="border rounded-lg">
			<CardHeader>
				<CardTitle>{t("cart.summary")}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex justify-between">
					<span className="text-muted-foreground">
						{t("cart.subtotal")}
					</span>
					<span>${summary.subtotal.toFixed(2)}</span>
				</div>

				<div className="flex justify-between">
					<span className="text-muted-foreground">
						{t("cart.shipping")}
					</span>
					<span>${summary.shipping.toFixed(2)}</span>
				</div>

				<div className="flex justify-between">
					<span className="text-muted-foreground">
						{t("cart.tax")}
					</span>
					<span>${summary.tax.toFixed(2)}</span>
				</div>

				<Separator />

				<div className="flex justify-between font-semibold">
					<span>{t("cart.total")}</span>
					<span>${summary.total.toFixed(2)}</span>
				</div>
			</CardContent>
			<CardFooter>
				<Button
					className="w-full"
					onClick={onCheckout}
					disabled={itemCount === 0}>
					<ShoppingBag className="mr-2 h-4 w-4" />
					{t("cart.checkout")}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default CartSummary;
