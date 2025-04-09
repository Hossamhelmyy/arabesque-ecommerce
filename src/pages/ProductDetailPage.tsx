import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
	ProductGallery,
	ProductInfo,
	ProductActions,
	RelatedProducts,
} from "@/features/products/components/product-detail";
import { ProductDetailSkeleton } from "@/features/products/components/product-detail/ProductDetailSkeleton";
import { useProductDetails } from "@/features/products/hooks";

interface BreadcrumbItem {
	href: string;
	label?: string;
	translationKey?: string;
}

const ModernProductDetailPage = () => {
	const { t, i18n } = useTranslation();
	const isArabic = i18n.language === "ar";
	const { product, isLoading, error, relatedProducts } =
		useProductDetails();

	if (isLoading) {
		return <ProductDetailSkeleton />;
	}

	if (error || !product) {
		return (
			<div className="container py-16">
				<div className="max-w-lg mx-auto text-center">
					<h1 className="text-2xl font-bold">
						{t("product.notFound")}
					</h1>
					<p className="mt-2 text-muted-foreground">
						{t("product.notFoundDescription")}
					</p>
					<Button asChild className="mt-6">
						<Link to="/products">
							<ArrowLeft className="mr-2 h-4 w-4" />
							{t("product.browseProducts")}
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	// Define breadcrumb items
	const breadcrumbItems: BreadcrumbItem[] = [
		{
			href: "/products",
			translationKey: "products.title",
		},
	];

	// Add category to breadcrumbs if available
	if (product.categories) {
		breadcrumbItems.push({
			href: `/category/${product.categories.slug}`,
			label:
				isArabic && product.categories.name_ar
					? product.categories.name_ar
					: product.categories.name,
		});
	}

	// Add current product as the last breadcrumb item
	breadcrumbItems.push({
		href: `/product/${product.slug}`,
		label:
			isArabic && product.name_ar
				? product.name_ar
				: product.name,
	});

	return (
		<div className="container py-12">
			{/* Breadcrumb */}
			<Breadcrumbs
				items={breadcrumbItems}
				className="mb-6"
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
				{/* Product Gallery */}
				<Suspense
					fallback={
						<div className="h-[400px] bg-muted animate-pulse rounded-lg" />
					}>
					<ProductGallery product={product} />
				</Suspense>

				{/* Product Info & Actions */}
				<div className="space-y-8">
					<ProductInfo product={product} />
					<ProductActions product={product} />

					{/* Additional tabs */}
					{/* <Tabs defaultValue="details" className="mt-8">
						<TabsList>
							<TabsTrigger value="details">
								{t("product.details")}
							</TabsTrigger>
							<TabsTrigger value="shipping">
								{t("product.shipping")}
							</TabsTrigger>
							<TabsTrigger value="returns">
								{t("product.returns")}
							</TabsTrigger>
						</TabsList>
						<TabsContent value="details" className="pt-4">
							<div className="text-sm text-muted-foreground">
								{t("product.detailsTab")}
							</div>
						</TabsContent>
						<TabsContent value="shipping" className="pt-4">
							<div className="text-sm text-muted-foreground">
								{t("product.shippingTab")}
							</div>
						</TabsContent>
						<TabsContent value="returns" className="pt-4">
							<div className="text-sm text-muted-foreground">
								{t("product.returnsTab")}
							</div>
						</TabsContent>
					</Tabs> */}
				</div>
			</div>

			<Separator className="my-12" />

			{/* Related Products */}
			{relatedProducts.length > 0 && (
				<RelatedProducts
					products={relatedProducts}
					currentProductId={product.id}
				/>
			)}
		</div>
	);
};

export default ModernProductDetailPage;
