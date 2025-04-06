import React from "react";
import { useTranslation } from "react-i18next";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EmptyCart: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
			<div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
				<ShoppingBag className="h-12 w-12 text-primary" />
			</div>

			<div className="space-y-2 max-w-md">
				<h2 className="text-2xl font-semibold">
					{t("cart.emptyCartTitle")}
				</h2>
				<p className="text-muted-foreground">
					{t("cart.emptyCartDescription")}
				</p>
			</div>

			<Button
				onClick={() => navigate("/products")}
				className="mt-4">
				{t("cart.continueShopping")}
				<ArrowRight className="ml-2 h-4 w-4" />
			</Button>
		</div>
	);
};

export default EmptyCart;
