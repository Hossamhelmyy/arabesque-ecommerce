import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const CartIcon = () => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();
	const { cartItems } = useCart();
	const cartCount = cartItems.length;

	return (
		<Link to="/cart" className="relative">
			<Button variant="ghost" size="icon">
				<ShoppingCart className="h-5 w-5" />
				<span className="sr-only">{t("common.cart")}</span>
				{cartCount > 0 && (
					<Badge
						className={cn(
							"absolute -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center",
							isRTL ? "-left-1" : "-right-1",
						)}
						variant="destructive">
						{cartCount}
					</Badge>
				)}
			</Button>
		</Link>
	);
};

export default CartIcon;
