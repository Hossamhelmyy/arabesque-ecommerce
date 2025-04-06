import { useTranslation } from "react-i18next";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductsErrorProps {
	error: Error;
	onRetry: () => void;
}

const ProductsError = ({
	error,
	onRetry,
}: ProductsErrorProps) => {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
			<div className="bg-red-50 dark:bg-red-950/30 rounded-full p-4">
				<AlertCircle className="w-12 h-12 text-destructive" />
			</div>
			<h3 className="text-xl font-semibold">
				{t("products.errorLoadingProducts")}
			</h3>
			<p className="text-muted-foreground max-w-md">
				{error.message}
			</p>
			<Button
				onClick={onRetry}
				variant="secondary"
				className="gap-2">
				<RefreshCw className="w-4 h-4" />
				{t("common.tryAgain")}
			</Button>
		</div>
	);
};

export default ProductsError;
